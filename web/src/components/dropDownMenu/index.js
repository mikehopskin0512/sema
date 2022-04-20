import clsx from 'clsx';
import React, { useRef } from 'react';
import usePopup from '../../hooks/usePopup';
import useOutsideClick from '../../utils/useOutsideClick';

const DropDownMenu = ({ trigger, options = [], isRight = false, isUp = false }) => {
  const popupRef = useRef(null);
  const { isOpen, toggleMenu, closeMenu } = usePopup(popupRef);
  useOutsideClick(popupRef, () => {
    if (isOpen) closeMenu();
  });
  return (
    <div
      className={clsx(
        'dropdown ',
        isOpen ? 'is-active' : '',
        isRight && 'is-right',
        isUp && 'is-up',
      )}
      ref={popupRef}
      onClick={(event) => event.stopPropagation()}
      aria-hidden="true"
    >
      <div className="dropdown-trigger" onClick={toggleMenu} aria-hidden="true">
        {trigger}
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content  py-0">
          <div className="dropdown-content">
            {options.map(({ label, onClick, isHidden }, i) => (
              <div key={i} className={clsx("dropdown-item py-0", isHidden && 'is-hidden')}>
                <button
                  type="button"
                  className="button is-small px-0 is-ghost has-background-white has-text-black outline-none"
                  onClick={() => {
                    onClick();
                    closeMenu();
                  }}
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
