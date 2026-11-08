const form = document.querySelector("#ikigai-form");
const results = document.querySelector("#results");
const resultsMessage = document.querySelector("#results-message");
const editAnswersButton = document.querySelector("#edit-answers");
const findButton = document.querySelector("#find-button");

const API_URL = "https://ikigai-gemini-api.apenisoara.workers.dev";

// Public Turnstile site key from Cloudflare Dashboard → Turnstile.
// Create a widget that allows checkerandu.github.io and apenisoara.github.io.
const TURNSTILE_SITE_KEY = "0x4AAAAAAF3zu4B_maR1YAyf";

const BUTTON_LABEL = "Explore my Ikigai ↗";
const RATE_STORAGE_KEY = "ikigai.rateLimit.v1";
const CLIENT_ID_STORAGE_KEY = "ikigai.clientId.v1";

// First request is free; each later request waits longer (shared Gemini quota).
const BACKOFF_BASE_MS = 30_000;
const BACKOFF_MAX_MS = 15 * 60_000;
const BACKOFF_IDLE_RESET_MS = 60 * 60_000;
const CLIENT_DAILY_LIMIT = 8;

let turnstileWidgetId = null;
let cooldownTimerId = null;
let requestInFlight = false;

/**
 * Stable anonymous browser session id (not IP). Shared NAT / firewall users
 * each get their own limit bucket as long as localStorage persists.
 */
