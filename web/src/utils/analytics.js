const amplitudeApiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || null;
let amplitude = null;

export const AMPLITUDE_EVENTS = {
  CLICKED_LOGIN: 'CLICKED_LOGIN',
  CLICKED_LOG_OUT: 'CLICKED_LOG_OUT',
  CLICKED_JOIN_WAITLIST: 'CLICKED_JOIN_WAITLIST',
  VIEWED_PAGE: 'VIEWED_PAGE',
  VIEWED_DASHBOARD_PAGE: 'VIEWED_DASHBOARD_PAGE',
  VIEWED_PERSONAL_INSIGHTS_PAGE: 'VIEWED_PERSONAL_INSIGHTS_PAGE',
  VIEWED_SUGGESTED_SNIPPETS_PAGE: 'VIEWED_SUGGESTED_SNIPPETS_PAGE',
  VIEWED_REPOS_PAGE: 'VIEWED_REPOS_PAGE',
  VIEWED_INVITATIONS_PAGE: 'VIEWED_INVITATIONS_PAGE',
  VIEWED_PROFILE_PAGE: 'VIEWED_PROFILE_PAGE',
  VIEWED_ONBOARDING_WIZARD: 'VIEWED_ONBOARDING_WIZARD',
  CLICKED_SEND_INVITATION: 'CLICKED_SEND_INVITATION'
};

// Conditional import and init amplitude only on the browser side
export const initAmplitude = (user) => {
  if (amplitudeApiKey) {
    if (process.browser) {

      const { _id, username, firstName, lastName, isVerified, isWaitlist, roles = [] } = user;

      // ## REFACTORING NEEDED ##
      // Roles is an array (ie. users can have several roles and teams)
      // This needs to be refactored to decide what role/team we'd want to pass to Amplitude (if any)
      // Trying to handle it as a single role/team won't work and a user without a userrole will fail

      // const [{ role = null, team = null }] = roles;

      amplitude = require('amplitude-js');
      amplitude.getInstance().init(amplitudeApiKey, username);

      amplitude.getInstance().setUserProperties({
        user_id: _id,
        first_name: firstName,
        last_name: lastName,
        is_verified: isVerified,
        is_waitlist: isWaitlist,
        // Removed based on comments above
        // ## REFACTORING NEEDED ##
        // role: role?.name,
        // team: team?.name,
      });
    }
  }
};

export const fireAmplitudeEvent = (event, opts) => {
  const { url } = opts;
  if (amplitudeApiKey) {
    if (event ==='VIEWED_PAGE') {
      if (url === '/dashboard') {
        event = AMPLITUDE_EVENTS.VIEWED_DASHBOARD_PAGE;
      } else if (url === '/personal-insights') {
        event = AMPLITUDE_EVENTS.VIEWED_PERSONAL_INSIGHTS_PAGE;
      } else if (url === '/suggested-snippets') {
        event = AMPLITUDE_EVENTS.VIEWED_SUGGESTED_SNIPPETS_PAGE;
      }  else if (url === '/dashboard') {
        event = AMPLITUDE_EVENTS.VIEWED_REPOS_PAGE;
      }  else if (url === '/invitations') {
        event = AMPLITUDE_EVENTS.VIEWED_INVITATIONS_PAGE;
      }  else if (url === '/profile') {
        event = AMPLITUDE_EVENTS.VIEWED_PROFILE_PAGE;
      }
    }
  }

  amplitude?.getInstance().logEvent(event, {
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
