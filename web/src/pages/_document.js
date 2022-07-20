import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as snippet from '@segment/snippet';

const { NEXT_PUBLIC_SEGMENT_API_KEY, NODE_ENV } = process.env;

export default class MyDocument extends Document {
  renderSnippet() {
    const opts = {
      apiKey: NEXT_PUBLIC_SEGMENT_API_KEY,
      page: true,
    };
    if (NODE_ENV === 'development') {
      return snippet.max(opts);
    }
    return snippet.min(opts);
  }

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    if (ctx.query.handle && ctx.query.repoId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/users/infoPreview/${ctx.query.handle}/${ctx.query.repoId}`);
        const data = await response.json();
        return { ...initialProps, ...data };
      } catch (e) {
        console.log(e);
      }
    }
    return { ...initialProps };
  }

  render() {
    const { repo } = this.props?.__NEXT_DATA__?.query;
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bulma-tagsinput@2.0.0/dist/js/bulma-tagsinput.min.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${process.env.INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
              window.Intercom('boot', {
                app_id: '${process.env.INTERCOM_APP_ID}',
                utm_source: 'app',
              });
              `,
            }}
          />
          <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
          <meta name="Content-Type" content="text/html;charset=UTF-8"/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta property="og:url" content="https://app.semasoftware.com" />
          <meta name="twitter:image:alt" content={`My GitHub interactions in ${repo}`}/>
          <meta name="twitter:title" content={`My GitHub interactions in ${repo}`}/>
          <meta name="twitter:description" content="test image"/>
          <meta property="og:image" content={this.props.previewImgLink}/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
