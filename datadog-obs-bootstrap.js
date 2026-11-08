const LOG_PREFIX = '[Datadog Obs]';

function withTimeout(fetchFn, timeoutMs) {
  return (input, init) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, controller.signal])
      : controller.signal;

    return fetchFn(input, { ...init, signal }).finally(() => clearTimeout(timer));
  };
}

async function bootstrap() {
  const flagKey = 'ikigai-website-dd-rum-enable';
  const defaultValue = false;

  console.info(LOG_PREFIX, 'bootstrap started');

  try {
    console.info(LOG_PREFIX, 'loading OpenFeature + Datadog provider SDKs…');
    // Third-party ESM CDN; no local npm/build step.
    const [{ DatadogProvider }, { OpenFeature }] = await Promise.all([
      import('https://esm.sh/@datadog/openfeature-browser@2'),
      import('https://esm.sh/@openfeature/web-sdk@1')
    ]);
    console.info(LOG_PREFIX, 'SDKs loaded');

    const evaluationContext = {
      targetingKey: 'website-global-switch',
      product: 'ikigai-website',
      service: 'github-pages-site',
      version: window.__IKIGAI_APP__?.version || 'dev'
    };

    console.info(LOG_PREFIX, 'creating DatadogProvider', {
      site: 'datadoghq.eu',
      env: 'production',
      flagFetchTimeoutMs: 5_000,
      evaluationContext
    });

    const provider = new DatadogProvider({
      applicationId: '8af12853-ed51-4dd3-a763-ff1b25f5a295',
      clientToken: 'pub573bee008a33ead06ba6d4274e201f4e',
      site: 'datadoghq.eu',
      env: 'production',
      flagConfigurationFetch: withTimeout(globalThis.fetch, 5_000),

      enableRumFeatureFlagTracking: false,
      enableFlagEvaluationTracking: false
    });

    console.info(LOG_PREFIX, 'waiting for OpenFeature provider…');
    await OpenFeature.setProviderAndWait(provider, evaluationContext);
    console.info(LOG_PREFIX, 'OpenFeature provider ready');

    const client = OpenFeature.getClient();
    const enabled = client.getBooleanValue(flagKey, defaultValue);

    console.info(LOG_PREFIX, 'flag evaluated', {
      flagKey,
      defaultValue,
      enabled
    });

    if (!enabled) {
      console.info(LOG_PREFIX, 'RUM skipped — feature flag is off');
      return;
    }

    const rumSrc = new URL('./datadog-obs-rum.js', import.meta.url).href;
    console.info(LOG_PREFIX, 'feature flag is on — injecting RUM initializer', {
      src: rumSrc
    });

    const script = document.createElement('script');

    // Relative to this JS file, not the page URL.
    script.src = rumSrc;
    script.async = true;
    script.onload = () => {
      console.info(LOG_PREFIX, 'RUM initializer script loaded');
    };
    script.onerror = () => {
      console.warn(LOG_PREFIX, 'Could not load the RUM initializer.', { src: rumSrc });
    };

    document.head.appendChild(script);
    console.info(LOG_PREFIX, 'RUM initializer <script> appended to <head>');
  } catch (error) {
    // A flag/CDN failure must not break the website.
    console.warn(LOG_PREFIX, 'RUM not loaded: flag initialization failed.', error);
  }
}

bootstrap();
