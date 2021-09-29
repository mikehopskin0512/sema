import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from './actionGroup.module.scss';
import { engGuidesOperations } from '../../../state/features/engGuides';

const { bulkUpdateEngGuides, getEngGuides } = engGuidesOperations;

const ActionGroup = ({
  selectedGuides, handleSelectAllChange, archiveGuides, unarchiveGuides, collectionId,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));
  const { token } = auth;

  const onUpdate = async (data) => {
    const isActive = !data[0].isActive;

    await dispatch(bulkUpdateEngGuides({
      engGuides: data.map((item) => ({ _id: item._id, isActive })),
    }, token));
    await dispatch(getEngGuides(token));
  };

  const goToEditPage = async () => {
    await router.push(`/guides/edit?cid=${collectionId}&guides=${selectedGuides}`);
  };

  const onArchive = async () => {
    await onUpdate(unarchiveGuides);
  };
  const onUnarchive = async () => {
    await onUpdate(archiveGuides);
  };

  return (
    <div className={clsx('has-background-white border-radius-4px p-10 is-flex is-flex-wrap-wrap', styles['filter-container'])}>
      <button
        className="button is-small is-outlined is-primary border-radius-4px mr-20"
        type="button"
        onClick={goToEditPage}
      >
        <FontAwesomeIcon icon={faEdit} className="mr-10" />
        Edit
      </button>
      {
        unarchiveGuides.length ? (
          <button
            className="button is-small is-outlined is-danger border-radius-4px mr-20"
            type="button"
            onClick={onArchive}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-10" />
            Archive {unarchiveGuides.length} Community Guides
          </button>
        ) : ''
      }
      {
        archiveGuides.length ? (
          <button
            className="button is-small is-outlined is-danger border-radius-4px mr-20"
            type="button"
            onClick={onUnarchive}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-10" />
            UnArchive {archiveGuides.length} Community Guides
          </button>
        ) : ''
      }
      <button
        className="button is-small is-outlined is-primary border-radius-4px"
        type="button"
        onClick={() => handleSelectAllChange(false)}
      >
        Undo selection
      </button>
    </div>
  );
};

ActionGroup.defaultProps = {
};

ActionGroup.propTypes = {
  selectedGuides: PropTypes.array.isRequired,
  handleSelectAllChange: PropTypes.func.isRequired,
  unarchiveGuides: PropTypes.array.isRequired,
  archiveGuides: PropTypes.array.isRequired,
  collectionId: PropTypes.string.isRequired,
};

export default ActionGroup;
