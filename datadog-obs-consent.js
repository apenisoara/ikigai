const STORAGE_KEY = 'ikigai-website:monitoring-consent:v1';
const PRIVACY_HREF = 'privacy.html#optional-monitoring';

const FALLBACK_COPY = {
  analyticsPreferences: 'Analytics preferences',
  monitoringConsentTitle: 'Site analytics and performance',
  monitoringConsentCopy:
    'To keep this site fast and reliable, we’d like to collect anonymous analytics about page visits, interactions, performance, and errors. This is optional and helps us improve your experience.',
  monitoringConsentLearnMore: 'Learn more',
  monitoringConsentAccept: 'Accept',
  monitoringConsentDecline: 'Decline'
};

let initialized = false;
let choice = null;
let rumLoadPromise = null;

function copy(key) {
  if (typeof window.t === 'function') {
    try {
      return window.t(key);
    } catch {
      // Use the English fallback below.
    }
  }
  return FALLBACK_COPY[key] || key;
}

function applyCopy(root) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = copy(key);
  });
}

function readChoice() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return ['granted', 'denied'].includes(value) ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Consent still applies to the current page.
  }
}

function syncRumConsent() {
  window.DD_RUM?.onReady(() => {
    window.DD_RUM.setTrackingConsent(
      choice === 'granted' ? 'granted' : 'not-granted'
    );
  });
}

function loadRum() {
  if (choice !== 'granted') return;

  if (!rumLoadPromise) {
    rumLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = new URL(
        './datadog-obs-rum.js',
        import.meta.url
      ).href;

      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error('Could not load the RUM initializer.'));
      };

      document.head.appendChild(script);
    }).catch(error => {
      rumLoadPromise = null;
      console.warn(error);
    });
  }
}

function ensureSettingsButton() {
  let settings = document.querySelector('#monitoring-settings');
  if (settings) return settings;

  settings = document.createElement('button');
  settings.type = 'button';
  settings.id = 'monitoring-settings';
  settings.className = 'text-button';
  settings.hidden = true;
  settings.setAttribute('data-i18n', 'analyticsPreferences');
  settings.textContent = copy('analyticsPreferences');

  const footerMeta = document.querySelector('.footer-meta');
  if (footerMeta) {
    const version = footerMeta.querySelector('#app-version');
    footerMeta.insertBefore(settings, version);
  } else {
    const footer = document.querySelector('.site-footer');
    (footer || document.body).appendChild(settings);
  }

  return settings;
}

function ensureConsentPanel() {
  let panel = document.querySelector('#monitoring-consent');
  if (panel) return panel;

  panel = document.createElement('section');
  panel.id = 'monitoring-consent';
  panel.className = 'monitoring-consent';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'monitoring-consent-title');
  panel.innerHTML = `
    <div class="monitoring-consent-inner">
      <div class="monitoring-consent-copy">
        <h2 id="monitoring-consent-title" data-i18n="monitoringConsentTitle"></h2>
        <p>
          <span data-i18n="monitoringConsentCopy"></span>
          <a href="${PRIVACY_HREF}" data-i18n="monitoringConsentLearnMore"></a>
        </p>
      </div>
      <div class="monitoring-consent-actions">
        <button type="button" id="monitoring-reject" class="secondary-button" data-i18n="monitoringConsentDecline"></button>
        <button type="button" id="monitoring-accept" data-i18n="monitoringConsentAccept"></button>
      </div>
    </div>
  `;
  applyCopy(panel);
  document.body.appendChild(panel);
  return panel;
}

function ensureConsentUi() {
  const panel = ensureConsentPanel();
  const settings = ensureSettingsButton();
  return {
    panel,
    settings,
    accept: document.querySelector('#monitoring-accept'),
    reject: document.querySelector('#monitoring-reject')
  };
}

export function initializeMonitoringConsent() {
  if (initialized) return;
  initialized = true;

  const { panel, settings, accept, reject } = ensureConsentUi();

  choice = readChoice();

  // The RUM initializer reads this when it actually initializes.
  window.siteMonitoringConsentGranted = () => choice === 'granted';

  function applyChoice(value, persist = false) {
    choice = value;

    if (persist) saveChoice(value);

    if (panel) panel.hidden = choice !== null;
    syncRumConsent();

    if (choice === 'granted') {
      loadRum();
    }
  }

  accept?.addEventListener('click', () => {
    applyChoice('granted', true);
  });

  reject?.addEventListener('click', () => {
    applyChoice('denied', true);
  });

  settings?.addEventListener('click', () => {
    if (panel) panel.hidden = false;
  });

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY || event.key === null) {
      applyChoice(readChoice());
    }
  });

  document.addEventListener('ikigai:localechange', () => {
    applyCopy(document);
  });

  // Expose settings only after the feature flag has passed.
  if (settings) settings.hidden = false;

  if (!panel || !settings || !accept || !reject) {
    console.warn(
      'Monitoring consent UI is incomplete; using the stored choice only.'
    );
  }

  applyChoice(choice);
}
