/**
 * UI strings for Ikigai Finder.
 * Supported locales: en, de, fr, ro.
 */
const I18N = {
  defaultLocale: "en",
  supported: ["en", "de", "fr", "ro"],
  storageKey: "ikigai.lang.v1",

  localeNames: {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    ro: "Română"
  },

  /** Patterns that mark a line as a result heading (all locales). */
  headingPattern:
    /^(direction\s*\d*|possible direction(?:\s*\d*)?|why it fits|next step|small next step|summary|recommendation|your ikigai|mögliche richtung(?:\s*\d*)?|warum es passt|nächster schritt|kleiner nächster schritt|zusammenfassung|empfehlung|dein ikigai|direction possible(?:\s*\d*)?|pourquoi (?:ça|cela) (?:convient|correspond)|prochaine étape|petite prochaine étape|résumé|recommandation|votre ikigai|direcție posibilă(?:\s*\d*)?|de ce se potrivește|următorul pas|mic(?:ul)? pas următor|rezumat|recomandare|ikigai-ul tău)/i,

  strings: {
    en: {
      metaDescription:
        "Explore your Ikigai by connecting what you love, what you're good at, what you can be paid for, and what the world needs.",
      pageTitle: "Ikigai Finder — Find your Ikigai",
      wordmarkAria: "Ikigai Finder home",
      headerNote: "Finding reason, one question at a time.",
      langLabel: "Language",
      diagramEyebrow: "THE FOUR PILLARS",
      diagramTitle: "Where everything connects",
      diagramDescription: "Explore the four parts of your Ikigai.",
      diagramAria:
        "Four overlapping circles representing what you love, what you are good at, what you can be paid for, and what the world needs, meeting at Ikigai.",
      labelLoveHtml: "WHAT YOU<br><strong>LOVE</strong>",
      labelGoodHtml: "WHAT YOU ARE<br><strong>GOOD AT</strong>",
      labelWorldHtml: "WHAT THE WORLD<br><strong>NEEDS</strong>",
      labelPaidHtml: "WHAT YOU CAN BE<br><strong>PAID FOR</strong>",
      introEyebrow: "FIND YOUR IKIGAI",
      pageHeadingHtml: "Find the things that <br><em>make you, you.</em>",
      introCopy: "Find the very reason you get out of bed every day.",
      formEyebrow: "FOUR QUESTIONS",
      formTitle: "Start with yourself",
      timeNote: "There are no wrong answers.",
      q1Number: "01 / LOVE",
      q1Title: "What do you love to do?",
      q1Hint:
        "What makes you curious, excited, or so engaged that you experience flow and lose track of time?",
      q1Placeholder:
        "I love learning how things work, designing things, writing things, helping people…",
      q2Number: "02 / STRENGTHS",
      q2Title: "What are you good at?",
      q2Hint:
        "Think about skills, subjects, qualities, and things others ask you for help with.",
      q2Placeholder:
        "I'm good at solving problems, explaining ideas, building things…",
      q3Number: "03 / WORK",
      q3Title: "What could you be paid for?",
      q3Hint: "Which skills or interests could you be paid for?",
      q3Placeholder:
        "I could invent new things, tutor students, repair equipment…",
      q4Number: "04 / FOR THE WORLD",
      q4Title: "What does the world need?",
      q4Hint:
        "What problems would you like to help solve? What would you like to improve?",
      q4Placeholder:
        "The world needs clearer education, useful technology, more connection…",
      formFooter: "Your answers are a starting point, not a life-long label.",
      turnstileAria: "Human verification",
      findButton: "Explore my Ikigai",
      resultsEyebrow: "YOUR NEXT STEP",
      resultsTitle: "Your answers are ready",
      resultsPlaceholder:
        "The page is set up. The AI analysis still needs to be connected through a secure server endpoint.",
      editAnswers: "Edit my answers",
      footerCredit: "Made by CheckerAndu and DaredCentaur802.",
      footerTagline: "Explore. Discover. Grow.",
      exploring: "Exploring your Ikigai...",
      analysing: "Analysing your answers...",
      waitButton: "Wait {time}…",
      dailyLimitButton: "Daily limit reached",
      dayLimitMessage:
        "You've reached today's exploration limit for this browser. Please come back tomorrow so others can try too.",
      backoffMessage:
        "Please wait {time} before exploring again. This keeps the shared AI quota available for first-time visitors.",
      turnstileMissing:
        "Add TURNSTILE_SITE_KEY in script.js after creating a Cloudflare Turnstile widget.",
      turnstileNotConfigured: "Turnstile is not configured on this page yet.",
      turnstileLoading:
        "Human verification is still loading. Please try again in a moment.",
      turnstileRequired: "Please complete the human verification check.",
      tooManyRequests:
        "Too many requests right now. Please wait a bit so the shared AI quota stays available.",
      analysisFailed: "Analysis failed.",
      emptyResult: "Gemini returned an empty result.",
      networkError:
        "We couldn't complete your analysis. Please try again. If the problem continues, check the browser Console and Cloudflare Worker logs."
    },

    de: {
      metaDescription:
        "Entdecke dein Ikigai, indem du verbindest, was du liebst, worin du gut bist, wofür du bezahlt werden kannst und was die Welt braucht.",
      pageTitle: "Ikigai Finder — Finde dein Ikigai",
      wordmarkAria: "Ikigai Finder Startseite",
      headerNote: "Sinn finden, eine Frage nach der anderen.",
      langLabel: "Sprache",
      diagramEyebrow: "DIE VIER SÄULEN",
      diagramTitle: "Wo alles zusammenkommt",
      diagramDescription: "Entdecke die vier Teile deines Ikigai.",
      diagramAria:
        "Vier überlappende Kreise für das, was du liebst, worin du gut bist, wofür du bezahlt werden kannst und was die Welt braucht — sie treffen sich im Ikigai.",
      labelLoveHtml: "WAS DU<br><strong>LIEBST</strong>",
      labelGoodHtml: "WORIN DU<br><strong>GUT BIST</strong>",
      labelWorldHtml: "WAS DIE WELT<br><strong>BRAUCHT</strong>",
      labelPaidHtml: "WOFÜR DU<br><strong>BEZAHLT WIRST</strong>",
      introEyebrow: "FINDE DEIN IKIGAI",
      pageHeadingHtml: "Finde die Dinge, die <br><em>dich zu dir machen.</em>",
      introCopy: "Finde den Grund, warum du jeden Tag aufstehst.",
      formEyebrow: "VIER FRAGEN",
      formTitle: "Beginne bei dir selbst",
      timeNote: "Es gibt keine falschen Antworten.",
      q1Number: "01 / LIEBE",
      q1Title: "Was liebst du zu tun?",
      q1Hint:
        "Was macht dich neugierig, begeistert dich oder versetzt dich so in den Flow, dass du die Zeit vergisst?",
      q1Placeholder:
        "Ich liebe es zu lernen, wie Dinge funktionieren, zu gestalten, zu schreiben, Menschen zu helfen…",
      q2Number: "02 / STÄRKEN",
      q2Title: "Worin bist du gut?",
      q2Hint:
        "Denk an Fähigkeiten, Themen, Eigenschaften und Dinge, bei denen andere dich um Hilfe bitten.",
      q2Placeholder:
        "Ich bin gut darin, Probleme zu lösen, Ideen zu erklären, Dinge zu bauen…",
      q3Number: "03 / ARBEIT",
      q3Title: "Wofür könntest du bezahlt werden?",
      q3Hint: "Welche Fähigkeiten oder Interessen könnten bezahlt werden?",
      q3Placeholder:
        "Ich könnte Neues erfinden, Nachhilfe geben, Geräte reparieren…",
      q4Number: "04 / FÜR DIE WELT",
      q4Title: "Was braucht die Welt?",
      q4Hint:
        "Welche Probleme möchtest du lösen helfen? Was würdest du gerne verbessern?",
      q4Placeholder:
        "Die Welt braucht klarere Bildung, nützliche Technologie, mehr Verbindung…",
      formFooter:
        "Deine Antworten sind ein Ausgangspunkt, kein lebenslanges Etikett.",
      turnstileAria: "Menschenprüfung",
      findButton: "Mein Ikigai entdecken",
      resultsEyebrow: "DEIN NÄCHSTER SCHRITT",
      resultsTitle: "Deine Antworten sind bereit",
      resultsPlaceholder:
        "Die Seite ist eingerichtet. Die KI-Analyse muss noch über einen sicheren Server-Endpunkt verbunden werden.",
      editAnswers: "Antworten bearbeiten",
      footerCredit: "Erstellt von CheckerAndu und DaredCentaur802.",
      footerTagline: "Erkunden. Entdecken. Wachsen.",
      exploring: "Dein Ikigai wird erkundet...",
      analysing: "Deine Antworten werden analysiert...",
      waitButton: "Warte {time}…",
      dailyLimitButton: "Tageslimit erreicht",
      dayLimitMessage:
        "Du hast das heutige Erkundungslimit für diesen Browser erreicht. Bitte komm morgen wieder, damit auch andere es ausprobieren können.",
      backoffMessage:
        "Bitte warte {time}, bevor du erneut erkundest. So bleibt das gemeinsame KI-Kontingent für Erstbesucher verfügbar.",
      turnstileMissing:
        "Füge TURNSTILE_SITE_KEY in script.js hinzu, nachdem du ein Cloudflare-Turnstile-Widget erstellt hast.",
      turnstileNotConfigured: "Turnstile ist auf dieser Seite noch nicht konfiguriert.",
      turnstileLoading:
        "Die Menschenprüfung lädt noch. Bitte versuche es gleich noch einmal.",
      turnstileRequired: "Bitte schließe die Menschenprüfung ab.",
      tooManyRequests:
        "Zu viele Anfragen gerade. Bitte warte kurz, damit das gemeinsame KI-Kontingent verfügbar bleibt.",
      analysisFailed: "Analyse fehlgeschlagen.",
      emptyResult: "Gemini hat ein leeres Ergebnis zurückgegeben.",
      networkError:
        "Wir konnten deine Analyse nicht abschließen. Bitte versuche es erneut. Wenn das Problem bleibt, prüfe die Browser-Konsole und die Cloudflare-Worker-Protokolle."
    },

    fr: {
      metaDescription:
        "Explorez votre Ikigai en reliant ce que vous aimez, ce en quoi vous êtes doué, ce pour quoi vous pouvez être payé et ce dont le monde a besoin.",
      pageTitle: "Ikigai Finder — Trouvez votre Ikigai",
      wordmarkAria: "Accueil Ikigai Finder",
      headerNote: "Trouver du sens, une question à la fois.",
      langLabel: "Langue",
      diagramEyebrow: "LES QUATRE PILIERS",
      diagramTitle: "Là où tout se rejoint",
      diagramDescription: "Explorez les quatre parties de votre Ikigai.",
      diagramAria:
        "Quatre cercles qui se chevauchent représentant ce que vous aimez, ce en quoi vous êtes doué, ce pour quoi vous pouvez être payé et ce dont le monde a besoin, se rejoignant dans l'Ikigai.",
      labelLoveHtml: "CE QUE VOUS<br><strong>AIMEZ</strong>",
      labelGoodHtml: "CE EN QUOI VOUS<br><strong>ÊTES DOUÉ</strong>",
      labelWorldHtml: "CE DONT LE MONDE<br><strong>A BESOIN</strong>",
      labelPaidHtml: "POUR QUOI ÊTRE<br><strong>PAYÉ</strong>",
      introEyebrow: "TROUVEZ VOTRE IKIGAI",
      pageHeadingHtml: "Trouvez ce qui <br><em>fait de vous, vous.</em>",
      introCopy: "Trouvez la raison pour laquelle vous vous levez chaque jour.",
      formEyebrow: "QUATRE QUESTIONS",
      formTitle: "Commencez par vous-même",
      timeNote: "Il n'y a pas de mauvaises réponses.",
      q1Number: "01 / AIMER",
      q1Title: "Qu'aimez-vous faire ?",
      q1Hint:
        "Qu'est-ce qui vous rend curieux, enthousiaste, ou si absorbé que vous perdez la notion du temps ?",
      q1Placeholder:
        "J'aime comprendre comment les choses fonctionnent, concevoir, écrire, aider les gens…",
      q2Number: "02 / FORCES",
      q2Title: "En quoi êtes-vous doué ?",
      q2Hint:
        "Pensez aux compétences, sujets, qualités et choses pour lesquelles on vous demande de l'aide.",
      q2Placeholder:
        "Je suis doué pour résoudre des problèmes, expliquer des idées, construire des choses…",
      q3Number: "03 / TRAVAIL",
      q3Title: "Pour quoi pourriez-vous être payé ?",
      q3Hint: "Quelles compétences ou intérêts pourraient être rémunérés ?",
      q3Placeholder:
        "Je pourrais inventer de nouvelles choses, donner des cours, réparer du matériel…",
      q4Number: "04 / POUR LE MONDE",
      q4Title: "De quoi le monde a-t-il besoin ?",
      q4Hint:
        "Quels problèmes aimeriez-vous aider à résoudre ? Que souhaiteriez-vous améliorer ?",
      q4Placeholder:
        "Le monde a besoin d'une éducation plus claire, d'une technologie utile, de plus de lien…",
      formFooter:
        "Vos réponses sont un point de départ, pas une étiquette pour la vie.",
      turnstileAria: "Vérification humaine",
      findButton: "Explorer mon Ikigai",
      resultsEyebrow: "VOTRE PROCHAINE ÉTAPE",
      resultsTitle: "Vos réponses sont prêtes",
      resultsPlaceholder:
        "La page est prête. L'analyse IA doit encore être connectée via un point d'accès serveur sécurisé.",
      editAnswers: "Modifier mes réponses",
      footerCredit: "Créé par CheckerAndu et DaredCentaur802.",
      footerTagline: "Explorer. Découvrir. Grandir.",
      exploring: "Exploration de votre Ikigai...",
      analysing: "Analyse de vos réponses...",
      waitButton: "Attendez {time}…",
      dailyLimitButton: "Limite quotidienne atteinte",
      dayLimitMessage:
        "Vous avez atteint la limite d'exploration d'aujourd'hui pour ce navigateur. Revenez demain pour laisser de la place aux autres.",
      backoffMessage:
        "Veuillez attendre {time} avant d'explorer à nouveau. Cela préserve le quota d'IA partagé pour les nouveaux visiteurs.",
      turnstileMissing:
        "Ajoutez TURNSTILE_SITE_KEY dans script.js après avoir créé un widget Cloudflare Turnstile.",
      turnstileNotConfigured: "Turnstile n'est pas encore configuré sur cette page.",
      turnstileLoading:
        "La vérification humaine charge encore. Réessayez dans un instant.",
      turnstileRequired: "Veuillez terminer la vérification humaine.",
      tooManyRequests:
        "Trop de demandes pour le moment. Attendez un peu pour préserver le quota d'IA partagé.",
      analysisFailed: "L'analyse a échoué.",
      emptyResult: "Gemini a renvoyé un résultat vide.",
      networkError:
        "Nous n'avons pas pu terminer votre analyse. Réessayez. Si le problème continue, vérifiez la console du navigateur et les journaux du Worker Cloudflare."
    },

    ro: {
      metaDescription:
        "Explorează-ți Ikigai legând ceea ce iubești, la ce ești bun, pentru ce poți fi plătit și de ce are nevoie lumea.",
      pageTitle: "Ikigai Finder — Găsește-ți Ikigai",
      wordmarkAria: "Acasă Ikigai Finder",
      headerNote: "Găsirea sensului, o întrebare pe rând.",
      langLabel: "Limbă",
      diagramEyebrow: "CEI PATRU STALPI",
      diagramTitle: "Unde totul se leagă",
      diagramDescription: "Explorează cele patru părți ale Ikigai-ului tău.",
      diagramAria:
        "Patru cercuri care se suprapun, reprezentând ceea ce iubești, la ce ești bun, pentru ce poți fi plătit și de ce are nevoie lumea, întâlnindu-se în Ikigai.",
      labelLoveHtml: "CEEA CE<br><strong>IUBEȘTI</strong>",
      labelGoodHtml: "LA CE EȘTI<br><strong>BUN</strong>",
      labelWorldHtml: "DE CE ARE NEVOIE<br><strong>LUMEA</strong>",
      labelPaidHtml: "PENTRU CE POȚI FI<br><strong>PLĂTIT</strong>",
      introEyebrow: "GĂSEȘTE-ȚI IKIGAI",
      pageHeadingHtml: "Găsește lucrurile care <br><em>te fac sa fii tu insuți.</em>",
      introCopy: "Găsește motivul pentru care te ridici din pat în fiecare zi.",
      formEyebrow: "PATRU ÎNTREBĂRI",
      formTitle: "Începe cu tine",
      timeNote: "Nu există răspunsuri greșite.",
      q1Number: "01 / CE IUBEȘTI",
      q1Title: "Ce îți place să faci?",
      q1Hint:
        "Ce te face curios, entuziasmat sau atât de absorbit încât uiți de timp?",
      q1Placeholder:
        "Îmi place să învăț cum funcționează lucrurile, să proiectez, să scriu, să ajut oamenii…",
      q2Number: "02 / PUNCTE FORTE",
      q2Title: "La ce ești bun?",
      q2Hint:
        "Gândește-te la abilități, subiecte, calități și lucruri pentru care alții te roagă de ajutor.",
      q2Placeholder:
        "Sunt bun la rezolvat probleme, explicat idei, construit lucruri…",
      q3Number: "03 / MUNCĂ",
      q3Title: "Pentru ce ai putea fi plătit?",
      q3Hint: "Ce abilități sau interese ar putea fi plătite?",
      q3Placeholder:
        "Aș putea inventa lucruri noi, da meditații, repara echipamente…",
      q4Number: "04 / PENTRU LUME",
      q4Title: "De ce are nevoie lumea?",
      q4Hint:
        "Ce probleme ai vrea să ajuți să le rezolvi? Ce ai vrea să îmbunătățești?",
      q4Placeholder:
        "Lumea are nevoie de educație mai clară, tehnologie utilă, mai multă conexiune…",
      formFooter:
        "Răspunsurile tale sunt un punct de plecare, nu o etichetă pe viață.",
      turnstileAria: "Verificare umană",
      findButton: "Explorează Ikigai-ul meu",
      resultsEyebrow: "URMĂTORUL TĂU PAS",
      resultsTitle: "Răspunsurile tale sunt gata",
      resultsPlaceholder:
        "Pagina este pregătită. Analiza AI trebuie încă conectată printr-un endpoint securizat pe server.",
      editAnswers: "Editează răspunsurile",
      footerCredit: "Creat de CheckerAndu și DaredCentaur802.",
      footerTagline: "Explorează. Descoperă. Crește.",
      exploring: "Se explorează Ikigai-ul tău...",
      analysing: "Se analizează răspunsurile...",
      waitButton: "Așteaptă {time}…",
      dailyLimitButton: "Limita zilnică atinsă",
      dayLimitMessage:
        "Ai atins limita de explorare de azi pentru acest browser. Te rugăm să revii mâine, ca și alții să poată încerca.",
      backoffMessage:
        "Te rugăm să aștepți {time} înainte de a explora din nou. Așa păstrăm cota AI comună disponibilă pentru vizitatorii noi.",
      turnstileMissing:
        "Adaugă TURNSTILE_SITE_KEY în script.js după ce creezi un widget Cloudflare Turnstile.",
      turnstileNotConfigured: "Turnstile nu este încă configurat pe această pagină.",
      turnstileLoading:
        "Verificarea umană încă se încarcă. Încearcă din nou într-o clipă.",
      turnstileRequired: "Te rugăm să completezi verificarea umană.",
      tooManyRequests:
        "Prea multe cereri momentan. Așteaptă puțin ca să rămână disponibilă cota AI comună.",
      analysisFailed: "Analiza a eșuat.",
      emptyResult: "Gemini a returnat un rezultat gol.",
      networkError:
        "Nu am putut finaliza analiza. Încearcă din nou. Dacă problema continuă, verifică consola browserului și jurnalele Cloudflare Worker."
    }
  }
};

