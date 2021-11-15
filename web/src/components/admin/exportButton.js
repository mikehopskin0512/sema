import React from 'react';
import PropTypes from 'prop-types';
import { DownloadIcon } from '../Icons';

const ExportButton = ({ onExport, label }) => (
  <button type="button" className="button has-background-purple has-text-white" onClick={onExport}>
    <span className="icon">
      <DownloadIcon size="small" />
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
