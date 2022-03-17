import PropTypes from 'prop-types';
import React from 'react';
import { blue500 } from '../../../../styles/_colors.module.scss';
import { CameraIcon, SaveIcon } from '../../Icons';
import { SEMA_FAQ_SLUGS, SEMA_FAQ_URL } from '../../../utils/constants';
import SnapshotButton from '../snapshotButton';

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
        href={`${SEMA_FAQ_URL}#${SEMA_FAQ_SLUGS.SNAPSHOTS}`}
        target="_blank"
        rel="noreferrer"
        className="is-size-7 is-underlined has-text-primary">
        Learn more about Snapshots.
      </a>
      {hasActionButton && <SnapshotButton onClick={onClick} />}
    </div>
  );
};

SnapshotBar.propTypes = {
  hasActionButton: PropTypes.bool,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default SnapshotBar;
