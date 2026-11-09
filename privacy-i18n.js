/**
 * Privacy-page strings merged into the shared I18N tables.
 * Loaded after i18n.js on privacy.html.
 */
(function mergePrivacyStrings() {
  const privacy = {
    en: {
      privacyPageTitle: "Privacy — Ikigai Finder",
      privacyMetaDescription:
        "Privacy notice for Ikigai Finder — how we process personal data under the GDPR in the European Union / Belgium.",
      privacyBackLink: "← Back to the app",
      privacyEyebrow: "PRIVACY NOTICE",
      privacyHeading: "How we handle your data",
      privacyIntro:
        "This notice explains what happens when you use Ikigai Finder, a static website hosted on GitHub Pages. It is written for visitors in the European Union, including Belgium, and reflects the EU General Data Protection Regulation (GDPR / AVG).",
      privacyLastUpdated: "Last updated: 9 November 2026",
      privacyWhoTitle: "1. Who is responsible",
      privacyWhoP1:
        "The operator of this website acts as the <strong>data controller</strong> for personal data processed through Ikigai Finder.",
      privacyWhoP2:
        "This is an independent / hobby project (not a company product). For privacy questions or GDPR requests, contact:",
      privacyWhoContact:
        '<strong>Contact:</strong> <a href="mailto:privacy@example.com">privacy@example.com</a>',
      privacyWhoAuthority:
        'If you are in Belgium, the supervisory authority is the <strong>Gegevensbeschermingsautoriteit / Autorité de protection des données (APD)</strong>: <a href="https://www.gegevensbeschermingsautoriteit.be" rel="noopener noreferrer" target="_blank">gegevensbeschermingsautoriteit.be</a> / <a href="https://www.autoriteprotectiondonnees.be" rel="noopener noreferrer" target="_blank">autoriteprotectiondonnees.be</a>.',
      privacyWhatTitle: "2. What this website does",
      privacyWhatP1:
        "Ikigai Finder lets you answer four reflective questions and, if you choose to submit the form, receive an AI-generated reflection. The front end is static HTML/CSS/JavaScript. Form analysis is performed through a Cloudflare Worker that calls a generative AI provider (Google Gemini).",
      privacyDataTitle: "3. What data we process",
      privacyDataFormTitle: "3.1 Form answers (only if you submit)",
      privacyDataFormIntro: "When you click “Explore my Ikigai”, we send:",
      privacyDataFormLi1:
        "your four free-text answers (what you love, strengths, paid work, world needs);",
      privacyDataFormLi2:
        "your selected interface language (<code>en</code>, <code>de</code>, <code>fr</code>, or <code>ro</code>);",
      privacyDataFormLi3: "a Cloudflare Turnstile token (bot protection);",
      privacyDataFormLi4:
        "an anonymous browser <code>clientId</code> used only for rate limiting.",
      privacyDataFormNote:
        "Please do not include special-category data (for example health, religion, political opinions, or biometric data) or other people’s personal data in your answers. The service is not designed for that.",
      privacyDataBrowserTitle: "3.2 Data stored in your browser",
      privacyDataBrowserIntro: "We use <code>localStorage</code> for:",
      privacyDataBrowserLi1: "language preference;",
      privacyDataBrowserLi2:
        "an anonymous <code>clientId</code> and lightweight rate-limit state;",
      privacyDataBrowserLi3:
        "your optional monitoring consent choice (<code>granted</code> / <code>denied</code>), when that feature is enabled.",
      privacyDataBrowserNote:
        "These values stay on your device unless you clear site data. They are not used for advertising profiles.",
      privacyDataTechTitle: "3.3 Technical / security data",
      privacyDataTechP1:
        "Cloudflare (Pages hosting edge, Turnstile, and the Worker) and GitHub Pages may process standard technical data such as IP address, user agent, timestamps, and request metadata to deliver the site, prevent abuse, and keep the service available.",
      privacyDataMonitorTitle: "3.4 Optional website monitoring (Datadog RUM)",
      privacyDataMonitorP1:
        "If a feature flag enables monitoring on this site, we may ask for your consent before loading Datadog Real User Monitoring (RUM). Only after you accept do we load the RUM script.",
      privacyDataMonitorIntro: "When enabled and consented, Datadog may collect:",
      privacyDataMonitorLi1: "page views and navigation;",
      privacyDataMonitorLi2: "performance timings and resource loads;",
      privacyDataMonitorLi3: "browser errors and long tasks;",
      privacyDataMonitorLi4: "interaction events (for example clicks);",
      privacyDataMonitorLi5:
        "session replay recordings of the page, where that product feature is turned on.",
      privacyDataMonitorNote:
        "Monitoring is configured against Datadog’s <strong>EU site</strong> (<code>datadoghq.eu</code>). You can change your choice later via “Analytics preferences” in the footer of any page, or by clearing this site’s data in your browser.",
      privacyPurposesTitle: "4. Why we process data (purposes & legal bases)",
      privacyTableProcessing: "Processing",
      privacyTablePurpose: "Purpose",
      privacyTableBasis: "Legal basis (GDPR)",
      privacyTableR1C1: "Form answers + AI reply",
      privacyTableR1C2: "Provide the Ikigai reflection you requested",
      privacyTableR1C3:
        "Art. 6(1)(b) — steps at your request / performance of the service",
      privacyTableR2C1: "Turnstile + rate limits + <code>clientId</code>",
      privacyTableR2C2: "Protect the API from bots and fair-use overload",
      privacyTableR2C3:
        "Art. 6(1)(f) — legitimate interest in security and availability",
      privacyTableR3C1: "Language preference",
      privacyTableR3C2: "Show the interface in your chosen language",
      privacyTableR3C3: "Art. 6(1)(f) — legitimate interest in usability",
      privacyTableR4C1: "Hosting / CDN logs",
      privacyTableR4C2: "Deliver pages and keep infrastructure secure",
      privacyTableR4C3:
        "Art. 6(1)(f) — legitimate interest in operating the website",
      privacyTableR5C1: "Datadog RUM / session replay",
      privacyTableR5C2: "Understand reliability, errors, and UX issues",
      privacyTableR5C3: "Art. 6(1)(a) — consent (optional; can be withdrawn)",
      privacyPurposesNote:
        "Where we rely on legitimate interests, you may object under GDPR Article 21. Where we rely on consent, you may withdraw it at any time without affecting prior lawful processing.",
      privacyProcessorsTitle: "5. Who receives the data",
      privacyProcessorsIntro:
        "Depending on what you use, data may be processed by:",
      privacyProcessorsLi1:
        "<strong>GitHub, Inc.</strong> — static hosting (GitHub Pages). See GitHub’s privacy statement for infrastructure processing.",
      privacyProcessorsLi2:
        "<strong>Cloudflare, Inc.</strong> — CDN/edge delivery, Turnstile bot protection, and the Worker that receives form submissions.",
      privacyProcessorsLi3:
        "<strong>Google LLC</strong> (Gemini API) — generates the reflection text from the answers you submit. Content may be processed outside the EEA subject to Google’s terms and transfer safeguards.",
      privacyProcessorsLi4:
        "<strong>Datadog, Inc.</strong> — only if monitoring is enabled and you consent. EU region configuration is used (<code>datadoghq.eu</code>). Datadog acts as a processor for telemetry we send.",
      privacyProcessorsNote:
        "We do not sell your personal data. We do not use your Ikigai answers for advertising.",
      privacyTransfersTitle: "6. International transfers",
      privacyTransfersP1:
        "Some providers above are established in the United States or may process data outside the European Economic Area. Where a transfer is not covered by an adequacy decision, providers typically rely on Standard Contractual Clauses (SCCs) and related safeguards under GDPR Chapter V.",
      privacyTransfersP2:
        "Datadog RUM for this site is pointed at the EU platform. Other services (notably GitHub Pages hosting metadata, Cloudflare global network routing, and Google Gemini) may involve processing outside Belgium / the EEA.",
      privacyRetentionTitle: "7. How long we keep data",
      privacyRetentionLi1:
        "<strong>Browser storage</strong> — until you clear it, change consent, or we change the storage key version.",
      privacyRetentionLi2:
        "<strong>Form submissions</strong> — processed to generate a reply. The Worker is not operated as a long-term personal archive of your answers; operational logs and provider-side retention follow each vendor’s defaults and our rate-limit needs.",
      privacyRetentionLi3:
        "<strong>Monitoring telemetry</strong> — retained according to the Datadog product retention settings configured for this application, and only while consent remains granted for new collection.",
      privacyRightsTitle: "8. Your rights (GDPR)",
      privacyRightsIntro: "If GDPR applies to you, you may have the right to:",
      privacyRightsLi1: "access your personal data;",
      privacyRightsLi2: "rectify inaccurate data;",
      privacyRightsLi3: "erase data (“right to be forgotten”), where applicable;",
      privacyRightsLi4: "restrict or object to certain processing;",
      privacyRightsLi5:
        "data portability, where processing is based on consent or contract and carried out by automated means;",
      privacyRightsLi6: "withdraw consent for optional monitoring at any time;",
      privacyRightsLi7:
        "lodge a complaint with a supervisory authority — in Belgium, the APD.",
      privacyRightsNote:
        "To exercise these rights, email the contact address above. Because this site does not create user accounts, we may ask for enough information to locate relevant records (for example approximate time of a submission). Much of the data only exists in your browser and can be deleted by clearing site data.",
      privacyChildrenTitle: "9. Children",
      privacyChildrenP1:
        "This website is not directed at children under 16. Do not submit personal information about minors. Belgian / GDPR rules on children’s consent for information-society services may require parental authorisation below that age.",
      privacyCookiesTitle: "10. Cookies and similar technologies",
      privacyCookiesP1:
        "The core questionnaire experience uses <code>localStorage</code>, not advertising cookies. Cloudflare Turnstile may set or read technical cookies / storage needed for bot challenges. Datadog RUM, when consented, may use cookies or similar storage to correlate a session.",
      privacyCookiesP2:
        "Optional monitoring is shown only when the feature is enabled, and collection starts after an explicit Accept / Reject choice.",
      privacyChangesTitle: "11. Changes to this notice",
      privacyChangesP1:
        "We may update this page when the website, vendors, or legal requirements change. The “Last updated” date at the top will be revised. Material changes to optional monitoring will continue to respect a prior rejection until you choose otherwise.",
      privacyDisclaimerTitle: "12. Important disclaimer",
      privacyDisclaimerP1:
        "This page is a practical privacy notice for a small static project. It is not legal advice. If you operate this site for an organisation, have a lawyer review controller identity, contact details, retention, and processor contracts (including Datadog DPA and Google / Cloudflare terms) before relying on it publicly.",
      privacyFooterBack: "← Return to Ikigai Finder",
      privacyFooterRegion: "Belgium / EU · GDPR"
    },

    de: {
      privacyPageTitle: "Datenschutz — Ikigai Finder",
      privacyMetaDescription:
        "Datenschutzhinweis für Ikigai Finder — wie wir personenbezogene Daten nach der DSGVO in der Europäischen Union / Belgien verarbeiten.",
      privacyBackLink: "← Zurück zur App",
      privacyEyebrow: "DATENSCHUTZHINWEIS",
      privacyHeading: "Wie wir mit deinen Daten umgehen",
      privacyIntro:
        "Dieser Hinweis erklärt, was geschieht, wenn du Ikigai Finder nutzt — eine statische Website auf GitHub Pages. Er richtet sich an Besucher in der Europäischen Union, einschließlich Belgien, und orientiert sich an der Datenschutz-Grundverordnung (DSGVO / AVG).",
      privacyLastUpdated: "Zuletzt aktualisiert: 9. November 2026",
      privacyWhoTitle: "1. Wer ist verantwortlich",
      privacyWhoP1:
        "Der Betreiber dieser Website handelt als <strong>Verantwortlicher</strong> für personenbezogene Daten, die über Ikigai Finder verarbeitet werden.",
      privacyWhoP2:
        "Dies ist ein unabhängiges Hobbyprojekt (kein Unternehmensprodukt). Für Datenschutzfragen oder DSGVO-Anfragen kontaktiere:",
      privacyWhoContact:
        '<strong>Kontakt:</strong> <a href="mailto:privacy@example.com">privacy@example.com</a>',
      privacyWhoAuthority:
        'Wenn du in Belgien bist, ist die Aufsichtsbehörde die <strong>Gegevensbeschermingsautoriteit / Autorité de protection des données (APD)</strong>: <a href="https://www.gegevensbeschermingsautoriteit.be" rel="noopener noreferrer" target="_blank">gegevensbeschermingsautoriteit.be</a> / <a href="https://www.autoriteprotectiondonnees.be" rel="noopener noreferrer" target="_blank">autoriteprotectiondonnees.be</a>.',
      privacyWhatTitle: "2. Was diese Website macht",
      privacyWhatP1:
        "Ikigai Finder lässt dich vier reflektierende Fragen beantworten und — wenn du das Formular absendest — eine KI-generierte Reflexion erhalten. Das Frontend ist statisches HTML/CSS/JavaScript. Die Formularanalyse erfolgt über einen Cloudflare Worker, der einen generativen KI-Anbieter (Google Gemini) aufruft.",
      privacyDataTitle: "3. Welche Daten wir verarbeiten",
      privacyDataFormTitle: "3.1 Formularantworten (nur bei Absenden)",
      privacyDataFormIntro: "Wenn du auf „Mein Ikigai entdecken“ klickst, senden wir:",
      privacyDataFormLi1:
        "deine vier Freitextantworten (was du liebst, Stärken, bezahlte Arbeit, Bedürfnisse der Welt);",
      privacyDataFormLi2:
        "deine gewählte Oberflächensprache (<code>en</code>, <code>de</code>, <code>fr</code> oder <code>ro</code>);",
      privacyDataFormLi3: "ein Cloudflare-Turnstile-Token (Bot-Schutz);",
      privacyDataFormLi4:
        "eine anonyme Browser-<code>clientId</code>, die nur für Rate-Limits genutzt wird.",
      privacyDataFormNote:
        "Bitte gib keine besonderen Kategorien personenbezogener Daten an (z. B. Gesundheit, Religion, politische Meinungen oder biometrische Daten) und auch keine Daten anderer Personen. Der Dienst ist dafür nicht ausgelegt.",
      privacyDataBrowserTitle: "3.2 Daten in deinem Browser",
      privacyDataBrowserIntro: "Wir nutzen <code>localStorage</code> für:",
      privacyDataBrowserLi1: "die Spracheinstellung;",
      privacyDataBrowserLi2:
        "eine anonyme <code>clientId</code> und einen leichten Rate-Limit-Status;",
      privacyDataBrowserLi3:
        "deine optionale Monitoring-Einwilligung (<code>granted</code> / <code>denied</code>), wenn diese Funktion aktiviert ist.",
      privacyDataBrowserNote:
        "Diese Werte bleiben auf deinem Gerät, bis du die Website-Daten löschst. Sie werden nicht für Werbeprofile verwendet.",
      privacyDataTechTitle: "3.3 Technische / Sicherheitsdaten",
      privacyDataTechP1:
        "Cloudflare (Pages-Edge-Hosting, Turnstile und der Worker) sowie GitHub Pages können übliche technische Daten wie IP-Adresse, User-Agent, Zeitstempel und Anfragemetadaten verarbeiten, um die Website auszuliefern, Missbrauch zu verhindern und den Dienst verfügbar zu halten.",
      privacyDataMonitorTitle: "3.4 Optionales Website-Monitoring (Datadog RUM)",
      privacyDataMonitorP1:
        "Wenn ein Feature-Flag Monitoring auf dieser Website aktiviert, können wir vor dem Laden von Datadog Real User Monitoring (RUM) um deine Einwilligung bitten. Erst nach Annahme laden wir das RUM-Skript.",
      privacyDataMonitorIntro:
        "Wenn aktiviert und eingewilligt, kann Datadog Folgendes erfassen:",
      privacyDataMonitorLi1: "Seitenaufrufe und Navigation;",
      privacyDataMonitorLi2: "Performance-Zeiten und Ressourcenladevorgänge;",
      privacyDataMonitorLi3: "Browserfehler und lange Tasks;",
      privacyDataMonitorLi4: "Interaktionsereignisse (z. B. Klicks);",
      privacyDataMonitorLi5:
        "Session-Replay-Aufzeichnungen der Seite, sofern diese Produktfunktion eingeschaltet ist.",
      privacyDataMonitorNote:
        "Monitoring ist auf Datadogs <strong>EU-Site</strong> (<code>datadoghq.eu</code>) konfiguriert. Du kannst deine Wahl später über „Analyse-Einstellungen“ in der Fußzeile jeder Seite ändern oder die Website-Daten im Browser löschen.",
      privacyPurposesTitle: "4. Warum wir Daten verarbeiten (Zwecke & Rechtsgrundlagen)",
      privacyTableProcessing: "Verarbeitung",
      privacyTablePurpose: "Zweck",
      privacyTableBasis: "Rechtsgrundlage (DSGVO)",
      privacyTableR1C1: "Formularantworten + KI-Antwort",
      privacyTableR1C2: "Die von dir angeforderte Ikigai-Reflexion bereitstellen",
      privacyTableR1C3:
        "Art. 6 Abs. 1 lit. b — Schritte auf deine Anfrage / Erbringung des Dienstes",
      privacyTableR2C1: "Turnstile + Rate-Limits + <code>clientId</code>",
      privacyTableR2C2: "API vor Bots und Überlastung schützen",
      privacyTableR2C3:
        "Art. 6 Abs. 1 lit. f — berechtigtes Interesse an Sicherheit und Verfügbarkeit",
      privacyTableR3C1: "Spracheinstellung",
      privacyTableR3C2: "Oberfläche in der gewählten Sprache anzeigen",
      privacyTableR3C3:
        "Art. 6 Abs. 1 lit. f — berechtigtes Interesse an Benutzerfreundlichkeit",
      privacyTableR4C1: "Hosting- / CDN-Protokolle",
      privacyTableR4C2: "Seiten ausliefern und Infrastruktur absichern",
      privacyTableR4C3:
        "Art. 6 Abs. 1 lit. f — berechtigtes Interesse am Betrieb der Website",
      privacyTableR5C1: "Datadog RUM / Session Replay",
      privacyTableR5C2: "Zuverlässigkeit, Fehler und UX-Probleme verstehen",
      privacyTableR5C3:
        "Art. 6 Abs. 1 lit. a — Einwilligung (optional; widerrufbar)",
      privacyPurposesNote:
        "Soweit wir uns auf berechtigte Interessen stützen, kannst du nach Art. 21 DSGVO Widerspruch einlegen. Soweit wir uns auf Einwilligung stützen, kannst du sie jederzeit widerrufen, ohne die Rechtmäßigkeit der bisherigen Verarbeitung zu berühren.",
      privacyProcessorsTitle: "5. Wer empfängt die Daten",
      privacyProcessorsIntro:
        "Je nachdem, was du nutzt, können Daten verarbeitet werden von:",
      privacyProcessorsLi1:
        "<strong>GitHub, Inc.</strong> — statisches Hosting (GitHub Pages). Siehe GitHubs Datenschutzhinweis zur Infrastrukturverarbeitung.",
      privacyProcessorsLi2:
        "<strong>Cloudflare, Inc.</strong> — CDN/Edge-Auslieferung, Turnstile-Bot-Schutz und der Worker, der Formularübermittlungen empfängt.",
      privacyProcessorsLi3:
        "<strong>Google LLC</strong> (Gemini API) — erzeugt den Reflexionstext aus den von dir übermittelten Antworten. Inhalte können außerhalb des EWR verarbeitet werden, vorbehaltlich der Bedingungen und Transfergarantien von Google.",
      privacyProcessorsLi4:
        "<strong>Datadog, Inc.</strong> — nur wenn Monitoring aktiviert ist und du einwilligst. Es wird die EU-Region genutzt (<code>datadoghq.eu</code>). Datadog handelt als Auftragsverarbeiter für die von uns gesendete Telemetrie.",
      privacyProcessorsNote:
        "Wir verkaufen deine personenbezogenen Daten nicht. Wir nutzen deine Ikigai-Antworten nicht für Werbung.",
      privacyTransfersTitle: "6. Internationale Übermittlungen",
      privacyTransfersP1:
        "Einige der genannten Anbieter haben ihren Sitz in den Vereinigten Staaten oder können Daten außerhalb des Europäischen Wirtschaftsraums verarbeiten. Ist eine Übermittlung nicht durch einen Angemessenheitsbeschluss abgedeckt, stützen sich Anbieter in der Regel auf Standardvertragsklauseln (SCCs) und verwandte Garantien nach Kapitel V DSGVO.",
      privacyTransfersP2:
        "Datadog RUM für diese Website ist auf die EU-Plattform ausgerichtet. Andere Dienste (insbesondere Metadaten von GitHub Pages, globales Netzwerk-Routing von Cloudflare und Google Gemini) können Verarbeitungen außerhalb Belgiens / des EWR beinhalten.",
      privacyRetentionTitle: "7. Wie lange wir Daten speichern",
      privacyRetentionLi1:
        "<strong>Browserspeicher</strong> — bis du ihn löschst, die Einwilligung änderst oder wir die Speicher-Schlüsselversion ändern.",
      privacyRetentionLi2:
        "<strong>Formularübermittlungen</strong> — verarbeitet, um eine Antwort zu erzeugen. Der Worker wird nicht als langfristiges persönliches Archiv deiner Antworten betrieben; Betriebsprotokolle und anbieterseitige Aufbewahrung folgen den jeweiligen Vorgaben und unseren Rate-Limit-Bedarfen.",
      privacyRetentionLi3:
        "<strong>Monitoring-Telemetrie</strong> — aufbewahrt gemäß den für diese Anwendung konfigurierten Datadog-Aufbewahrungseinstellungen und nur, solange die Einwilligung für neue Erhebung besteht.",
      privacyRightsTitle: "8. Deine Rechte (DSGVO)",
      privacyRightsIntro: "Wenn die DSGVO auf dich anwendbar ist, kannst du das Recht haben auf:",
      privacyRightsLi1: "Auskunft über deine personenbezogenen Daten;",
      privacyRightsLi2: "Berichtigung unrichtiger Daten;",
      privacyRightsLi3: "Löschung von Daten („Recht auf Vergessenwerden“), soweit anwendbar;",
      privacyRightsLi4: "Einschränkung oder Widerspruch gegen bestimmte Verarbeitungen;",
      privacyRightsLi5:
        "Datenübertragbarkeit, wenn die Verarbeitung auf Einwilligung oder Vertrag beruht und automatisiert erfolgt;",
      privacyRightsLi6: "Widerruf der Einwilligung für optionales Monitoring jederzeit;",
      privacyRightsLi7:
        "Beschwerde bei einer Aufsichtsbehörde — in Belgien bei der APD.",
      privacyRightsNote:
        "Um diese Rechte auszuüben, schreibe an die Kontaktadresse oben. Da diese Website keine Benutzerkonten anlegt, können wir um ausreichende Angaben bitten, um relevante Aufzeichnungen zu finden (z. B. ungefähren Zeitpunkt einer Übermittlung). Ein großer Teil der Daten existiert nur in deinem Browser und kann durch Löschen der Website-Daten entfernt werden.",
      privacyChildrenTitle: "9. Kinder",
      privacyChildrenP1:
        "Diese Website richtet sich nicht an Kinder unter 16 Jahren. Reiche keine personenbezogenen Daten über Minderjährige ein. Belgische / DSGVO-Regeln zur Einwilligung von Kindern bei Diensten der Informationsgesellschaft können unter diesem Alter eine elterliche Genehmigung verlangen.",
      privacyCookiesTitle: "10. Cookies und ähnliche Technologien",
      privacyCookiesP1:
        "Das Kern-Fragebogenerlebnis nutzt <code>localStorage</code>, keine Werbe-Cookies. Cloudflare Turnstile kann technische Cookies / Speicher für Bot-Challenges setzen oder lesen. Datadog RUM kann bei Einwilligung Cookies oder ähnlichen Speicher zur Session-Korrelation nutzen.",
      privacyCookiesP2:
        "Optionales Monitoring wird nur angezeigt, wenn die Funktion aktiviert ist, und die Erhebung beginnt erst nach einer ausdrücklichen Annahme- / Ablehnungsentscheidung.",
      privacyChangesTitle: "11. Änderungen dieses Hinweises",
      privacyChangesP1:
        "Wir können diese Seite aktualisieren, wenn sich Website, Anbieter oder rechtliche Anforderungen ändern. Das Datum „Zuletzt aktualisiert“ oben wird angepasst. Wesentliche Änderungen am optionalen Monitoring respektieren weiterhin eine frühere Ablehnung, bis du etwas anderes wählst.",
      privacyDisclaimerTitle: "12. Wichtiger Hinweis",
      privacyDisclaimerP1:
        "Diese Seite ist ein praktischer Datenschutzhinweis für ein kleines statisches Projekt. Sie ist keine Rechtsberatung. Betreibst du diese Website für eine Organisation, lass Verantwortlichen-Identität, Kontaktdaten, Aufbewahrung und Auftragsverarbeitungsverträge (einschließlich Datadog-DPA sowie Google- / Cloudflare-Bedingungen) vor öffentlicher Nutzung von einer Anwaltskanzlei prüfen.",
      privacyFooterBack: "← Zurück zu Ikigai Finder",
      privacyFooterRegion: "Belgien / EU · DSGVO"
    },

    fr: {
      privacyPageTitle: "Confidentialité — Ikigai Finder",
      privacyMetaDescription:
        "Avis de confidentialité pour Ikigai Finder — comment nous traitons les données personnelles conformément au RGPD dans l’Union européenne / en Belgique.",
      privacyBackLink: "← Retour à l’application",
      privacyEyebrow: "AVIS DE CONFIDENTIALITÉ",
      privacyHeading: "Comment nous traitons vos données",
      privacyIntro:
        "Cet avis explique ce qui se passe lorsque vous utilisez Ikigai Finder, un site statique hébergé sur GitHub Pages. Il s’adresse aux visiteurs de l’Union européenne, y compris la Belgique, et reflète le Règlement général sur la protection des données (RGPD / AVG).",
      privacyLastUpdated: "Dernière mise à jour : 9 novembre 2026",
      privacyWhoTitle: "1. Qui est responsable",
      privacyWhoP1:
        "L’exploitant de ce site agit en tant que <strong>responsable du traitement</strong> des données personnelles traitées via Ikigai Finder.",
      privacyWhoP2:
        "Il s’agit d’un projet indépendant / hobby (pas un produit d’entreprise). Pour les questions de confidentialité ou les demandes RGPD, contactez :",
      privacyWhoContact:
        '<strong>Contact :</strong> <a href="mailto:privacy@example.com">privacy@example.com</a>',
      privacyWhoAuthority:
        'Si vous êtes en Belgique, l’autorité de contrôle est la <strong>Gegevensbeschermingsautoriteit / Autorité de protection des données (APD)</strong> : <a href="https://www.gegevensbeschermingsautoriteit.be" rel="noopener noreferrer" target="_blank">gegevensbeschermingsautoriteit.be</a> / <a href="https://www.autoriteprotectiondonnees.be" rel="noopener noreferrer" target="_blank">autoriteprotectiondonnees.be</a>.',
      privacyWhatTitle: "2. Ce que fait ce site",
      privacyWhatP1:
        "Ikigai Finder vous permet de répondre à quatre questions de réflexion et, si vous choisissez d’envoyer le formulaire, de recevoir une réflexion générée par IA. Le front-end est du HTML/CSS/JavaScript statique. L’analyse du formulaire est réalisée via un Cloudflare Worker qui appelle un fournisseur d’IA générative (Google Gemini).",
      privacyDataTitle: "3. Quelles données nous traitons",
      privacyDataFormTitle: "3.1 Réponses au formulaire (uniquement si vous envoyez)",
      privacyDataFormIntro: "Lorsque vous cliquez sur « Explorer mon Ikigai », nous envoyons :",
      privacyDataFormLi1:
        "vos quatre réponses en texte libre (ce que vous aimez, forces, travail rémunéré, besoins du monde) ;",
      privacyDataFormLi2:
        "la langue d’interface sélectionnée (<code>en</code>, <code>de</code>, <code>fr</code> ou <code>ro</code>) ;",
      privacyDataFormLi3: "un jeton Cloudflare Turnstile (protection anti-bots) ;",
      privacyDataFormLi4:
        "un <code>clientId</code> de navigateur anonyme utilisé uniquement pour la limitation de débit.",
      privacyDataFormNote:
        "Veuillez ne pas inclure de données relevant de catégories particulières (par exemple santé, religion, opinions politiques ou données biométriques) ni les données personnelles d’autres personnes. Le service n’est pas conçu pour cela.",
      privacyDataBrowserTitle: "3.2 Données stockées dans votre navigateur",
      privacyDataBrowserIntro: "Nous utilisons <code>localStorage</code> pour :",
      privacyDataBrowserLi1: "la préférence de langue ;",
      privacyDataBrowserLi2:
        "un <code>clientId</code> anonyme et un état léger de limitation de débit ;",
      privacyDataBrowserLi3:
        "votre choix optionnel de consentement au monitoring (<code>granted</code> / <code>denied</code>), lorsque cette fonctionnalité est activée.",
      privacyDataBrowserNote:
        "Ces valeurs restent sur votre appareil tant que vous ne videz pas les données du site. Elles ne servent pas à des profils publicitaires.",
      privacyDataTechTitle: "3.3 Données techniques / de sécurité",
      privacyDataTechP1:
        "Cloudflare (edge d’hébergement Pages, Turnstile et le Worker) et GitHub Pages peuvent traiter des données techniques standard telles que l’adresse IP, l’agent utilisateur, les horodatages et les métadonnées de requête pour livrer le site, prévenir les abus et maintenir le service disponible.",
      privacyDataMonitorTitle: "3.4 Monitoring optionnel du site (Datadog RUM)",
      privacyDataMonitorP1:
        "Si un feature flag active le monitoring sur ce site, nous pouvons demander votre consentement avant de charger Datadog Real User Monitoring (RUM). Ce n’est qu’après acceptation que nous chargeons le script RUM.",
      privacyDataMonitorIntro:
        "Lorsqu’il est activé et consenti, Datadog peut collecter :",
      privacyDataMonitorLi1: "les vues de pages et la navigation ;",
      privacyDataMonitorLi2: "les délais de performance et le chargement des ressources ;",
      privacyDataMonitorLi3: "les erreurs navigateur et les tâches longues ;",
      privacyDataMonitorLi4: "les événements d’interaction (par exemple les clics) ;",
      privacyDataMonitorLi5:
        "les enregistrements de session replay de la page, lorsque cette fonctionnalité produit est activée.",
      privacyDataMonitorNote:
        "Le monitoring est configuré sur le <strong>site UE</strong> de Datadog (<code>datadoghq.eu</code>). Vous pouvez modifier votre choix plus tard via « Préférences d’analyse » dans le pied de page de toute page, ou en effaçant les données de ce site dans votre navigateur.",
      privacyPurposesTitle: "4. Pourquoi nous traitons des données (finalités et bases légales)",
      privacyTableProcessing: "Traitement",
      privacyTablePurpose: "Finalité",
      privacyTableBasis: "Base légale (RGPD)",
      privacyTableR1C1: "Réponses au formulaire + réponse IA",
      privacyTableR1C2: "Fournir la réflexion Ikigai que vous avez demandée",
      privacyTableR1C3:
        "Art. 6(1)(b) — démarches à votre demande / exécution du service",
      privacyTableR2C1: "Turnstile + limites de débit + <code>clientId</code>",
      privacyTableR2C2: "Protéger l’API contre les bots et la surcharge",
      privacyTableR2C3:
        "Art. 6(1)(f) — intérêt légitime à la sécurité et à la disponibilité",
      privacyTableR3C1: "Préférence de langue",
      privacyTableR3C2: "Afficher l’interface dans la langue choisie",
      privacyTableR3C3: "Art. 6(1)(f) — intérêt légitime à l’utilisabilité",
      privacyTableR4C1: "Journaux d’hébergement / CDN",
      privacyTableR4C2: "Livrer les pages et sécuriser l’infrastructure",
      privacyTableR4C3:
        "Art. 6(1)(f) — intérêt légitime à l’exploitation du site",
      privacyTableR5C1: "Datadog RUM / session replay",
      privacyTableR5C2: "Comprendre la fiabilité, les erreurs et les problèmes d’UX",
      privacyTableR5C3: "Art. 6(1)(a) — consentement (optionnel ; révocable)",
      privacyPurposesNote:
        "Lorsque nous nous appuyons sur des intérêts légitimes, vous pouvez vous y opposer en vertu de l’article 21 du RGPD. Lorsque nous nous appuyons sur le consentement, vous pouvez le retirer à tout moment sans affecter la licéité du traitement antérieur.",
      privacyProcessorsTitle: "5. Qui reçoit les données",
      privacyProcessorsIntro:
        "Selon ce que vous utilisez, les données peuvent être traitées par :",
      privacyProcessorsLi1:
        "<strong>GitHub, Inc.</strong> — hébergement statique (GitHub Pages). Voir la déclaration de confidentialité de GitHub pour le traitement d’infrastructure.",
      privacyProcessorsLi2:
        "<strong>Cloudflare, Inc.</strong> — livraison CDN/edge, protection anti-bots Turnstile, et le Worker qui reçoit les envois de formulaire.",
      privacyProcessorsLi3:
        "<strong>Google LLC</strong> (API Gemini) — génère le texte de réflexion à partir des réponses que vous envoyez. Le contenu peut être traité hors EEE sous réserve des conditions et garanties de transfert de Google.",
      privacyProcessorsLi4:
        "<strong>Datadog, Inc.</strong> — uniquement si le monitoring est activé et que vous consentez. La configuration de région UE est utilisée (<code>datadoghq.eu</code>). Datadog agit comme sous-traitant pour la télémétrie que nous envoyons.",
      privacyProcessorsNote:
        "Nous ne vendons pas vos données personnelles. Nous n’utilisons pas vos réponses Ikigai à des fins publicitaires.",
      privacyTransfersTitle: "6. Transferts internationaux",
      privacyTransfersP1:
        "Certains prestataires ci-dessus sont établis aux États-Unis ou peuvent traiter des données hors de l’Espace économique européen. Lorsqu’un transfert n’est pas couvert par une décision d’adéquation, les prestataires s’appuient généralement sur des clauses contractuelles types (CCT) et des garanties associées au titre du chapitre V du RGPD.",
      privacyTransfersP2:
        "Le Datadog RUM de ce site pointe vers la plateforme UE. D’autres services (notamment les métadonnées d’hébergement GitHub Pages, le routage réseau mondial de Cloudflare et Google Gemini) peuvent impliquer un traitement hors de Belgique / de l’EEE.",
      privacyRetentionTitle: "7. Combien de temps nous conservons les données",
      privacyRetentionLi1:
        "<strong>Stockage navigateur</strong> — jusqu’à ce que vous le vidiez, changiez de consentement, ou que nous changions la version de la clé de stockage.",
      privacyRetentionLi2:
        "<strong>Envois de formulaire</strong> — traités pour générer une réponse. Le Worker n’est pas exploité comme une archive personnelle durable de vos réponses ; les journaux opérationnels et la conservation côté prestataire suivent les paramètres de chaque fournisseur et nos besoins de limitation de débit.",
      privacyRetentionLi3:
        "<strong>Télémétrie de monitoring</strong> — conservée selon les paramètres de rétention Datadog configurés pour cette application, et seulement tant que le consentement reste accordé pour une nouvelle collecte.",
      privacyRightsTitle: "8. Vos droits (RGPD)",
      privacyRightsIntro: "Si le RGPD s’applique à vous, vous pouvez avoir le droit de :",
      privacyRightsLi1: "accéder à vos données personnelles ;",
      privacyRightsLi2: "rectifier des données inexactes ;",
      privacyRightsLi3: "effacer des données (« droit à l’oubli »), le cas échéant ;",
      privacyRightsLi4: "limiter ou vous opposer à certains traitements ;",
      privacyRightsLi5:
        "à la portabilité des données, lorsque le traitement est fondé sur le consentement ou le contrat et effectué par des moyens automatisés ;",
      privacyRightsLi6: "retirer le consentement au monitoring optionnel à tout moment ;",
      privacyRightsLi7:
        "introduire une réclamation auprès d’une autorité de contrôle — en Belgique, l’APD.",
      privacyRightsNote:
        "Pour exercer ces droits, écrivez à l’adresse de contact ci-dessus. Comme ce site ne crée pas de comptes utilisateurs, nous pouvons demander suffisamment d’informations pour localiser les enregistrements pertinents (par exemple l’heure approximative d’un envoi). Une grande partie des données n’existe que dans votre navigateur et peut être supprimée en effaçant les données du site.",
      privacyChildrenTitle: "9. Enfants",
      privacyChildrenP1:
        "Ce site ne s’adresse pas aux enfants de moins de 16 ans. Ne soumettez pas d’informations personnelles concernant des mineurs. Les règles belges / RGPD sur le consentement des enfants pour les services de la société de l’information peuvent exiger une autorisation parentale en dessous de cet âge.",
      privacyCookiesTitle: "10. Cookies et technologies similaires",
      privacyCookiesP1:
        "L’expérience principale du questionnaire utilise <code>localStorage</code>, pas des cookies publicitaires. Cloudflare Turnstile peut définir ou lire des cookies / un stockage techniques nécessaires aux défis anti-bots. Datadog RUM, en cas de consentement, peut utiliser des cookies ou un stockage similaire pour corréler une session.",
      privacyCookiesP2:
        "Le monitoring optionnel n’est affiché que lorsque la fonctionnalité est activée, et la collecte commence après un choix explicite Accepter / Refuser.",
      privacyChangesTitle: "11. Modifications de cet avis",
      privacyChangesP1:
        "Nous pouvons mettre à jour cette page lorsque le site, les prestataires ou les exigences légales changent. La date « Dernière mise à jour » en haut sera révisée. Les changements matériels au monitoring optionnel continueront de respecter un refus antérieur jusqu’à ce que vous choisissiez autrement.",
      privacyDisclaimerTitle: "12. Avertissement important",
      privacyDisclaimerP1:
        "Cette page est un avis de confidentialité pratique pour un petit projet statique. Ce n’est pas un conseil juridique. Si vous exploitez ce site pour une organisation, faites examiner par un avocat l’identité du responsable, les coordonnées, la conservation et les contrats de sous-traitance (y compris le DPA Datadog et les conditions Google / Cloudflare) avant de vous y fier publiquement.",
      privacyFooterBack: "← Retour à Ikigai Finder",
      privacyFooterRegion: "Belgique / UE · RGPD"
    },

    ro: {
      privacyPageTitle: "Confidențialitate — Ikigai Finder",
      privacyMetaDescription:
        "Notă de confidențialitate pentru Ikigai Finder — cum prelucrăm datele personale conform GDPR în Uniunea Europeană / Belgia.",
      privacyBackLink: "← Înapoi la aplicație",
      privacyEyebrow: "NOTĂ DE CONFIDENȚIALITATE",
      privacyHeading: "Cum gestionăm datele tale",
      privacyIntro:
        "Această notă explică ce se întâmplă când folosești Ikigai Finder, un site static găzduit pe GitHub Pages. Este scrisă pentru vizitatori din Uniunea Europeană, inclusiv Belgia, și reflectă Regulamentul general privind protecția datelor (GDPR / AVG).",
      privacyLastUpdated: "Ultima actualizare: 9 noiembrie 2026",
      privacyWhoTitle: "1. Cine este responsabil",
      privacyWhoP1:
        "Operatorul acestui site acționează ca <strong>operator de date</strong> pentru datele personale prelucrate prin Ikigai Finder.",
      privacyWhoP2:
        "Acesta este un proiect independent / de hobby (nu un produs de companie). Pentru întrebări de confidențialitate sau solicitări GDPR, contactează:",
      privacyWhoContact:
        '<strong>Contact:</strong> <a href="mailto:privacy@example.com">privacy@example.com</a>',
      privacyWhoAuthority:
        'Dacă ești în Belgia, autoritatea de supraveghere este <strong>Gegevensbeschermingsautoriteit / Autorité de protection des données (APD)</strong>: <a href="https://www.gegevensbeschermingsautoriteit.be" rel="noopener noreferrer" target="_blank">gegevensbeschermingsautoriteit.be</a> / <a href="https://www.autoriteprotectiondonnees.be" rel="noopener noreferrer" target="_blank">autoriteprotectiondonnees.be</a>.',
      privacyWhatTitle: "2. Ce face acest site",
      privacyWhatP1:
        "Ikigai Finder îți permite să răspunzi la patru întrebări reflective și, dacă alegi să trimiți formularul, să primești o reflecție generată de AI. Front-end-ul este HTML/CSS/JavaScript static. Analiza formularului se face printr-un Cloudflare Worker care apelează un furnizor de AI generativ (Google Gemini).",
      privacyDataTitle: "3. Ce date prelucrăm",
      privacyDataFormTitle: "3.1 Răspunsurile din formular (doar dacă trimiți)",
      privacyDataFormIntro: "Când apeși „Explorează Ikigai-ul meu”, trimitem:",
      privacyDataFormLi1:
        "cele patru răspunsuri în text liber (ce iubești, puncte forte, muncă plătită, nevoile lumii);",
      privacyDataFormLi2:
        "limba de interfață selectată (<code>en</code>, <code>de</code>, <code>fr</code> sau <code>ro</code>);",
      privacyDataFormLi3: "un token Cloudflare Turnstile (protecție anti-bot);",
      privacyDataFormLi4:
        "un <code>clientId</code> anonim de browser folosit doar pentru limitarea ratei.",
      privacyDataFormNote:
        "Te rugăm să nu incluzi date din categorii speciale (de exemplu sănătate, religie, opinii politice sau date biometrice) ori date personale ale altor persoane. Serviciul nu este conceput pentru asta.",
      privacyDataBrowserTitle: "3.2 Date stocate în browser",
      privacyDataBrowserIntro: "Folosim <code>localStorage</code> pentru:",
      privacyDataBrowserLi1: "preferința de limbă;",
      privacyDataBrowserLi2:
        "un <code>clientId</code> anonim și o stare ușoară de limitare a ratei;",
      privacyDataBrowserLi3:
        "alegerea opțională de consimțământ pentru monitorizare (<code>granted</code> / <code>denied</code>), când funcția este activată.",
      privacyDataBrowserNote:
        "Aceste valori rămân pe dispozitivul tău până ștergi datele site-ului. Nu sunt folosite pentru profiluri publicitare.",
      privacyDataTechTitle: "3.3 Date tehnice / de securitate",
      privacyDataTechP1:
        "Cloudflare (edge-ul de hosting Pages, Turnstile și Worker-ul) și GitHub Pages pot prelucra date tehnice standard precum adresa IP, user agent, marcaje temporale și metadate ale cererilor pentru a livra site-ul, a preveni abuzul și a menține serviciul disponibil.",
      privacyDataMonitorTitle: "3.4 Monitorizare opțională a site-ului (Datadog RUM)",
      privacyDataMonitorP1:
        "Dacă un feature flag activează monitorizarea pe acest site, putem cere consimțământul tău înainte de a încărca Datadog Real User Monitoring (RUM). Doar după acceptare încărcăm scriptul RUM.",
      privacyDataMonitorIntro:
        "Când este activată și acceptată, Datadog poate colecta:",
      privacyDataMonitorLi1: "vizualizări de pagină și navigare;",
      privacyDataMonitorLi2: "timpi de performanță și încărcări de resurse;",
      privacyDataMonitorLi3: "erori de browser și task-uri lungi;",
      privacyDataMonitorLi4: "evenimente de interacțiune (de exemplu click-uri);",
      privacyDataMonitorLi5:
        "înregistrări session replay ale paginii, când această funcție de produs este activată.",
      privacyDataMonitorNote:
        "Monitorizarea este configurată pe <strong>site-ul UE</strong> Datadog (<code>datadoghq.eu</code>). Poți schimba alegerea mai târziu prin „Preferințe de analiză” din subsolul oricărei pagini sau ștergând datele acestui site din browser.",
      privacyPurposesTitle: "4. De ce prelucrăm date (scopuri și temeiuri legale)",
      privacyTableProcessing: "Prelucrare",
      privacyTablePurpose: "Scop",
      privacyTableBasis: "Temei legal (GDPR)",
      privacyTableR1C1: "Răspunsuri formular + răspuns AI",
      privacyTableR1C2: "Oferirea reflecției Ikigai pe care ai solicitat-o",
      privacyTableR1C3:
        "Art. 6(1)(b) — demersuri la cererea ta / executarea serviciului",
      privacyTableR2C1: "Turnstile + limite de rată + <code>clientId</code>",
      privacyTableR2C2: "Protejarea API-ului de boti și supraîncărcare",
      privacyTableR2C3:
        "Art. 6(1)(f) — interes legitim pentru securitate și disponibilitate",
      privacyTableR3C1: "Preferință de limbă",
      privacyTableR3C2: "Afișarea interfeței în limba aleasă",
      privacyTableR3C3: "Art. 6(1)(f) — interes legitim pentru ușurința utilizării",
      privacyTableR4C1: "Jurnale hosting / CDN",
      privacyTableR4C2: "Livrarea paginilor și securizarea infrastructurii",
      privacyTableR4C3:
        "Art. 6(1)(f) — interes legitim pentru operarea site-ului",
      privacyTableR5C1: "Datadog RUM / session replay",
      privacyTableR5C2: "Înțelegerea fiabilității, erorilor și problemelor de UX",
      privacyTableR5C3: "Art. 6(1)(a) — consimțământ (opțional; poate fi retras)",
      privacyPurposesNote:
        "Acolo unde ne bazăm pe interese legitime, poți obiecta conform articolului 21 GDPR. Acolo unde ne bazăm pe consimțământ, îl poți retrage oricând fără a afecta legalitatea prelucrării anterioare.",
      privacyProcessorsTitle: "5. Cine primește datele",
      privacyProcessorsIntro:
        "În funcție de ce folosești, datele pot fi prelucrate de:",
      privacyProcessorsLi1:
        "<strong>GitHub, Inc.</strong> — găzduire statică (GitHub Pages). Vezi declarația de confidențialitate GitHub pentru prelucrarea de infrastructură.",
      privacyProcessorsLi2:
        "<strong>Cloudflare, Inc.</strong> — livrare CDN/edge, protecție anti-bot Turnstile și Worker-ul care primește trimiterile de formular.",
      privacyProcessorsLi3:
        "<strong>Google LLC</strong> (API Gemini) — generează textul de reflecție din răspunsurile pe care le trimiți. Conținutul poate fi prelucrat în afara SEE, sub rezerva termenilor și garanțiilor de transfer ale Google.",
      privacyProcessorsLi4:
        "<strong>Datadog, Inc.</strong> — doar dacă monitorizarea este activată și consimți. Se folosește configurația de regiune UE (<code>datadoghq.eu</code>). Datadog acționează ca persoană împuternicită pentru telemetria pe care o trimitem.",
      privacyProcessorsNote:
        "Nu vindem datele tale personale. Nu folosim răspunsurile tale Ikigai pentru publicitate.",
      privacyTransfersTitle: "6. Transferuri internaționale",
      privacyTransfersP1:
        "Unii dintre furnizorii de mai sus sunt stabiliți în Statele Unite sau pot prelucra date în afara Spațiului Economic European. Când un transfer nu este acoperit de o decizie de adecvare, furnizorii se bazează de obicei pe Clauze Contractuale Standard (SCC) și garanții aferente conform Capitolului V GDPR.",
      privacyTransfersP2:
        "Datadog RUM pentru acest site este orientat către platforma UE. Alte servicii (în special metadatele de hosting GitHub Pages, rutarea rețelei globale Cloudflare și Google Gemini) pot implica prelucrări în afara Belgiei / SEE.",
      privacyRetentionTitle: "7. Cât timp păstrăm datele",
      privacyRetentionLi1:
        "<strong>Stocare în browser</strong> — până o ștergi, schimbi consimțământul sau schimbăm versiunea cheii de stocare.",
      privacyRetentionLi2:
        "<strong>Trimiteri de formular</strong> — prelucrate pentru a genera un răspuns. Worker-ul nu este operat ca o arhivă personală pe termen lung a răspunsurilor tale; jurnalele operaționale și păstrarea la furnizori urmează setările fiecărui vendor și nevoile noastre de limitare a ratei.",
      privacyRetentionLi3:
        "<strong>Telemetrie de monitorizare</strong> — păstrată conform setărilor de retenție Datadog configurate pentru această aplicație și doar cât timp consimțământul rămâne acordat pentru colectare nouă.",
      privacyRightsTitle: "8. Drepturile tale (GDPR)",
      privacyRightsIntro: "Dacă GDPR ți se aplică, poți avea dreptul să:",
      privacyRightsLi1: "accesezi datele tale personale;",
      privacyRightsLi2: "rectifici datele inexacte;",
      privacyRightsLi3: "ștergi date („dreptul de a fi uitat”), acolo unde este aplicabil;",
      privacyRightsLi4: "restrângi sau te opui anumitor prelucrări;",
      privacyRightsLi5:
        "portezi datele, când prelucrarea se bazează pe consimțământ sau contract și se face prin mijloace automatizate;",
      privacyRightsLi6: "retragi consimțământul pentru monitorizarea opțională oricând;",
      privacyRightsLi7:
        "depunii o plângere la o autoritate de supraveghere — în Belgia, APD.",
      privacyRightsNote:
        "Pentru a exercita aceste drepturi, scrie la adresa de contact de mai sus. Deoarece acest site nu creează conturi de utilizator, putem cere suficiente informații pentru a localiza înregistrările relevante (de exemplu ora aproximativă a unei trimiteri). O mare parte din date există doar în browser și poate fi ștearsă prin golirea datelor site-ului.",
      privacyChildrenTitle: "9. Copii",
      privacyChildrenP1:
        "Acest site nu se adresează copiilor sub 16 ani. Nu trimite informații personale despre minori. Regulile belgiene / GDPR privind consimțământul copiilor pentru serviciile societății informaționale pot necesita autorizarea părinților sub această vârstă.",
      privacyCookiesTitle: "10. Cookie-uri și tehnologii similare",
      privacyCookiesP1:
        "Experiența de bază a chestionarului folosește <code>localStorage</code>, nu cookie-uri publicitare. Cloudflare Turnstile poate seta sau citi cookie-uri / stocare tehnică necesare pentru provocările anti-bot. Datadog RUM, când este consimțit, poate folosi cookie-uri sau stocare similară pentru a corela o sesiune.",
      privacyCookiesP2:
        "Monitorizarea opțională este afișată doar când funcția este activată, iar colectarea începe după o alegere explicită Acceptă / Refuză.",
      privacyChangesTitle: "11. Modificări ale acestei note",
      privacyChangesP1:
        "Putem actualiza această pagină când site-ul, furnizorii sau cerințele legale se schimbă. Data „Ultima actualizare” de sus va fi revizuită. Modificările materiale ale monitorizării opționale vor continua să respecte un refuz anterior până alegi altfel.",
      privacyDisclaimerTitle: "12. Declarație importantă",
      privacyDisclaimerP1:
        "Această pagină este o notă practică de confidențialitate pentru un proiect static mic. Nu reprezintă consultanță juridică. Dacă operezi acest site pentru o organizație, cere unui avocat să revizuiască identitatea operatorului, datele de contact, retenția și contractele cu împuterniciții (inclusiv DPA Datadog și termenii Google / Cloudflare) înainte de a te baza pe ea public.",
      privacyFooterBack: "← Înapoi la Ikigai Finder",
      privacyFooterRegion: "Belgia / UE · GDPR"
    }
  };

  for (const locale of Object.keys(privacy)) {
    if (!I18N.strings[locale]) I18N.strings[locale] = {};
    Object.assign(I18N.strings[locale], privacy[locale]);
  }
})();
