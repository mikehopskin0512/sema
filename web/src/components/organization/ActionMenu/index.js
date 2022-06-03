import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DotsIcon, TrashIcon } from '../../Icons';
import usePopup from '../../../hooks/usePopup';
import DeleteMemberModal from '../deleteMemberModal';
import useOutsideClick from '../../../utils/useOutsideClick';

const ActionMenu = ({ member, onRemove, disabled = false }) => {
  const popupRef = useRef(null);
  const { isOpen, toggleMenu, closeMenu } = usePopup(popupRef);
  const [modalOpen, setModalOpen] = useState(false);

  useOutsideClick(popupRef, () => {
    if (isOpen) closeMenu();
  });

  const handleSubmit = () => {
    onRemove(member._id);
  };

  return (
    <div>
      <div className={`dropdown is-right ${isOpen ? 'is-active' : ''}`}>
        {!disabled && (<div className="dropdown-trigger">
          <button
            className="button is-text is-small outline-none has-background-white"
            type="button"
            onClick={toggleMenu}
          >
            <DotsIcon />
          </button>
        </div>)}
        <div className="dropdown-menu" role="menu" ref={popupRef}>
          <div className="dropdown-content py-10">
            <div className="dropdown-item py-0">
              <button
                type="button"
                className="button is-small px-0 is-ghost has-background-white has-text-black outline-none"
                onClick={() => setModalOpen(true)}
              >
                <span className="has-text-red-500 mr-10">
                  <TrashIcon />
                </span>
                Remove member
              </button>
            </div>
          </div>
        </div>
        <DeleteMemberModal
          onSubmit={handleSubmit}
          member={member}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
        />
      </div>
    </div>
  );
};

ActionMenu.propTypes = {
  member: PropTypes.any.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ActionMenu;
