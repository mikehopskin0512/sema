import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '../../../components/Icons';
import { AVATAR_MODAL_TITLE } from './constants';

const ChangePortfolioAvatarModal = ({ close, image, onChange, onSubmit, onError }) => {

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
            <div className="is-full-width">
              <div className="has-text-centered">
                <img className="is-rounded" style={{ width: '160px', height: '160px', borderRadius: '100%', objectFit: 'cover' }} src={image} alt="avatar" />
              </div>
              <div className="mt-25 has-text-centered" style={{ fontSize: '18px' }}>
                Here is your Portfolio photo preview.
              </div>
              <div className='p-0 mt-40 has-text-centered'>
                <input type="file" id="input_file_change_modal" className="is-hidden" onChange={(e) => onChange(e.target.files[0], onError, () => {})}/>
                <label className="p-10 has-text-primary has-text-weight-semibold has-border-blue-700 border-radius-4px is-clickable is-size-6" htmlFor='input_file_change_modal' style={{ border: '2px solid' }}>Choose Another Photo</label>
              </div>
            </div>
            <div className="is-flex mt-25 is-justify-content-right">
              <button className="button is-primary border-radius-4px has-text-weight-semibold" type="button" onClick={onSubmit}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ChangePortfolioAvatarModal.propTypes = {
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
};

export default ChangePortfolioAvatarModal;