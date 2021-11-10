/* eslint react/no-danger: 0, max-len: 0 */
import React, { useState } from 'react';
import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './layout.module.scss';
import Header from '../header';
import Footer from '../footer';
import ExtensionStatus from '../extensionStatus';
import { noContactUs, FACEBOOK_VERIFICATION_META } from '../../utils/constants';

const widescreenPages = ['/repo/[repoId]', '/support', '/login'];
const noHeaderPages = ['/login'];

const withLayout = (Page) => (props) => {
  const router = useRouter();
  const { pathname } = router;

  const isWideScreen = widescreenPages.includes(pathname);
  const hasNoHeader = noHeaderPages.includes(pathname);

  return(
    <div className="Layout">
      {/* Styling for full height width */}
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}
      </style>
      <Head>
        {/* Favicon icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
        <meta name={FACEBOOK_VERIFICATION_META.NAME} content={FACEBOOK_VERIFICATION_META.CONTENT} />

        {/* Heap Analytics */}
        <script dangerouslySetInnerHTML={{ __html: '' }} />

        {/* browser-update.org */}
        <script dangerouslySetInnerHTML={{ __html: `
        var $buoop = {required:{e:-2,f:-2,o:-2,s:-2,c:-2},insecure:true,api:2020.12 };
        function $buo_f(){
        var e = document.createElement("script");
        e.src = "//browser-update.org/update.min.js";
        document.body.appendChild(e);
        };
        try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
        catch(e){window.attachEvent("onload", $buo_f)}
        ` }} />
      </Head>
      <ExtensionStatus />
      {!hasNoHeader && (<Header />) }
      <div className={clsx(!isWideScreen && "container",!noContactUs.includes(pathname) && "pb-250")}>
        <Page {...props} />
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
};

export default withLayout;
