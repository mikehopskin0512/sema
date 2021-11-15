import React, { useRef } from 'react';
import usePopup from '../../hooks/usePopup';
import { OptionsIcon, TrashIcon } from '../Icons';

const ActionMenu = () => {
  const popupRef = useRef(null);
  const { isOpen, toggleMenu } = usePopup(popupRef);

  return (
    <div>
      <div className={`dropdown is-right ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button is-text is-small outline-none has-background-white"
            type="button"
            onClick={toggleMenu}
          >
            <OptionsIcon />
          </button>
        </div>
        <div className="dropdown-menu" role="menu" ref={popupRef}>
          <div className="dropdown-content py-10">
            <div className="dropdown-item py-0">
              <button
                type="button"
                className="button is-small is-ghost has-background-white has-text-black outline-none"
              >
                <TrashIcon size="small" color="#de3617" />
                <span className="ml-8">Remove member</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ActionMenu.propTypes = {
};

export default ActionMenu;
