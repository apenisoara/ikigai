/**
 * About-page strings merged into the shared I18N tables.
 * Loaded after i18n.js on about.html.
 */
(function mergeAboutStrings() {
  const about = {
    en: {
      aboutPageTitle: "About — Ikigai Finder",
      aboutMetaDescription:
        "About Ikigai Finder — the book that inspired it, how the app works, tips, and rate limiting.",
      aboutBackLink: "← Back to the app",
      aboutEyebrow: "ABOUT",
      aboutHeading: "About this project",
      aboutIntro:
        "Ikigai Finder is a small reflective tool. This page explains where the idea comes from, how to use the app, and what to do when you need to wait between explorations.",
      aboutLastUpdated: "Last updated: 12 November 2026",
      aboutBookTitle: "About the book",
      aboutBookCoverAlt:
        "Cover of Ikigai: The Japanese Secret to a Long and Happy Life by Héctor García and Francesc Miralles",
      aboutBookInspired:
        "Inspired by <cite>Ikigai: The Japanese Secret to a Long and Happy Life</cite> by Héctor García and Francesc Miralles.",
      aboutBookLink:
        'Read more about the book on <a href="https://www.goodreads.com/book/show/124950497-ikigai" rel="noopener noreferrer" target="_blank">Goodreads</a>.',
      aboutConceptTitle: "The idea of ikigai",
      aboutConceptP1:
        "This app uses the popular four-circle picture often linked with ikigai in the West: the overlap of what you love, what you are good at, what you can be paid for, and what the world needs.",
      aboutConceptP2:
        "In Japan, ikigai traditionally means something closer to a personal reason for being — the everyday sense of purpose that makes life feel worthwhile. It is not only a career diagram. We use the four questions as a practical reflection tool inspired by that broader idea.",
      aboutHowTitle: "How it works",
      aboutHowStep1: "Answer the four questions in your own words.",
      aboutHowStep2: "Complete the short human verification check.",
      aboutHowStep3:
        "Submit to explore — an AI produces a short reflection from your answers.",
      aboutHowStep4:
        "Read the result, then optionally print it or email it to yourself.",
      aboutHowNote:
        "The reflection is meant to help you think, not to decide your career or life path for you.",
      aboutTipsTitle: "Tips for better answers",
      aboutTipsLi1:
        "Be honest and specific — concrete examples work better than vague slogans.",
      aboutTipsLi2: "Write about yourself, not about other people’s private details.",
      aboutTipsLi3:
        'Avoid sensitive personal data (health, religion, politics, and similar). See our <a href="privacy.html">Privacy</a> notice.',
      aboutTipsLi4:
        "Treat the AI output as a mirror for reflection, not as professional advice.",
      aboutRateTitle: "Rate limiting",
      aboutRateP1:
        "Explorations share a limited AI capacity so the experience stays available for others too. That is why the app sometimes asks you to wait.",
      aboutRateP2:
        "If you explore again soon, the wait gets longer each time — it roughly doubles. For example, first you might wait a little; if you try again soon, the next wait is about twice as long.",
      aboutRateP3:
        "The explore button may show a countdown. After enough tries in one day, you may need to come back later. Completing human verification still applies when you try again.",
      aboutRateP4:
        "Tip: take your time with the questions, then explore once you’re ready — that usually feels better than rushing many short tries.",
      aboutPrivacyTitle: "Privacy & monitoring",
      aboutPrivacyP1:
        'For how we handle your answers, browser storage, and optional analytics, see the <a href="privacy.html">Privacy</a> notice. This About page does not replace that notice.',
      aboutCreditsTitle: "Credits",
      aboutCreditsP1:
        "Made by CheckerAndu and DaredCentaur802. Inspired by the book named above.",
      aboutFooterBack: "← Return to Ikigai Finder"
    },

    de: {
      aboutPageTitle: "Über uns — Ikigai Finder",
      aboutMetaDescription:
        "Über Ikigai Finder — das inspirierende Buch, so funktioniert die App, Tipps und Rate-Limits.",
      aboutBackLink: "← Zurück zur App",
      aboutEyebrow: "ÜBER UNS",
      aboutHeading: "Über dieses Projekt",
      aboutIntro:
        "Ikigai Finder ist ein kleines Reflexionswerkzeug. Diese Seite erklärt, woher die Idee kommt, wie du die App nutzt und was du tun kannst, wenn du zwischen Erkundungen warten musst.",
      aboutLastUpdated: "Zuletzt aktualisiert: 12. November 2026",
      aboutBookTitle: "Über das Buch",
      aboutBookCoverAlt:
        "Cover von Ikigai: The Japanese Secret to a Long and Happy Life von Héctor García und Francesc Miralles",
      aboutBookInspired:
        "Inspiriert von <cite>Ikigai: The Japanese Secret to a Long and Happy Life</cite> von Héctor García und Francesc Miralles.",
      aboutBookLink:
        'Mehr zum Buch auf <a href="https://www.goodreads.com/book/show/124950497-ikigai" rel="noopener noreferrer" target="_blank">Goodreads</a>.',
      aboutConceptTitle: "Die Idee von Ikigai",
      aboutConceptP1:
        "Diese App nutzt das bekannte Vier-Kreise-Bild, das im Westen oft mit Ikigai verbunden wird: die Überschneidung von dem, was du liebst, worin du gut bist, wofür du bezahlt werden kannst und was die Welt braucht.",
      aboutConceptP2:
        "In Japan bedeutet Ikigai traditionell eher einen persönlichen Lebenssinn — das alltägliche Gefühl von Zweck, das das Leben lohnenswert macht. Es ist nicht nur ein Karriere-Diagramm. Wir nutzen die vier Fragen als praktisches Reflexionswerkzeug, inspiriert von dieser weiteren Idee.",
      aboutHowTitle: "So funktioniert es",
      aboutHowStep1: "Beantworte die vier Fragen in deinen eigenen Worten.",
      aboutHowStep2: "Schließe die kurze Menschenprüfung ab.",
      aboutHowStep3:
        "Sende ab zum Erkunden — eine KI erstellt aus deinen Antworten eine kurze Reflexion.",
      aboutHowStep4:
        "Lies das Ergebnis und drucke es optional aus oder sende es dir per E-Mail.",
      aboutHowNote:
        "Die Reflexion soll dir beim Nachdenken helfen — nicht deine Karriere oder deinen Lebensweg für dich entscheiden.",
      aboutTipsTitle: "Tipps für bessere Antworten",
      aboutTipsLi1:
        "Sei ehrlich und konkret — Beispiele wirken besser als vage Slogans.",
      aboutTipsLi2:
        "Schreibe über dich selbst, nicht über private Details anderer Personen.",
      aboutTipsLi3:
        'Vermeide sensible personenbezogene Daten (Gesundheit, Religion, Politik und Ähnliches). Siehe unseren <a href="privacy.html">Datenschutz</a>-Hinweis.',
      aboutTipsLi4:
        "Behandle die KI-Ausgabe als Spiegel zur Reflexion, nicht als professionellen Rat.",
      aboutRateTitle: "Rate-Limits",
      aboutRateP1:
        "Erkundungen teilen sich eine begrenzte KI-Kapazität, damit das Erlebnis auch für andere verfügbar bleibt. Deshalb bittet dich die App manchmal zu warten.",
      aboutRateP2:
        "Wenn du bald erneut erkundest, wird die Wartezeit jedes Mal länger — sie verdoppelt sich ungefähr. Zum Beispiel wartest du zuerst nur kurz; wenn du bald nochmal versuchst, ist die nächste Wartezeit etwa doppelt so lang.",
      aboutRateP3:
        "Der Erkunden-Button kann einen Countdown zeigen. Nach genug Versuchen an einem Tag musst du vielleicht später wiederkommen. Die Menschenprüfung gilt weiterhin, wenn du es erneut versuchst.",
      aboutRateP4:
        "Tipp: Nimm dir Zeit für die Fragen und erkunde erst, wenn du bereit bist — das fühlt sich meist besser an als viele kurze Versuche hintereinander.",
      aboutPrivacyTitle: "Datenschutz & Monitoring",
      aboutPrivacyP1:
        'Wie wir mit deinen Antworten, Browser-Speicher und optionalen Analysen umgehen, steht im <a href="privacy.html">Datenschutz</a>-Hinweis. Diese Über-uns-Seite ersetzt diesen Hinweis nicht.',
      aboutCreditsTitle: "Credits",
      aboutCreditsP1:
        "Erstellt von CheckerAndu und DaredCentaur802. Inspiriert von dem oben genannten Buch.",
      aboutFooterBack: "← Zurück zu Ikigai Finder"
    },

    fr: {
      aboutPageTitle: "À propos — Ikigai Finder",
      aboutMetaDescription:
        "À propos d’Ikigai Finder — le livre qui l’a inspiré, le fonctionnement de l’app, conseils et limites d’usage.",
      aboutBackLink: "← Retour à l’application",
      aboutEyebrow: "À PROPOS",
      aboutHeading: "À propos de ce projet",
      aboutIntro:
        "Ikigai Finder est un petit outil de réflexion. Cette page explique d’où vient l’idée, comment utiliser l’application, et quoi faire quand il faut attendre entre deux explorations.",
      aboutLastUpdated: "Dernière mise à jour : 12 novembre 2026",
      aboutBookTitle: "À propos du livre",
      aboutBookCoverAlt:
        "Couverture de Ikigai: The Japanese Secret to a Long and Happy Life par Héctor García et Francesc Miralles",
      aboutBookInspired:
        "Inspiré par <cite>Ikigai: The Japanese Secret to a Long and Happy Life</cite> de Héctor García et Francesc Miralles.",
      aboutBookLink:
        'En savoir plus sur le livre sur <a href="https://www.goodreads.com/book/show/124950497-ikigai" rel="noopener noreferrer" target="_blank">Goodreads</a>.',
      aboutConceptTitle: "L’idée d’ikigai",
      aboutConceptP1:
        "Cette application utilise le schéma populaire à quatre cercles souvent associé à l’ikigai en Occident : le chevauchement entre ce que vous aimez, ce en quoi vous êtes doué, ce pour quoi vous pouvez être payé et ce dont le monde a besoin.",
      aboutConceptP2:
        "Au Japon, l’ikigai désigne traditionnellement plutôt une raison d’être personnelle — le sentiment quotidien de sens qui rend la vie digne d’être vécue. Ce n’est pas seulement un diagramme de carrière. Nous utilisons les quatre questions comme un outil de réflexion pratique inspiré de cette idée plus large.",
      aboutHowTitle: "Comment ça marche",
      aboutHowStep1: "Répondez aux quatre questions avec vos propres mots.",
      aboutHowStep2: "Complétez la courte vérification humaine.",
      aboutHowStep3:
        "Envoyez pour explorer — une IA produit une courte réflexion à partir de vos réponses.",
      aboutHowStep4:
        "Lisez le résultat, puis imprimez-le ou envoyez-le-vous par e-mail si vous le souhaitez.",
      aboutHowNote:
        "La réflexion est là pour vous aider à penser, pas pour décider de votre carrière ou de votre parcours de vie à votre place.",
      aboutTipsTitle: "Conseils pour de meilleures réponses",
      aboutTipsLi1:
        "Soyez honnête et précis — des exemples concrets valent mieux que des slogans vagues.",
      aboutTipsLi2:
        "Écrivez sur vous-même, pas sur les détails privés d’autres personnes.",
      aboutTipsLi3:
        'Évitez les données personnelles sensibles (santé, religion, politique, etc.). Voir notre avis de <a href="privacy.html">confidentialité</a>.',
      aboutTipsLi4:
        "Traitez le résultat de l’IA comme un miroir pour réfléchir, pas comme un conseil professionnel.",
      aboutRateTitle: "Limites d’usage",
      aboutRateP1:
        "Les explorations partagent une capacité d’IA limitée pour que l’expérience reste disponible pour les autres aussi. C’est pourquoi l’application vous demande parfois d’attendre.",
      aboutRateP2:
        "Si vous explorez à nouveau bientôt, l’attente s’allonge à chaque fois — elle double à peu près. Par exemple, d’abord vous attendez un peu ; si vous réessayez bientôt, la prochaine attente est environ deux fois plus longue.",
      aboutRateP3:
        "Le bouton d’exploration peut afficher un compte à rebours. Après assez d’essais dans une journée, vous devrez peut-être revenir plus tard. La vérification humaine s’applique encore lorsque vous réessayez.",
      aboutRateP4:
        "Conseil : prenez votre temps avec les questions, puis explorez quand vous êtes prêt — c’est souvent mieux que beaucoup d’essais précipités.",
      aboutPrivacyTitle: "Confidentialité et suivi",
      aboutPrivacyP1:
        'Pour le traitement de vos réponses, du stockage navigateur et des analyses optionnelles, voir l’avis de <a href="privacy.html">confidentialité</a>. Cette page À propos ne le remplace pas.',
      aboutCreditsTitle: "Crédits",
      aboutCreditsP1:
        "Créé par CheckerAndu et DaredCentaur802. Inspiré par le livre cité ci-dessus.",
      aboutFooterBack: "← Retour à Ikigai Finder"
    },

    ro: {
      aboutPageTitle: "Despre — Ikigai Finder",
      aboutMetaDescription:
        "Despre Ikigai Finder — cartea care l-a inspirat, cum funcționează aplicația, sfaturi și limitarea frecvenței.",
      aboutBackLink: "← Înapoi la aplicație",
      aboutEyebrow: "DESPRE",
      aboutHeading: "Despre acest proiect",
      aboutIntro:
        "Ikigai Finder este un mic instrument de reflecție. Această pagină explică de unde vine ideea, cum să folosești aplicația și ce să faci când trebuie să aștepți între explorări.",
      aboutLastUpdated: "Ultima actualizare: 12 noiembrie 2026",
      aboutBookTitle: "Despre carte",
      aboutBookCoverAlt:
        "Coperta cărții Ikigai: The Japanese Secret to a Long and Happy Life de Héctor García și Francesc Miralles",
      aboutBookInspired:
        "Inspirat de <cite>Ikigai: The Japanese Secret to a Long and Happy Life</cite> de Héctor García și Francesc Miralles.",
      aboutBookLink:
        'Află mai multe despre carte pe <a href="https://www.goodreads.com/book/show/124950497-ikigai" rel="noopener noreferrer" target="_blank">Goodreads</a>.',
      aboutConceptTitle: "Ideea de ikigai",
      aboutConceptP1:
        "Această aplicație folosește diagrama populară cu patru cercuri, deseori legată de ikigai în Occident: suprapunerea dintre ceea ce iubești, la ce ești bun, pentru ce poți fi plătit și de ce are nevoie lumea.",
      aboutConceptP2:
        "În Japonia, ikigai înseamnă în mod tradițional mai degrabă un motiv personal de a exista — sentimentul zilnic de sens care face viața demnă de trăit. Nu este doar o diagramă de carieră. Folosim cele patru întrebări ca instrument practic de reflecție, inspirat de ideea mai largă.",
      aboutHowTitle: "Cum funcționează",
      aboutHowStep1: "Răspunde la cele patru întrebări cu propriile cuvinte.",
      aboutHowStep2: "Completează scurta verificare umană.",
      aboutHowStep3:
        "Trimite pentru a explora — o inteligență artificială produce o scurtă reflecție din răspunsurile tale.",
      aboutHowStep4:
        "Citește rezultatul, apoi opțional tipărește-l sau trimite-ți-l pe e-mail.",
      aboutHowNote:
        "Reflecția te ajută să gândești — nu să îți decidă cariera sau drumul în viață.",
      aboutTipsTitle: "Sfaturi pentru răspunsuri mai bune",
      aboutTipsLi1:
        "Fii sincer și specific — exemplele concrete sunt mai utile decât sloganurile vagi.",
      aboutTipsLi2:
        "Scrie despre tine, nu despre detaliile private ale altor persoane.",
      aboutTipsLi3:
        'Evită datele personale sensibile (sănătate, religie, politică și similare). Vezi nota de <a href="privacy.html">confidențialitate</a>.',
      aboutTipsLi4:
        "Tratează rezultatul AI ca pe o oglindă pentru reflecție, nu ca pe un sfat profesional.",
      aboutRateTitle: "Limitarea frecvenței",
      aboutRateP1:
        "Explorările împart o capacitate AI limitată, ca experiența să rămână disponibilă și pentru alții. De aceea aplicația te cere uneori să aștepți.",
      aboutRateP2:
        "Dacă explorezi din nou curând, așteptarea se lungește de fiecare dată — se dublează aproximativ. De exemplu, mai întâi aștepți puțin; dacă încerci din nou curând, următoarea așteptare este cam de două ori mai lungă.",
      aboutRateP3:
        "Butonul de explorare poate arăta un countdown. După suficiente încercări într-o zi, poate trebui să revii mai târziu. Verificarea umană rămâne necesară când încerci din nou.",
      aboutRateP4:
        "Sfat: ia-ți timp cu întrebările, apoi explorează când ești pregătit — de obicei e mai bine decât multe încercări grăbite.",
      aboutPrivacyTitle: "Confidențialitate și monitorizare",
      aboutPrivacyP1:
        'Pentru cum tratăm răspunsurile, stocarea din browser și analiticele opționale, vezi nota de <a href="privacy.html">confidențialitate</a>. Această pagină Despre nu o înlocuiește.',
      aboutCreditsTitle: "Credite",
      aboutCreditsP1:
        "Creat de CheckerAndu și DaredCentaur802. Inspirat de cartea menționată mai sus.",
      aboutFooterBack: "← Înapoi la Ikigai Finder"
    }
  };

  for (const locale of Object.keys(about)) {
    Object.assign(I18N.strings[locale], about[locale]);
  }
})();
