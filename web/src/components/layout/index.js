/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './layout.module.scss';
import Header from '../header';
import Footer from '../footer';
import ExtensionStatus from '../extensionStatus';
import { noContactUs, FACEBOOK_VERIFICATION_META, PATHS } from '../../utils/constants';
import { white0, blue200, blue900 } from '../../../styles/_colors.module.scss';
import OrganizationCreateBanner from '../banners/teamCreate';

const widescreenPages = [
  `${PATHS.REPO}/[repoId]`,
  PATHS.SUPPORT,
  PATHS.LOGIN,
  `${PATHS.ORGANIZATIONS._}/[organizationId]/${PATHS.DASHBOARD}`,
  `${PATHS.PORTFOLIO._}/[portfolioId]`,
  PATHS.PORTFOLIO._,
  `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.SETTINGS}`,
];

const noHeaderPages = [PATHS.LOGIN];

const withLayout = (Page) => (props) => {
  const router = useRouter();
  const { pathname } = router;

  const isWideScreen = widescreenPages.includes(pathname);
  const hasNoHeader = noHeaderPages.includes(pathname);

  return (
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color={blue200} />
        <meta name="msapplication-TileColor" content={blue900} />
        <meta name="theme-color" content={white0} />
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
      <OrganizationCreateBanner />
      <div className={clsx(!isWideScreen && 'container', !noContactUs.includes(pathname) && 'pb-250')}>
        <Page {...props} />
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default withLayout;
