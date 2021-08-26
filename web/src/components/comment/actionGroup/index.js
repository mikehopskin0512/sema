import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from './actionGroup.module.scss';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';
import { commentsOperations } from '../../../state/features/comments';
import ArchiveModal from '../../archiveModal';

const { bulkUpdateSuggestedComments } = suggestCommentsOperations;
const { getCollectionById } = commentsOperations;

const ActionGroup = ({ selectedComments, handleSelectAllChange, archiveComments, unarchiveComments }) => {
  const router = useRouter();
  const { collectionId } = router.query;
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));
  const { token } = auth;
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const onUpdate = async (data) => {
    const isActive = !data[0].isActive;

    await dispatch(bulkUpdateSuggestedComments({
      comments: data.map((item) => ({ _id: item._id, isActive })),
    }, token));
    await dispatch(getCollectionById(collectionId, token));
  };

  const goToEditPage = async () => {
    await router.push(`/collections/${collectionId}/edit?comments=${selectedComments}`);
  };

  const onArchive = () => {
    setIsOpen(true);
    setComments(unarchiveComments);
  };
  const onUnarchive = () => {
    setIsOpen(true);
    setComments(archiveComments);
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
        unarchiveComments.length ? (
          <button
            className="button is-small is-outlined is-danger border-radius-4px mr-20"
            type="button"
            onClick={onArchive}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-10" />
            Archive {unarchiveComments.length} Suggested Comments
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
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-10" />
            UnArchive {archiveComments.length} Suggested Comments
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
      <ArchiveModal
        onClose={() => setIsOpen(false)}
        active={isOpen}
        message="Suggested Comments"
        data={comments}
        onSubmit={onUpdate}
      />
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
};

export default ActionGroup;
