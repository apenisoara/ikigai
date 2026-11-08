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
  
        enableRumFeatureFlagTracking: false,
        enableFlagEvaluationTracking: false
      });
  
      await OpenFeature.setProviderAndWait(provider, {
        targetingKey: 'website-global-switch'
      });
  
      const enabled = OpenFeature.getClient().getBooleanValue(
        'ikigai-website-dd-rum-enable',
        false
      );
  
      if (!enabled) {
        return;
      }
  
      const script = document.createElement('script');
  
      // Relative to this JS file, not the page URL.
      script.src = new URL(
        './datadog-obs-rum.js',
        import.meta.url
      ).href;
  
      script.async = true;
      script.onerror = () => {
        console.warn('Could not load the RUM initializer.');
      };
  
      document.head.appendChild(script);
    } catch (error) {
      // A flag/CDN failure must not break the website.
      console.warn('RUM not loaded: flag initialization failed.', error);
    }
  }
  
  bootstrap();