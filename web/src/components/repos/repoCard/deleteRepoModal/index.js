import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { CloseIcon } from '../../../Icons';

const deleteRepoModal = ({ isOpen, onCancel, onConfirm }) => {
  const modalRef = useRef(null);
  const { organization } = useSelector((state) => state.authState?.selectedOrganization);

  return (
    <div
      className={`modal ${isOpen ? 'is-active' : ''}`}
      ref={modalRef}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-background" />
      <div className="modal-content px-10" style={{ maxWidth: '650px' }}>
        <div className="p-50 has-background-white is-flex is-flex-direction-column">
          <div className="is-flex has-text-black has-text-weight-bold is-size-3 mb-16">
            Do you want to remove repo
            from {organization?.name}?
            <div className="ml-24 has-text-black-900-dark" onClick={onCancel}>
              <CloseIcon />
            </div>
          </div>
          <p className="mb-24">
            <span className="is-size-6 pr-32"> By deleting this repo you will remove access for your organization member</span>
          </p>
          <div className="ml-auto">
            <button
              className="button mr-16"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button has-background-red-500 has-text-white"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default deleteRepoModal;
