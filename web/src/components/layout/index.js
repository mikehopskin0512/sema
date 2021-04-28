/* eslint react/no-danger: 0, max-len: 0 */
import Head from 'next/head';
import Header from '../header';
import Footer from '../footer';

const withLayout = (Page) => () => (
  <div className="Layout">
    {/* Styling for full height width */}
    <style global jsx>{`
      html,
      body,
      body > div:first-child,
      div#__next,
      div#__next > div
      {
        height: 100%;
      }
    `}
    </style>
    <Head>
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
    <Header />
    <Page style={{ backgroundColor: '#FCFCFC' }} />
    <Footer />
  </div>
);

export default withLayout;
