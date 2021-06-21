import React from 'react';
import Sidebar from '../sidebar';

const withLayout = (Page) => {
  return () => (
    <div className="is-flex hero is-flex-direction-row is-fullheight">
      <Sidebar />
      <div className="is-flex-grow-1">
        <Page />
      </div>
    </div>
  );
};

export default withLayout;