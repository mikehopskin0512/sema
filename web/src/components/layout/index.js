import Header from '../header';
import Footer from '../footer';
import './style.scss';

const withLayout = (Page) => {
  return () => (
    <div className="Layout">
      <Header />
      <Page />
      <Footer />
    </div>
  );
};

export default withLayout;
