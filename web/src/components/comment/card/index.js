/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './card.module.scss';
import { DEFAULT_COLLECTION_NAME, PATHS, SEMA_TEAM_ADMIN_NAME } from '../../../utils/constants'
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';
import {EditComments} from "../../../data/permissions";
import usePermission from '../../../hooks/usePermission';

const { triggerAlert } = alertOperations;
const { updateCollectionIsActiveAndFetchCollections, updateCollection, fetchAllUserCollections } = collectionsOperations;

const Tag = ({ tag, _id, type }) => (
  <div
    className={
      clsx(
        'tag is-uppercase is-rounded is-size-8 has-text-weight-semibold mr-5 is-clipped my-5',
        type === 'language' ? 'has-text-primary has-background-primary-light' : 'is-light',
        styles.tag
      )
    }
    key={`${type}-${tag}-${_id}`}>
      <p>{tag}</p>
  </div>
)

const Card = ({ isActive, collectionData, addNewComment }) => {
  const { checkAccess } = usePermission();
  const popupRef = useRef(null);
  const router = useRouter();
  const { token, user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { asPath } = router;

  const { isSemaAdmin, organizations } = user;
  const isEditable = checkAccess({name: SEMA_TEAM_ADMIN_NAME}, EditComments);

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-4 border-radius-8px p-10 is-full-width is-flex is-flex-direction-column is-justify-content-space-between mb-5',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const handleClick = (e) => {
    if (popupRef.current?.contains(e.target)) {
      return;
    }
    setShowMenu(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  if (collectionData) {
    const { _id = '', name = '', description = '', comments = [], commentsCount, author = '', source, guides = [], languages = [], isActive: isNotArchived } = collectionData;
    const onChangeToggle = (e) => {
      e.stopPropagation();
      // TODO: would be great to add error handling here in case of network error
      dispatch(updateCollectionIsActiveAndFetchCollections(_id, token));
    };

    const onClickAddComment = () => {
      if (addNewComment) {
        addNewComment(_id);
      }
    };

    const onClickArchiveCollection = async () => {
      const collection = await dispatch(updateCollection(_id, { collection: { isActive: false } }, token));
      if (collection) {
        dispatch(triggerAlert('Collection archived!', 'success'));
        dispatch(fetchAllUserCollections(token));
        return;
      }
      dispatch(triggerAlert('Unable to archive collection', 'error'));
    }

    const onClickUnarchiveCollection = async () => {
      const collection = await dispatch(updateCollection(_id, { collection: { isActive: true } }, token));
      if (collection) {
        dispatch(triggerAlert('Collection unarchived!', 'success'));
        dispatch(fetchAllUserCollections(token));
        return;
      }
      dispatch(triggerAlert('Unable to unarchived collection', 'error'));
    }

    const isMyComments = name.toLowerCase() === DEFAULT_COLLECTION_NAME || name.toLowerCase() === 'custom snippets';

    return (
      <Link href={`?cid=${_id}`}>
        <div className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', styles.card)} aria-hidden="true">
          <div className="box has-background-white is-full-width p-0 border-radius-2px is-flex is-flex-direction-column">
            <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
              <p className={clsx('has-text-black-2 has-text-weight-semibold is-size-5 pr-10', styles.title)}>{name}</p>
              { asPath === PATHS.SUGGESTED_SNIPPETS._ && isNotArchived ? (
                <div className="field" onClick={onClickChild} aria-hidden>
                  <input
                    id={`activeSwitch-${_id}`}
                    type="checkbox"
                    onChange={onChangeToggle}
                    name={`activeSwitch-${_id}`}
                    className="switch is-rounded"
                    checked={isActive}
                  />
                  <label htmlFor={`activeSwitch-${_id}`} />
                </div>
              ) : <p className="is-size-7 is-italic">archived</p> }
            </div>
            <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
              <div className="px-12 pt-12 has-text-gray-900 is-size-6 mr-20">
                <p className={clsx("is-fullwidth", styles.title)}>{description}</p>
                {!isMyComments && (
                  <div className="mt-10">
                    {source && <p><span className="has-text-weight-semibold">Source:</span> {source}</p>}
                    {author && <p><span className="has-text-weight-semibold">Author:</span> {author}</p>}
                  </div>
                )}
              </div>
              <div className="is-flex is-justify-content-space-between">
                <div className="p-12 is-flex-grow-3 is-flex">
                  <div className={clsx(
                    'has-background-gray-4 border-radius-8px p-10 is-flex is-align-items-center',
                  )}>
                    <p className="is-size-5 has-text-weight-semibold has-text-black mr-8">{commentsCount || comments.length}</p>
                    <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase')}>comments</p>
                  </div>
                </div>
                <div className="is-flex is-align-items-center mr-10 is-flex-grow-1 is-justify-content-flex-end">
                  {isMyComments ? (
                    <div className={clsx('py-12 is-flex is-flex-grow-1 pl-12 pr-12')} onClick={onClickChild} aria-hidden>
                      <div
                        className={clsx('button is-primary is-outlined is-clickable is-fullwidth has-text-weight-semibold',
                          styles['add-button'])}
                        onClick={onClickAddComment}
                        aria-hidden
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-10" />
                        Add a snippet
                      </div>
                    </div>
                  ) : (
                    <div className="is-flex is-flex-grow-1 is-flex-wrap-wrap is-align-items-center is-justify-content-flex-end is-hidden-mobile">
                      {languages.slice(0, 2).map((language) => <Tag tag={language} _id={_id} type="language" />)}
                      {languages.length > 2 && (<Tag tag={`${languages.length-2}+`} _id={_id} type="language" />)}
                      {guides.slice(0, 2).map((guide) => <Tag tag={guide} _id={_id} type="guide" />)}
                      {guides.length > 2 && (<Tag tag={`${guides.length-2}+`} _id={_id} type="guide" />)}
                    </div>
                  )}
                  { isEditable && (
                    <div className={clsx("dropdown is-right", showMenu ? "is-active" : null)} onClick={onClickChild}>
                      <div className="dropdown-trigger">
                        <button className="button is-white" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleMenu}>
                          <FontAwesomeIcon icon={faEllipsisV} color="#0081A7" />
                        </button>
                      </div>
                      <div className="dropdown-menu" id="dropdown-menu" role="menu" ref={popupRef}>
                        <div className="dropdown-content">
                          <a href={`${PATHS.SUGGESTED_SNIPPETS.EDIT}?cid=${_id}`} className="dropdown-item">
                            Edit Collection
                          </a>
                          <div href="/" className="dropdown-item is-clickable" onClick={isNotArchived ? onClickArchiveCollection : onClickUnarchiveCollection}>
                            {isNotArchived ? 'Archive' : 'Unarchive'} Collection
                          </div>
                          {!isSemaAdmin && (
                            <a href="#" className="dropdown-item is-active">
                              Share with Sema Community
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  return null;
};

Card.propTypes = {
  isActive: PropTypes.bool.isRequired,
  collectionData: PropTypes.object.isRequired,
  addNewComment: PropTypes.func.isRequired,
};

export default Card;
