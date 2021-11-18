import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import usePopup from '../../../hooks/usePopup';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { commentsOperations } from '../../../state/features/comments';

const { getCollectionById } = commentsOperations;
const { updateSuggestComment } = suggestCommentsOperations;

const ActionMenu = ({ comment }) => {
  const popupRef = useRef(null);
  const { isOpen, toggleMenu, closeMenu } = usePopup(popupRef);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authState);
  const router = useRouter();
  const { cid: collectionId } = router.query;

  const updateArchiveStatus = async () => {
    closeMenu();
    if (comment && comment._id) {
      await dispatch(updateSuggestComment(comment._id, { isActive: !comment.isActive }, token));
      await dispatch(getCollectionById(collectionId, token));
    }
  };

  return (
    <div>
      <div className={`dropdown is-right ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button is-text is-small outline-none has-background-white"
            type="button"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon color="#0081A7" icon={faEllipsisV} />
          </button>
        </div>
        <div className="dropdown-menu" role="menu" ref={popupRef}>
          <div className="dropdown-content py-10">
            <div className="dropdown-item py-0">
              <button
                type="button"
                className="button is-small is-ghost has-background-white has-text-black outline-none"
                onClick={() => router.push(`/suggested-snippets/edit?cid=${collectionId}&comments=${comment._id}`)}
              >
                Edit Snippet
              </button>
            </div>
            <div className="dropdown-item py-0">
              <button
                type="button"
                className="button is-small is-ghost has-background-white has-text-black outline-none"
                onClick={updateArchiveStatus}
              >
                {`${comment.isActive ? 'Archive' : 'Unarchive' } Comment`}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <AddSuggestedCommentModal onClose={() => setModalOpen(false)} active={modalOpen} comment={comment} _id={collectionId} /> */}
    </div>
  );
};

ActionMenu.propTypes = {
  comment: PropTypes.any.isRequired,
};

export default ActionMenu;
