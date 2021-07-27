import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import {
  faUser, faEnvelope, faLock, faArrowLeft, faArrowRight, faAngleDown,
  faFilter, faCloudDownloadAlt, faPlus, faChevronDown, faChevronUp, faCaretDown, faCaretUp,
  faSearch, faCog, faUserFriends, faDownload
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import initialize from '../state/utils/sentry';
import { initStore } from '../state/store';
import * as ga from '../utils/analytics';

import '../../styles/_theme.scss';
import '../../styles/_calendar.scss';

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
library.add(faUser, faEnvelope, faLock, faArrowLeft, faArrowRight, faAngleDown,
  faFilter, faCloudDownloadAlt, faPlus, faGithub, faTwitter, faFacebook, faChevronDown, faChevronUp, faCaretDown, faCaretUp,
  faSearch, faCog, faUserFriends, faDownload
);

const Application = ({ Component, pageProps, store }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
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
      <Component {...pageProps} />
    </Provider>
  );
};

Application.getInitialProps = async ({ Component, ctx }) => {
  await initialize(ctx);
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
};

export default withRedux(initStore)(Application);
