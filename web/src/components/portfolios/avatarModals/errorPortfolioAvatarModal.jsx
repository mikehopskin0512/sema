import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon, AlertTriangleIcon } from '../../../components/Icons';
import { AVATAR_MODAL_TITLE, MAXIMUM_SIZE_TEXT, SUPPORTED_FORMATS } from './constants';

const ErrorPortfolioAvatarModal = ({ close, onChange }) => {

  return (
    <>
      <div className="modal support-form-modal is-active">
        <div className="modal-background" />
        <div className="modal-content" style={{ width: '60%' }}>
          <div className="has-background-white p-40 border-radius-8px">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-25">
              <p className="is-size-3 has-text-weight-semibold is-size-3-mobile">{AVATAR_MODAL_TITLE}</p>
              <button type='button' onClick={close} className="button is-ghost has-text-black-900">
                <CloseIcon size='medium' />
              </button>
            </div>
            <div>
              <AlertTriangleIcon />
              <p className="mb-5 has-text-weight-semibold">This file format is currently not supported or size is too big.</p>
              <p className="has-text-gray-700">{`Please upload file in one of the following formats: ${SUPPORTED_FORMATS}`}</p>
              <p className="has-text-gray-700">{MAXIMUM_SIZE_TEXT}</p>
            </div>
            <div className='mt-35 p-0'>
              <input type="file" id="input_file_error_modal" className="is-hidden" onChange={(e) => onChange(e.target.files[0], () => {}, close)} />
              <label className="p-10 has-background-primary has-text-white border-radius-4px is-clickable is-size-6" htmlFor='input_file_error_modal'>Choose Another Photo</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ErrorPortfolioAvatarModal.propTypes = {
  close: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ErrorPortfolioAvatarModal;