function getClientId() {
  try {
    const existing = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (existing && /^[A-Za-z0-9_-]{16,128}$/.test(existing)) {
      return existing;
    }
  } catch {
    // Fall through and create an in-memory id for this page load.
  }

  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "")
      : `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;

  try {
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
  } catch {
    // Private mode may block persistence; id still works for this tab session.
  }
  return id;
}

function initTurnstile() {
  const host = document.querySelector("#turnstile-widget");
  if (!host || !window.turnstile) return;

  if (!TURNSTILE_SITE_KEY) {
    host.innerHTML =
      "<p class=\"turnstile-missing\">Add TURNSTILE_SITE_KEY in script.js after creating a Cloudflare Turnstile widget.</p>";
    return;
  }

  turnstileWidgetId = window.turnstile.render(host, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: "light"
  });
}

function getTurnstileToken() {
  if (!TURNSTILE_SITE_KEY) {
    throw new Error("Turnstile is not configured on this page yet.");
  }
  if (!window.turnstile || turnstileWidgetId === null) {
    throw new Error("Human verification is still loading. Please try again in a moment.");
  }
  const token = window.turnstile.getResponse(turnstileWidgetId);
  if (!token) {
    throw new Error("Please complete the human verification check.");
  }
  return token;
}

function resetTurnstile() {
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.reset(turnstileWidgetId);
  }
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function backoffMs(priorRequests) {
  if (priorRequests <= 0) return 0;
  const wait = BACKOFF_BASE_MS * 2 ** (priorRequests - 1);
  return Math.min(BACKOFF_MAX_MS, wait);
}

function defaultRateState() {
  return {
    day: todayKey(),
    dayCount: 0,
    streak: 0,
    lastRequestAt: 0,
    nextAllowedAt: 0
  };
}

function readRateState() {
  try {
    const raw = localStorage.getItem(RATE_STORAGE_KEY);
    if (!raw) return defaultRateState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultRateState();

    const state = {
      ...defaultRateState(),
      ...parsed
    };

    const now = Date.now();
    if (state.day !== todayKey()) {
      state.day = todayKey();
      state.dayCount = 0;
    }

    // Returning after a long quiet period counts as a fresh start.
    if (state.lastRequestAt && now - state.lastRequestAt >= BACKOFF_IDLE_RESET_MS) {
      state.streak = 0;
      state.nextAllowedAt = 0;
    }

    return state;
  } catch {
    return defaultRateState();
  }
}

function writeRateState(state) {
  try {
    localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode / blocked storage — in-memory state still applies for this session.
  }
}

function formatWait(ms) {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getGate(state = readRateState()) {
  const now = Date.now();

  if (state.dayCount >= CLIENT_DAILY_LIMIT) {
    return {
      ok: false,
      reason: "day",
      waitMs: 0,
      message:
        "You've reached today's exploration limit for this browser. Please come back tomorrow so others can try too."
    };
  }

  const waitMs = Math.max(0, (Number(state.nextAllowedAt) || 0) - now);
  if (waitMs > 0) {
    return {
      ok: false,
      reason: "backoff",
      waitMs,
      message: `Please wait ${formatWait(waitMs)} before exploring again. This keeps the shared AI quota available for first-time visitors.`
    };
  }

  return { ok: true, waitMs: 0, message: "" };
}

function setButtonIdleLabel(label = BUTTON_LABEL) {
  findButton.textContent = label;
}

function syncButtonAvailability() {
  if (requestInFlight) return;

  const gate = getGate();
  if (!gate.ok && gate.reason === "backoff") {
    findButton.disabled = true;
    setButtonIdleLabel(`Wait ${formatWait(gate.waitMs)}…`);
    return;
  }

  if (!gate.ok && gate.reason === "day") {
    findButton.disabled = true;
    setButtonIdleLabel("Daily limit reached");
    return;
  }

  findButton.disabled = false;
  setButtonIdleLabel(BUTTON_LABEL);
}

function startCooldownTicker() {
  if (cooldownTimerId) clearInterval(cooldownTimerId);
  syncButtonAvailability();
  cooldownTimerId = setInterval(() => {
    const gate = getGate();
    syncButtonAvailability();
    if (gate.ok || gate.reason === "day") {
      clearInterval(cooldownTimerId);
      cooldownTimerId = null;
    }
  }, 1000);
}

function registerClientAttempt({ serverRetryAfterSec = 0 } = {}) {
  const state = readRateState();
  const now = Date.now();

  if (state.day !== todayKey(new Date(now))) {
    state.day = todayKey(new Date(now));
    state.dayCount = 0;
  }

  if (state.lastRequestAt && now - state.lastRequestAt >= BACKOFF_IDLE_RESET_MS) {
    state.streak = 0;
  }

  state.streak += 1;
  state.dayCount += 1;
  state.lastRequestAt = now;

  const localWait = backoffMs(state.streak);
  const serverWait = Math.max(0, Number(serverRetryAfterSec) || 0) * 1000;
  state.nextAllowedAt = now + Math.max(localWait, serverWait);

  writeRateState(state);
  startCooldownTicker();
  return state;
}

function applyServerCooldown(retryAfterSec) {
  const seconds = Math.max(0, Number(retryAfterSec) || 0);
  if (!seconds) return;

  const state = readRateState();
  const until = Date.now() + seconds * 1000;
  state.nextAllowedAt = Math.max(Number(state.nextAllowedAt) || 0, until);
  writeRateState(state);
  startCooldownTicker();
}

function parseRetryAfter(response, data) {
  if (typeof data?.retryAfter === "number" && data.retryAfter > 0) {
    return data.retryAfter;
  }
  const header = response.headers.get("Retry-After");
  if (!header) return 0;
  const asSeconds = Number(header);
  if (Number.isFinite(asSeconds) && asSeconds > 0) return asSeconds;
  const asDate = Date.parse(header);
  if (Number.isFinite(asDate)) {
    return Math.max(0, Math.ceil((asDate - Date.now()) / 1000));
  }
  return 0;
}

function showResultsMessage(text) {
  results.hidden = false;
  resultsMessage.replaceChildren();
  resultsMessage.textContent = text;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAnalysis(text) {
  resultsMessage.replaceChildren();

  const lines = text.split(/\r?\n/);
  let currentList = null;

  for (const rawLine of lines) {
    // Remove common Markdown formatting safely.
    const line = rawLine.trim()
      .replace(/^#{1,3}\s+/, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/_(.*?)_/g, "$1");

    if (!line) {
      currentList = null;
      continue;
    }

    // Numbered and bulleted lists.
    const listMatch = line.match(/^(?:[-*]\s+|\d+[.)]\s+)(.+)$/);

    if (listMatch) {
      const numbered = /^\d+[.)]\s+/.test(line);
      const type = numbered ? "ol" : "ul";

      if (!currentList || currentList.tagName.toLowerCase() !== type) {
        currentList = document.createElement(type);
        resultsMessage.appendChild(currentList);
      }

      const item = document.createElement("li");
      item.textContent = listMatch[1];
      currentList.appendChild(item);
      continue;
    }

    currentList = null;

    // Recognise headings even if Gemini uses bold text instead of #.
    const isHeading =
      line.length < 100 &&
      /^(direction\s*\d*|why it fits|next step|small next step|summary|recommendation|your ikigai|possible direction)/i.test(line);

    const element = document.createElement(isHeading ? "h3" : "p");
    element.textContent = line;
    resultsMessage.appendChild(element);
  }
}

window.addEventListener("load", () => {
  initTurnstile();
  startCooldownTicker();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;
  if (requestInFlight) return;

  const gate = getGate();
  if (!gate.ok) {
    showResultsMessage(gate.message);
    startCooldownTicker();
    return;
  }

  let turnstileToken;
  try {
    turnstileToken = getTurnstileToken();
  } catch (error) {
    showResultsMessage(error.message);
    return;
  }

  const answers = {
    love: form.elements.love.value.trim(),
    good: form.elements.good.value.trim(),
    paid: form.elements.paid.value.trim(),
    world: form.elements.world.value.trim(),
    turnstileToken,
    clientId: getClientId()
  };

  requestInFlight = true;
  findButton.disabled = true;
  findButton.textContent = "Exploring your Ikigai...";
  showResultsMessage("Analysing your answers...");

  try {
    // Count the attempt before the network call so refresh/spam mid-flight still backs off.
    registerClientAttempt();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });

    const data = await response.json().catch(() => ({}));
    const retryAfter = parseRetryAfter(response, data);

    if (response.status === 429) {
      applyServerCooldown(retryAfter || Math.ceil(backoffMs(readRateState().streak) / 1000));
      throw new Error(
        data.error ||
          "Too many requests right now. Please wait a bit so the shared AI quota stays available."
      );
    }

    if (!response.ok || data.error) {
      if (retryAfter) applyServerCooldown(retryAfter);
      throw new Error(data.error || "Analysis failed.");
    }

    if (typeof data.result !== "string" || !data.result.trim()) {
      throw new Error("Gemini returned an empty result.");
    }

    // Keep a copy of the full response for debugging.
    console.log("Full Gemini response:", data.result);
    console.log("Response length:", data.result.length);

    results.hidden = false;
    renderAnalysis(data.result);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Ikigai request failed:", error);
    showResultsMessage(
      error?.message && !/failed to fetch|networkerror/i.test(error.message)
        ? error.message
        : "We couldn't complete your analysis. Please try again. " +
          "If the problem continues, check the browser Console and Cloudflare Worker logs."
    );
  } finally {
    requestInFlight = false;
    resetTurnstile();
    startCooldownTicker();
  }
});

editAnswersButton.addEventListener("click", () => {
  results.hidden = true;
  document.querySelector("#love").focus();
});
