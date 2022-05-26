import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const DeleteMemberModal = ({ open, onClose, member, onSubmit }) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-40 has-background-white border-radius-4px">
          <p className="has-text-black has-text-weight-bold is-size-5 mb-10">
            Remove Organization Member
          </p>
          <p className="mb-30 has-text-gray-700">
            {'You are about to remove '}
            <b>{member ? member.userInfo.name : ''}</b>
            {' from '}
            <b>Sema Corporate Organization</b>.
            <br />
            {' Are you sure you would like to make this change?'}
          </p>
          <div className="is-flex is-justify-content-flex-end">
            <div className="px-10">
              <button
                className="button is-fullwidth is-outlined is-primary is-size-7 px-40"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                className={clsx('button is-fullwidth has-background-error has-text-white is-size-7 px-40')}
                type="button"
                onClick={handleSubmit}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteMemberModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DeleteMemberModal;
