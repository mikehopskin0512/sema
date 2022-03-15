import PropTypes from 'prop-types';
import React from 'react';
import { SaveIcon } from '../../Icons';

const SnapshotButton = ({ onClick }) => (
  <div className="ml-auto has-background-white">
    <button onClick={onClick} type="button" className="button is-primary is-outlined">
      <SaveIcon size="small" />
      <span className="ml-8 has-text-weight-semibold">Snapshot for Portfolio</span>
    </button>
  </div>
);

SnapshotButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SnapshotButton;
