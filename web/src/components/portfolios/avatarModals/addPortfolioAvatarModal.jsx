import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '../../../components/Icons';
import { AVATAR_MODAL_TITLE, MAXIMUM_SIZE_TEXT, SUPPORTED_FORMATS } from './constants';

const AddPortfolioAvatarModal = ({ close, onError, onChange }) => {

  return (
    <>
      <div className="modal support-form-modal is-active" >
        <div className="modal-background" />
        <div className="modal-content" style={{ width: '60%' }}>
          <div className="has-background-white p-40 border-radius-8px">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-25">
              <p className="is-size-3 has-text-weight-semibold is-size-3-mobile">{AVATAR_MODAL_TITLE}</p>
              <button type='button' onClick={close} className="button is-ghost has-text-black-900">
                <CloseIcon size='medium' />
              </button>
            </div>
            <div style={{ fontSize: '18px' }}>
              <p>Here you can upload a new photo for your Portfolio.</p>
              <p className="mb-30">Changes will be applied to this Developer Portfolio only.</p>
              <p className="has-text-gray-700">{`Supported file formats: ${SUPPORTED_FORMATS}`}</p>
              <p className="has-text-gray-700">{MAXIMUM_SIZE_TEXT}</p>
            </div>
            <div className='mt-40 p-0'>
              <input type="file" id="input_file_add_modal" className="is-hidden" onChange={(e) => onChange(e.target.files[0], onError, close)}/>
              <label className="p-10 has-background-primary has-text-white border-radius-4px is-clickable is-size-6" htmlFor='input_file_add_modal'>Choose Photo</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AddPortfolioAvatarModal.propTypes = {
  close: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AddPortfolioAvatarModal;