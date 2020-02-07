import React from 'react'
import App, { Container } from 'next/app'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

library.add(faUser, faEnvelope, faLock, faTwitter, faFacebook)

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
