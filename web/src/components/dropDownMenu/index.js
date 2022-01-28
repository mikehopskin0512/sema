import clsx from 'clsx';
import React, { useRef } from 'react';
import usePopup from '../../hooks/usePopup';
import useOutsideClick from '../../utils/useOutsideClick';

const DropDownMenu = ({ trigger, options = [] }) => {
  const popupRef = useRef(null);
  const { isOpen, toggleMenu, closeMenu } = usePopup(popupRef);
  useOutsideClick(popupRef, () => {
    if (isOpen) closeMenu();
  });
  return (
    <div
      className={clsx('ml-auto dropdown ', isOpen ? 'is-active' : '')}
      ref={popupRef}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="dropdown-trigger" onClick={toggleMenu}>
        {trigger}
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content  py-0">
          <div className="dropdown-content">
            <div className="dropdown-item py-0">
              {options.map(({ label, onClick }) => (
                <button
                  type="button"
                  className="button is-small px-0 is-ghost has-background-white has-text-black outline-none"
                  onClick={onClick}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;