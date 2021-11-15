import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AlertFilledIcon, EditIcon } from '../../Icons';
import styles from './actionGroup.module.scss';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { commentsOperations } from '../../../state/features/comments';
import { PATHS } from '../../../utils/constants';

const { bulkUpdateSuggestedComments } = suggestCommentsOperations;
const { getCollectionById } = commentsOperations;

const ActionGroup = ({
  selectedComments,
  handleSelectAllChange,
  archiveComments,
  unarchiveComments,
  collectionId,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));
  const { token } = auth;

  const onUpdate = async (data) => {
    const isActive = !data[0].isActive;

    await dispatch(bulkUpdateSuggestedComments({
      comments: data.map((item) => ({ _id: item._id, isActive })),
    }, token));
    await dispatch(getCollectionById(collectionId, token));
  };

  const goToEditPage = async () => {
    await router.push(`${PATHS.SUGGESTED_SNIPPETS.EDIT}?cid=${collectionId}&comments=${selectedComments}`);
  };

  const onArchive = async () => {
    await onUpdate(unarchiveComments);
  };
  const onUnarchive = async () => {
    await onUpdate(archiveComments);
  };

  return (
    <div className={clsx('has-background-white border-radius-4px p-10 is-flex is-flex-wrap-wrap', styles['filter-container'])}>
      <button
        className="button is-small is-outlined is-primary border-radius-4px mr-20"
        type="button"
        onClick={goToEditPage}
      >
        <EditIcon size="small" />
        <span className="ml-8">
          Edit
        </span>
      </button>
      {
        unarchiveComments.length ? (
          <button
            className="button is-small is-outlined is-danger border-radius-4px mr-20"
            type="button"
            onClick={onArchive}
          >
            <AlertFilledIcon size="small" />
            <span className="ml-8">
              Archive {unarchiveComments.length} Suggested Snippets
            </span>
          </button>
        ) : ''
      }
      {
        archiveComments.length ? (
          <button
            className="button is-small is-outlined is-danger border-radius-4px mr-20"
            type="button"
            onClick={onUnarchive}
          >
            <AlertFilledIcon size="small" />
            <span className="ml-8">
              UnArchive {archiveComments.length} Suggested Snippets
            </span>
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
  selectedComments: PropTypes.array.isRequired,
  handleSelectAllChange: PropTypes.func.isRequired,
  unarchiveComments: PropTypes.array.isRequired,
  archiveComments: PropTypes.array.isRequired,
  collectionId: PropTypes.string.isRequired,
};

export default ActionGroup;