function normalizeLocale(code) {
  const raw = String(code || "")
    .trim()
    .toLowerCase()
    .replace("_", "-");
  if (!raw) return I18N.defaultLocale;
  const base = raw.split("-")[0];
  return I18N.supported.includes(base) ? base : I18N.defaultLocale;
}

function detectBrowserLocale() {
  const candidates = [
    ...(navigator.languages || []),
    navigator.language,
    navigator.userLanguage
  ].filter(Boolean);

  for (const candidate of candidates) {
    const base = String(candidate)
      .trim()
      .toLowerCase()
      .replace("_", "-")
      .split("-")[0];
    if (I18N.supported.includes(base)) return base;
  }
  return I18N.defaultLocale;
}

function readStoredLocale() {
  try {
    const stored = localStorage.getItem(I18N.storageKey);
    if (stored) return normalizeLocale(stored);
  } catch {
    // Private mode may block storage.
  }
  return null;
}

function writeStoredLocale(locale) {
  try {
    localStorage.setItem(I18N.storageKey, normalizeLocale(locale));
  } catch {
    // Ignore persistence failures.
  }
}

function readUrlLocale() {
  try {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (!param) return null;
    const base = String(param)
      .trim()
      .toLowerCase()
      .replace("_", "-")
      .split("-")[0];
    return I18N.supported.includes(base) ? base : null;
  } catch {
    return null;
  }
}

/** Priority: ?lang= → saved choice → browser language → en */
function getLocale() {
  return readUrlLocale() || readStoredLocale() || detectBrowserLocale();
}

function t(key, locale = getLocale(), vars = {}) {
  const table = I18N.strings[normalizeLocale(locale)] || I18N.strings[I18N.defaultLocale];
  let value = table[key] ?? I18N.strings[I18N.defaultLocale][key] ?? key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function applyTranslations(locale = getLocale()) {
  const lang = normalizeLocale(locale);
  document.documentElement.lang = lang;
  writeStoredLocale(lang);

  document.title = t("pageTitle", lang);

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t("metaDescription", lang));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key, lang);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (!key) return;
    el.innerHTML = t(key, lang);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key, lang));
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (!key) return;
    el.setAttribute("aria-label", t(key, lang));
  });

  const select = document.querySelector("#lang-select");
  if (select && select.value !== lang) select.value = lang;

  document.dispatchEvent(new CustomEvent("ikigai:localechange", { detail: { locale: lang } }));
  return lang;
}
