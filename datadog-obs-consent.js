const STORAGE_KEY = 'ikigai-website:monitoring-consent:v1';

let initialized = false;
let choice = null;
let rumLoadPromise = null;

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

export function initializeMonitoringConsent() {
  if (initialized) return;
  initialized = true;

  const panel = document.querySelector('#monitoring-consent');
  const settings = document.querySelector('#monitoring-settings');
  const accept = document.querySelector('#monitoring-accept');
  const reject = document.querySelector('#monitoring-reject');

  if (!panel || !settings || !accept || !reject) {
    console.warn('Monitoring disabled: consent UI is missing.');
    return;
  }

  choice = readChoice();

  // The RUM initializer reads this when it actually initializes.
  window.siteMonitoringConsentGranted = () => choice === 'granted';

  function applyChoice(value, persist = false) {
    choice = value;

    if (persist) saveChoice(value);

    panel.hidden = choice !== null;
    syncRumConsent();

    if (choice === 'granted') {
      loadRum();
    }
  }

  accept.addEventListener('click', () => {
    applyChoice('granted', true);
  });

  reject.addEventListener('click', () => {
    applyChoice('denied', true);
  });

  settings.addEventListener('click', () => {
    panel.hidden = false;
  });

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY || event.key === null) {
      applyChoice(readChoice());
    }
  });

  // Expose settings only after the feature flag has passed.
  settings.hidden = false;

  applyChoice(choice);
}