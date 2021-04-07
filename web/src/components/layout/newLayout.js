/* eslint react/no-danger: 0, max-len: 0 */
import Head from 'next/head';
import Header from '../header';
import Footer from '../footer';

const withLayout = (Page) => {
  return () => (
    <div className="Layout">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: `` }} />
      </Head>
      <Page />
      <Footer />
    </div>
  );
};

export default withLayout;
