let amplitude = null;

export const AMPLITUDE_EVENTS = {
  PAGE_VISIT: 'PAGE_VISIT',
};

// Conditional import and init amplitude only on the browser side
export const initAmplitude = (user) => {
  if (process.browser) {
    amplitude = require('amplitude-js');
    amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, user);
  }
};

export const fireAmplitudeEvent = (event, opts) => {
  amplitude.getInstance().logEvent(event, {
    ...opts,
  });
};

// log the pageview with their URL
export const googleAnalyticsPageView = (url) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
};

// log specific events happening.
export const googleAnalyticsEvent = ({ action, params }) => {
  window.gtag('event', action, params);
};
