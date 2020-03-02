import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import {
  faUser, faEnvelope, faLock, faArrowLeft,
  faFilter, faCloudDownloadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { initialize } from '../state/utils/sentry';
import { initStore } from '../state/store';

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
library.add(faUser, faEnvelope, faLock, faArrowLeft,
  faFilter, faCloudDownloadAlt, faTwitter, faFacebook);

const Application = ({ Component, pageProps, store }) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

Application.getInitialProps = async ({ Component, ctx }) => {
  initialize(ctx);
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
};

export default withRedux(initStore)(Application);
