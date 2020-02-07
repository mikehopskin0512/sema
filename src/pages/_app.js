import React from 'react';

import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { makeStore } from '../modules';

import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
library.add(faUser, faEnvelope, faLock, faTwitter, faFacebook)



const MyApp = ({ Component, pageProps, store }) => {
    return (
      <Provider store={store}>
          <Component {...pageProps} />
      </Provider>
    );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
    // we can dispatch from here too
    ctx.store.dispatch({ type: 'FOO', payload: 'foo' });
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
};

export default withRedux(makeStore)(MyApp);
