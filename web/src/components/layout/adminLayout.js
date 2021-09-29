import React from 'react';
import Sidebar from '../adminSidebar';

const withLayout = (Page) => () => {
  return (
    <div className="is-flex hero is-flex-direction-row is-fullheight">
      <Sidebar />
      <div
        className="content-wrapper hero is-fullheight is-flex is-flex-direction-column px-25 py-25 background-gray-white"
      >
        <Page />
      </div>
    </div>
  );
};

export default withLayout;
