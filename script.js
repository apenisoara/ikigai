const form = document.querySelector("#ikigai-form");
const results = document.querySelector("#results");
const resultsMessage = document.querySelector("#results-message");
const saveResultsActions = document.querySelector("#save-results-actions");
const printResultsButton = document.querySelector("#print-results");
const emailResultsButton = document.querySelector("#email-results");
const editAnswersButton = document.querySelector("#edit-answers");
const findButton = document.querySelector("#find-button");
const langSelect = document.querySelector("#lang-select");

const API_URL = "https://ikigai-gemini-api.apenisoara.workers.dev";

// Public Turnstile site key from Cloudflare Dashboard → Turnstile.
// Create a widget that allows checkerandu.github.io and apenisoara.github.io.
const TURNSTILE_SITE_KEY = "0x4AAAAAAF3zu4B_maR1YAyf";

const RATE_STORAGE_KEY = "ikigai.rateLimit.v1";
const CLIENT_ID_STORAGE_KEY = "ikigai.clientId.v1";

// First request is free; each later request waits longer (shared Gemini quota).
const BACKOFF_BASE_MS = 30_000;
const BACKOFF_MAX_MS = 15 * 60_000;
const BACKOFF_IDLE_RESET_MS = 60 * 60_000;
const CLIENT_DAILY_LIMIT = 8;
// Many mail clients truncate mailto: URLs around this size.
const EMAIL_BODY_MAX_CHARS = 1600;

const RUM_ACTION_REQUESTED = "ikigai_analysis_requested";
const RUM_ACTION_COMPLETED = "ikigai_analysis_completed";
const RUM_ACTION_FAILED = "ikigai_analysis_failed";
const RUM_TIMING_ANALYSIS = "ikigai_analysis_duration";

let turnstileWidgetId = null;
let cooldownTimerId = null;
let requestInFlight = false;
let currentLocale = I18N.defaultLocale;
let resultsHoldCustomContent = false;
let lastSavableResultText = "";

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
    // Fall through and create an in-memory id for the page load.
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

async function hashClientId(clientId) {
  if (!clientId) return null;

  try {
    const data = new TextEncoder().encode(clientId);
    const digest = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

function recordRumAction(name, metadata = {}) {
  try {
    window.DD_RUM?.addAction(name, metadata);
  } catch {
    // Telemetry must never break the user flow.
  }
}

function startRumAnalysisTiming() {
  try {
    window.DD_RUM?.startDurationTiming?.(RUM_TIMING_ANALYSIS);
  } catch {
    // Telemetry must never break the user flow.
  }
}

function stopRumAnalysisTiming() {
  try {
    window.DD_RUM?.stopDurationTiming?.(RUM_TIMING_ANALYSIS);
  } catch {
    // Telemetry must never break the user flow.
  }
}

function initTurnstile() {
  const host = document.querySelector("#turnstile-widget");
  if (!host || !window.turnstile) return;

  if (!TURNSTILE_SITE_KEY) {
    host.innerHTML = `<p class="turnstile-missing">${t("turnstileMissing", currentLocale)}</p>`;
    return;
  }

  turnstileWidgetId = window.turnstile.render(host, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: "light"
  });
}

function getTurnstileToken() {
  if (!TURNSTILE_SITE_KEY) {
    throw new Error(t("turnstileNotConfigured", currentLocale));
  }
  if (!window.turnstile || turnstileWidgetId === null) {
    throw new Error(t("turnstileLoading", currentLocale));
  }
  const token = window.turnstile.getResponse(turnstileWidgetId);
  if (!token) {
    throw new Error(t("turnstileRequired", currentLocale));
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
      message: t("dayLimitMessage", currentLocale)
    };
  }

  const waitMs = Math.max(0, (Number(state.nextAllowedAt) || 0) - now);
  if (waitMs > 0) {
    return {
      ok: false,
      reason: "backoff",
      waitMs,
      message: t("backoffMessage", currentLocale, { time: formatWait(waitMs) })
    };
  }

  return { ok: true, waitMs: 0, message: "" };
}

function setFindButtonLabel(label, { withArrow = false } = {}) {
  findButton.replaceChildren();
  findButton.append(document.createTextNode(label));
  if (withArrow) {
    findButton.append(document.createTextNode(" "));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    findButton.appendChild(arrow);
  }
}

