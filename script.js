
const form = document.querySelector("#ikigai-form");
const results = document.querySelector("#results");
const resultsMessage = document.querySelector("#results-message");
const editAnswersButton = document.querySelector("#edit-answers");
const findButton = document.querySelector("#find-button");

const API_URL = "https://ikigai-gemini-api.apenisoara.workers.dev";

// Public Turnstile site key from Cloudflare Dashboard → Turnstile.
// Create a widget that allows checkerandu.github.io and apenisoara.github.io.
const TURNSTILE_SITE_KEY = "";

let turnstileWidgetId = null;

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

window.addEventListener("load", initTurnstile);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  let turnstileToken;
  try {
    turnstileToken = getTurnstileToken();
  } catch (error) {
    results.hidden = false;
    resultsMessage.textContent = error.message;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const answers = {
    love: form.elements.love.value.trim(),
    good: form.elements.good.value.trim(),
    paid: form.elements.paid.value.trim(),
    world: form.elements.world.value.trim(),
    turnstileToken
  };

  findButton.disabled = true;
  findButton.textContent = "Exploring your Ikigai...";
  results.hidden = false;
  resultsMessage.textContent = "Analysing your answers...";
  results.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || "Analysis failed.");
    }

    if (typeof data.result !== "string" || !data.result.trim()) {
      throw new Error("Gemini returned an empty result.");
    }

    // Keep a copy of the full response for debugging.
    console.log("Full Gemini response:", data.result);
    console.log("Response length:", data.result.length);

    resultsMessage.replaceChildren();

    const lines = data.result.split(/\r?\n/);
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

  } catch (error) {
    console.error("Ikigai request failed:", error);
    resultsMessage.textContent =
      error?.message && !/failed to fetch|networkerror/i.test(error.message)
        ? error.message
        : "We couldn't complete your analysis. Please try again. " +
          "If the problem continues, check the browser Console and Cloudflare Worker logs.";
  } finally {
    findButton.disabled = false;
    findButton.textContent = "Explore my Ikigai ↗";
    resetTurnstile();
  }
});

editAnswersButton.addEventListener("click", () => {
  results.hidden = true;
  document.querySelector("#love").focus();
});
