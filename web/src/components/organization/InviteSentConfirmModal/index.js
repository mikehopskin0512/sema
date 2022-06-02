import React from 'react';
import PropTypes from 'prop-types';
import { CheckOnlineIcon, CloseIcon } from '../../Icons';
import { blue600 } from '../../../../styles/_colors.module.scss';

const InviteSentConfirmModal = ({ open, onClose }) => {
  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-40 has-background-white border-radius-4px">
          <div className="is-flex is-align-items-center is-justify-content-space-between mb-10">
            <p className="has-text-black has-text-weight-bold is-size-5">
              Invitation(s) Sent
            </p>
            <CloseIcon onClick={onClose} className="is-cursor-pointer" />
          </div>
          <div className="is-flex is-align-items-center mb-30">
            <div className="p-2 border-radius-35px is-flex has-background-blue-50 mr-10">
              <CheckOnlineIcon color={blue600} />
            </div>
            <p className="has-text-gray-700">
              We have successfully sent your invitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

InviteSentConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InviteSentConfirmModal;