function syncButtonAvailability() {
  if (requestInFlight) return;

  const gate = getGate();
  if (!gate.ok && gate.reason === "backoff") {
    findButton.disabled = true;
    setFindButtonLabel(t("waitButton", currentLocale, { time: formatWait(gate.waitMs) }));
    return;
  }

  if (!gate.ok && gate.reason === "day") {
    findButton.disabled = true;
    setFindButtonLabel(t("dailyLimitButton", currentLocale));
    return;
  }

  findButton.disabled = false;
  setFindButtonLabel(t("findButton", currentLocale), { withArrow: true });
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

function setSaveActionsVisible(visible) {
  if (!saveResultsActions) return;
  saveResultsActions.hidden = !visible;
}

function clearSavableResult() {
  lastSavableResultText = "";
  setSaveActionsVisible(false);
}

function showResultsMessage(text) {
  results.hidden = false;
  resultsHoldCustomContent = true;
  clearSavableResult();
  resultsMessage.replaceChildren();
  resultsMessage.textContent = text;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showRateLimitMessage(text) {
  results.hidden = false;
  resultsHoldCustomContent = true;
  clearSavableResult();
  resultsMessage.replaceChildren();

  const message = document.createElement("p");
  message.textContent = text;
  resultsMessage.appendChild(message);

  const more = document.createElement("p");
  const link = document.createElement("a");
  link.href = "about.html#rate-limiting";
  link.textContent = t("rateLimitLearnMore", currentLocale);
  more.appendChild(link);
  resultsMessage.appendChild(more);

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAnalysis(text) {
  resultsHoldCustomContent = true;
  lastSavableResultText = text.trim();
  setSaveActionsVisible(Boolean(lastSavableResultText));
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
      line.length < 100 && I18N.headingPattern.test(line);

    const element = document.createElement(isHeading ? "h3" : "p");
    element.textContent = line;
    resultsMessage.appendChild(element);
  }
}

function buildEmailHref(resultText) {
  const intro = t("emailBodyIntro", currentLocale);
  const subject = t("emailSubject", currentLocale);
  const truncatedNote = t("emailBodyTruncated", currentLocale);
  const prefix = `${intro}\n\n`;
  let core = resultText.trim();
  let truncated = false;

  const compose = (text) =>
    truncated ? `${prefix}${text}…${truncatedNote}` : `${prefix}${text}`;

  // mailto: URLs are length-limited in many clients; keep the encoded body short.
  while (
    encodeURIComponent(compose(core)).length > EMAIL_BODY_MAX_CHARS &&
    core.length > 80
  ) {
    truncated = true;
    core = core.slice(0, Math.floor(core.length * 0.85)).trimEnd();
  }

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(core))}`;
}

function setLocale(locale) {
  currentLocale = applyTranslations(locale);
  if (!resultsHoldCustomContent) {
    resultsMessage.textContent = t("resultsPlaceholder", currentLocale);
  }
  syncButtonAvailability();
}

function showAppVersion() {
  const el = document.querySelector("#app-version");
  const version = window.__IKIGAI_APP__?.version;
  if (!el || !version) return;
  el.textContent = `v${version}`;
  el.hidden = false;
}

window.addEventListener("load", () => {
  setLocale(getLocale());
  showAppVersion();
  initTurnstile();
  startCooldownTicker();
});

langSelect?.addEventListener("change", () => {
  setLocale(langSelect.value);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;
  if (requestInFlight) return;

  const gate = getGate();
  if (!gate.ok) {
    showRateLimitMessage(gate.message);
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
    lang: currentLocale,
    turnstileToken,
    clientId: getClientId()
  };

  const analysisStartedAt = performance.now();
  const clientIdHash = await hashClientId(answers.clientId);

  recordRumAction(RUM_ACTION_REQUESTED, {
    locale: currentLocale,
    client_id_hash: clientIdHash,
    client_daily_limit: CLIENT_DAILY_LIMIT
  });

  startRumAnalysisTiming();

  requestInFlight = true;
  findButton.disabled = true;
  setFindButtonLabel(t("exploring", currentLocale));
  showResultsMessage(t("analysing", currentLocale));

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
      recordRumAction(RUM_ACTION_FAILED, {
        status: "rate_limited",
        http_status: response.status,
        retry_after_seconds: retryAfter || null
      });

      applyServerCooldown(retryAfter || Math.ceil(backoffMs(readRateState().streak) / 1000));
      const rateLimitError = new Error(
        data.error || t("tooManyRequests", currentLocale)
      );
      rateLimitError.isRateLimit = true;
      throw rateLimitError;
    }

    if (!response.ok || data.error) {
      recordRumAction(RUM_ACTION_FAILED, {
        status: "api_error",
        http_status: response.status,
        error_type: "api_error"
      });

      if (retryAfter) applyServerCooldown(retryAfter);
      throw new Error(data.error || t("analysisFailed", currentLocale));
    }

    if (typeof data.result !== "string" || !data.result.trim()) {
      recordRumAction(RUM_ACTION_FAILED, {
        status: "empty_response",
        http_status: response.status
      });

      throw new Error(t("emptyResult", currentLocale));
    }

    recordRumAction(RUM_ACTION_COMPLETED, {
      status: "success",
      http_status: response.status,
      response_length: data.result.length,
      duration_ms: Math.round(performance.now() - analysisStartedAt)
    });

    stopRumAnalysisTiming();

    results.hidden = false;
    renderAnalysis(data.result);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    recordRumAction(RUM_ACTION_FAILED, {
      status: "network_or_client_error",
      error_name: error?.name || "Error"
    });

    console.error("Ikigai request failed:", error);
    const message =
      error?.message && !/failed to fetch|networkerror/i.test(error.message)
        ? error.message
        : t("networkError", currentLocale);
    if (error?.isRateLimit) {
      showRateLimitMessage(message);
    } else {
      showResultsMessage(message);
    }
  } finally {
    requestInFlight = false;
    resetTurnstile();
    startCooldownTicker();
  }
});

printResultsButton?.addEventListener("click", () => {
  if (!lastSavableResultText) return;
  window.print();
});

emailResultsButton?.addEventListener("click", () => {
  if (!lastSavableResultText) return;
  const href = buildEmailHref(lastSavableResultText);
  window.location.href = href;
});

editAnswersButton.addEventListener("click", () => {
  results.hidden = true;
  resultsHoldCustomContent = false;
  clearSavableResult();
  resultsMessage.textContent = t("resultsPlaceholder", currentLocale);
  document.querySelector("#love").focus();
});
