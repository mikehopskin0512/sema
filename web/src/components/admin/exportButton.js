import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ExportButton = ({ onExport, label }) => (
  <button type="button" className="button has-background-purple has-text-white" onClick={onExport}>
    <span className="icon">
      <FontAwesomeIcon icon="download" />
    </span>
    <span>{ label || 'Export as CSV'}</span>
  </button>
);

ExportButton.propTypes = {
  onExport: PropTypes.func.isRequired,
  label: PropTypes.string,
};

ExportButton.defaultProps = {
  label: '',
};

export default ExportButton;
