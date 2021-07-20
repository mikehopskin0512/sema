import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar';

const withLayout = (Page) => () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isMenuOpen = localStorage.getItem('sema_menu_open');
    if (isMenuOpen) {
      setOpen(JSON.parse(isMenuOpen));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sema_menu_open', JSON.stringify(open));
  }, [open]);

  return (
    <div className="is-flex hero is-flex-direction-row is-fullheight">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`content-wrapper hero is-fullheight is-flex is-flex-direction-column px-25 py-25 background-gray-white ${open ? 'open' : 'close'}`}
      >
        <Page />
      </div>
    </div>
  );
};

export default withLayout;
