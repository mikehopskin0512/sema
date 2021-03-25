/* eslint react/no-danger: 0, max-len: 0 */
import Head from 'next/head';
import Header from '../header';
import Footer from '../footer';

const withLayout = (Page) => () => (
  <div className="Layout">
    <Head>
      {/* Heap Analytics */}
      <script dangerouslySetInnerHTML={{ __html: `
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
        heap.load(${process.env.NEXT_PUBLIC_HEAP_ANALYTICS_ID});
     ` }} />

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
    <Page style={{backgroundColor: "#f8f8f8"}} />
    <Footer />
  </div>
);

export default withLayout;
