import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ExportButton = ({ onExport }) => {
  return (
    <button className="button has-background-purple has-text-white" onClick={onExport}>
      <span className="icon">
        <FontAwesomeIcon icon={'download'} />
      </span>
      <span>Export as CSV</span>
    </button>
  )
};

export default ExportButton;
