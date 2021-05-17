import Sidebar from '../sidebar';

const withLayout = (Page) => {
  return () => (
    <div className="admin-layout">
      <Sidebar />
      <div className="content-wrapper">
        <Page />
      </div>
    </div>
  );
};

export default withLayout;
