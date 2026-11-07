(function () {
    'use strict';
  
    // Avoid loading twice, including during migration from Tampermonkey.
    if (window.DD_RUM) {
      return;
    }
  
    // Datadog asynchronous CDN loader — EU site.
    (function (h, o, u, n, d) {
        h = h[d] = h[d] || {
        q: [],
        onReady: function (callback) {
            h.q.push(callback);
        }
        };

        const script = o.createElement(u);
        script.async = true;
        script.src = n;
        script.crossOrigin = '';

        script.onerror = function () {
        console.error('[Datadog RUM] CDN load failed; check Network and CSP.');
        };

        (o.head || o.documentElement).appendChild(script);
    })(
        window,
        document,
        'script',
        'https://www.datadoghq-browser-agent.com/eu1/v7/datadog-rum.js',
        'DD_RUM'
    );

    window.DD_RUM.onReady(function () {
        window.DD_RUM.init({
        applicationId: '8af12853-ed51-4dd3-a763-ff1b25f5a295',
        clientToken: 'pub573bee008a33ead06ba6d4274e201f4e',
        remoteConfiguration: {
            id: '28692af8-9279-4f6a-8576-507c4b479af8',
        },
        site: 'datadoghq.eu',

        service: 'github-pages-site',
        env: 'local-browser-debug',
        version: '0.2.0',

        allowedTrackingOrigins: [
            'https://apenisoara.github.io'
        ],

        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,

        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,

        defaultPrivacyLevel: 'allow',
        trackingConsent: 'granted'
    });
    });
  })();