import withLayout from '../components/layout';
import ReportsHeader from './reports/reportsHeader';

const Reports = () => {
  return (
    <div>
      <ReportsHeader />
      <section className="section">
        <div className="container">
          <h1 className="title">Report Title</h1>
          <h2 className="subtitle">
            iFrame of report goes here
          </h2>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
