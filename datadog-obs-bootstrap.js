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
  try {
    // Third-party ESM CDN; no local npm/build step.
    const [{ DatadogProvider }, { OpenFeature }] = await Promise.all([
      import('https://esm.sh/@datadog/openfeature-browser@2'),
      import('https://esm.sh/@openfeature/web-sdk@1')
    ]);

    const provider = new DatadogProvider({
      applicationId: '8af12853-ed51-4dd3-a763-ff1b25f5a295',
      clientToken: 'pub573bee008a33ead06ba6d4274e201f4e',
      site: 'datadoghq.eu',
      env: 'production',
      flagConfigurationFetch: withTimeout(globalThis.fetch, 5_000),

      enableRumFeatureFlagTracking: false,
      enableFlagEvaluationTracking: false
    });

    await OpenFeature.setProviderAndWait(provider, {
      targetingKey: 'website-global-switch',
      product: 'ikigai-website',
      service: 'github-pages-site',
      version: window.__IKIGAI_APP__?.version || 'dev'
    });

    const enabled = OpenFeature.getClient().getBooleanValue(
      'ikigai-website-dd-rum-enable',
      false
    );

    console.info(LOG_PREFIX, 'ikigai-website-dd-rum-enable =', enabled);

    if (!enabled) {
      return;
    }

    const { initializeMonitoringConsent } =
      await import('./datadog-obs-consent.js');

    initializeMonitoringConsent();

} catch (error) {
    // A flag/CDN failure must not break the website.
    console.warn(LOG_PREFIX, 'RUM not loaded: flag initialization failed.', error);
  }
}

bootstrap();
