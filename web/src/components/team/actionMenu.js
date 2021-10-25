import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import usePopup from '../../hooks/usePopup';

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
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
        <div className="dropdown-menu" role="menu" ref={popupRef}>
          <div className="dropdown-content py-10">
            <div className="dropdown-item py-0">
              <button
                type="button"
                className="button is-small is-ghost has-background-white has-text-black outline-none"
              >
                <FontAwesomeIcon color="#de3617" icon={faTrashAlt} />
                <span className="ml-5">Remove member</span>
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
