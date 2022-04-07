import { SEGMENT_API_KEY } from '../constants';
import { AnalyticsBrowser } from '@segment/analytics-next';

// Avoids a request to Segment on every tab.
const segmentSettings = {
  integrations: {
    'Segment.io': {
      apiKey: SEGMENT_API_KEY,
      unbundledIntegrations: [],
      addBundledMetadata: true,
      maybeBundledConfigIds: {},
      versionSettings: { version: '4.4.7', componentTypes: ['browser'] },
    },
  },
  plan: {
    track: { __default: { enabled: true, integrations: {} } },
    identify: {
      __default: { enabled: true },
      email: { enabled: true },
      name: { enabled: true },
    },
    group: { __default: { enabled: true } },
  },
  edgeFunction: {},
  analyticsNextEnabled: true,
  middlewareSettings: {},
  enabledMiddleware: {},
  metrics: { sampleRate: 0.1 },
  legacyVideoPluginsEnabled: false,
  remotePlugins: [],
};

let segmentLoaded = false;

export function initSegment(user) {
  if (!segmentLoaded) loadSegment();

  segmentLoaded = true;

  const { _id, username, firstName = '', lastName = '' } = user;

  analytics.identify(_id, {
    name: `${firstName} ${lastName}`.trim(),
    email: username,
  });
}

// Based on https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart
// but using @segment/analytics-next to prevent loading the snippet
// from the Segment CDN.
async function loadSegment() {
  const analytics = (window.analytics = window.analytics || []);

  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
    'addSourceMiddleware',
    'addIntegrationMiddleware',
    'setAnonymousId',
    'addDestinationMiddleware',
  ];

  analytics.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }

  const [instance] = await AnalyticsBrowser.load({
    cdnSettings: segmentSettings,
  });

  window.analytics = instance;
}
