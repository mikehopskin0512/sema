import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ArchiveModal = ({
  active,
  onClose,
  onSubmit,
  data,
  message,
}) => {
  const [text, setText] = useState('');

  const handleClick = () => {
    onSubmit(data);
    setText('');
    onClose();
  };

  const isActive = data[0] && data[0].isActive;

  return (
    <div className={`modal ${active ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-50 has-background-white">
          <div className="mb-30">
            <p className="has-text-black has-text-weight-bold is-size-5 mb-10">Are you sure you want to do this?</p>
            <p className="has-text-grey mb-10">{`You're about to ${isActive ? 'Archive' : 'UnArchive'} ${data.length} ${message}`}</p>
            <p className="has-text-black has-text-weight-bold">{`Type "${message}" to confirm this action.`}</p>
          </div>
          <input className="input has-background-white mb-40" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="is-flex is-justify-content-center">
            <div className="px-10">
              <button
                className="button is-normal px-20 is-fullwidth is-primary is-outlined has-text-weight-semibold is-size-7"
                onClick={() => onClose()}
                type="button"
              >
                Cancel
              </button>
            </div>
            <div className="px-10">
              <button
                className="button is-normal px-20 has-text-white has-background-orange is-fullwidth has-text-weight-semibold is-size-7"
                type="button"
                onClick={handleClick}
                disabled={text !== message}
              >
                {isActive ? 'Archive' : 'UnArchive'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ArchiveModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
};

export default ArchiveModal;
