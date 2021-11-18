import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import {
  faUser, faEnvelope, faLock, faArrowLeft, faArrowRight, faAngleDown,
  faFilter, faCloudDownloadAlt, faPlus, faChevronDown, faChevronUp, faCaretDown, faCaretUp,
  faSearch, faCog, faUserFriends, faDownload, faPaperPlane, faFileContract, faFileSignature
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import 'react-dates/initialize';
import initialize from '../state/utils/sentry';
import { initStore } from '../state/store';
import * as analytics from '../utils/analytics';

import '../../styles/_theme.scss';
import '../../styles/_calendar.scss';
import '../../styles/_calendar_overrides.scss';
import usePermission from '../hooks/usePermission';
import NotFound from './404';
import { permissionsMap } from '../data/permissions';
import { SEMA_TEAM_ADMIN_NAME } from '../utils/constants';

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
library.add(faUser, faEnvelope, faLock, faArrowLeft, faArrowRight, faAngleDown,
  faFilter, faCloudDownloadAlt, faPlus, faGithub, faTwitter, faFacebook, faChevronDown, faChevronUp, faCaretDown, faCaretUp,
  faSearch, faCog, faUserFriends, faDownload, faPaperPlane, faFileContract, faFileSignature
);

function Layout({ Component, pageProps }) {
  const { checkAccess } = usePermission();
  const router = useRouter();

  const checkPermission = () => {
    if (permissionsMap[router.pathname]) {
      const unauthorizedAccess = permissionsMap[router.pathname].find((permission) => !checkAccess({name: SEMA_TEAM_ADMIN_NAME}, permission));
      return !unauthorizedAccess;
    }
    return true;
  };

  return (
    checkPermission() ? <Component {...pageProps} /> : <NotFound />
  );
}

const Application = ({ Component, pageProps, store }) => {
  const router = useRouter();

  useEffect(() => {
    const { authState: { user = null } } = store.getState();

    analytics.initAmplitude(user);

    const handleRouteChange = (url) => {
      analytics.googleAnalyticsPageView(url);
      analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.VIEWED_PAGE, { url });
    };

    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Provider store={store}>
      <Layout Component={Component} pageProps={pageProps} />
    </Provider>
  );
};

Application.getInitialProps = async ({ Component, ctx }) => {
  await initialize(ctx);
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
};

export default withRedux(initStore)(Application);
