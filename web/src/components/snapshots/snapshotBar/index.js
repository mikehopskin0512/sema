import PropTypes from 'prop-types';
import React from 'react';
import { blue500 } from '../../../../styles/_colors.module.scss';
import { CameraIcon, SaveIcon } from '../../Icons';
import { SEMA_FAQ_URL } from '../../../utils/constants';

const DEFAULT_TEXT = 'Save this as a snapshot on your Portfolio.';
const SnapshotBar = ({ hasActionButton = false, onClick, text = DEFAULT_TEXT }) => {
  return (
    <div
      style={{ borderColor: blue500, minHeight: 56 }}
      className="is-flex is-align-items-center px-16 py-8 has-background-blue-0 is-bordered border-radius-4px"
    >
      <div className="mr-16 is-flex has-text-blue-700">
        <CameraIcon />
      </div>
      <span className="is-size-7">
        {text}&nbsp;
      </span>
      <a
        href={`${SEMA_FAQ_URL}#what-are-snapshots`}
        target="_blank"
        rel="noreferrer"
        className="is-size-7 is-underlined has-text-primary">
        Learn more about Snapshots.
      </a>
      {hasActionButton && (
        <div className="ml-auto has-background-white">
          <button onClick={onClick} type="button" className="button is-primary is-outlined">
            <SaveIcon size="small" />
            <span className="ml-8 has-text-weight-semibold">Snapshot for Portfolio</span>
          </button>
        </div>
      )}
    </div>
  );
};

SnapshotBar.propTypes = {
  hasActionButton: PropTypes.bool,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default SnapshotBar;
