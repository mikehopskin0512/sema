import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const RoleChangeModal = ({ open, onClose, member, onSubmit }) => {
  const handleSubmit = () => {
    if (!member || !member.newRole) return;

    onSubmit(member.userRoleId, member.newRole.value);
    onClose();
  };

  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-40 has-background-white border-radius-4px">
          <p className="has-text-black has-text-weight-bold is-size-5 mb-10">
            Please Confirm Role Change
          </p>
          <p className="mb-30 has-text-gray-700">
            {'You are about to change '}
            <b>{member ? member.name : ''}</b>
            {'\'s role to '}
            <b>{(member && member.newRole) ? member.newRole.label : ''}</b>.
            {' Are you sure to proceed?'}
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
                className={clsx('button is-primary is-fullwidth is-size-7 px-40')}
                type="button"
                onClick={handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RoleChangeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RoleChangeModal;
