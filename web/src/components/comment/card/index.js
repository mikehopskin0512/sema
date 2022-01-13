/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './card.module.scss';
import { DEFAULT_COLLECTION_NAME, PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants'
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';
import { teamsOperations } from '../../../state/features/teams';
import usePermission from '../../../hooks/usePermission';
import { PlusIcon, CommentsIcon, OptionsIcon } from '../../../components/Icons';
import { isSemaDefaultCollection } from '../../../utils';
import { isEmpty } from 'lodash';

const { triggerAlert } = alertOperations;
const { updateCollectionIsActiveAndFetchCollections, updateCollection, fetchAllUserCollections } = collectionsOperations;
const { updateTeamCollectionIsActiveAndFetchCollections } = teamsOperations;

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

const Card = ({ isActive, collectionData, addNewComment, type }) => {
  const { checkAccess } = usePermission();
  const popupRef = useRef(null);
  const router = useRouter();
  const { token, user, selectedTeam } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { asPath } = router;

  const canEdit = checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditCollections');

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-200 border-radius-8px p-10 is-full-width is-flex is-flex-direction-column is-justify-content-space-between mb-5',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-gray-700 is-uppercase')}>{label}</p>
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

    const isTeamSnippet = selectedTeam?.team?.name?.toLowerCase() === author?.toLowerCase() || false

    const onChangeToggle = (e) => {
      e.stopPropagation();
      // TODO: would be great to add error handling here in case of network error
      if (!isEmpty(selectedTeam)) {
        dispatch(updateTeamCollectionIsActiveAndFetchCollections(selectedTeam.team, _id, token))
      } else {
        dispatch(updateCollectionIsActiveAndFetchCollections(_id, token));
      }
    };

    const onClickAddComment = () => {
      router.push(`${PATHS.SNIPPETS.ADD}?cid=${_id}`)
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
            <div className={clsx('is-full-width', styles['card-bar'], type === 'active' ? 'has-background-primary' : 'has-background-gray-400')} />
            <div className="is-flex is-justify-content-space-between px-25 pb-10 pt-20 is-align-items-center">
              <p className={clsx('has-text-black-900 has-text-weight-semibold is-size-5 pr-10', styles.title)}>{name}</p>
              {asPath === PATHS.SNIPPETS._ && isNotArchived ? (
                <div className="field sema-toggle" onClick={onClickChild} aria-hidden>
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
              ) : <p className="is-size-7 is-italic">archived</p>}
            </div>
            <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
              <div className="px-25 pb-15 has-text-gray-900 is-size-6 mr-20">
                <p className={clsx("is-fullwidth", styles.title)}>{description}</p>
                {/* {!isMyComments && (
                  <div className="mt-10">
                    {source && <p><span className="has-text-weight-semibold">Source:</span> {source}</p>}
                    {author && <p><span className="has-text-weight-semibold">Author:</span> {author}</p>}
                  </div>
                )} */}
              </div>
              <div className="is-flex is-justify-content-space-between has-background-gray-300">
                <div className="px-12 is-flex-grow-3 is-flex">
                  <div className={clsx(
                    'border-radius-8px p-10 is-flex is-align-items-center',
                  )}>
                    <div className="mr-10 is-flex is-align-items-center mr-10">
                      <CommentsIcon color='has-text-black-900' size='small' />
                    </div>
                    <p className="is-size-7 has-text-weight-semibold mr-8 has-text-blue-500">{commentsCount || comments.length}</p>
                    <p className={clsx('is-size-7 has-text-weight-semibold has-text-blue-500')}>snippets</p>
                  </div>

                </div>
                <div className="is-flex is-align-items-center mr-10 is-flex-grow-1 is-justify-content-flex-end">
                  {isMyComments || isTeamSnippet ? (
                    <div className={clsx('py-12 is-flex is-flex-grow-1 pl-12 pr-12')} onClick={onClickChild} aria-hidden>
                      <div
                        className={clsx('button has-text-primary has-background-white-0 is-outlined is-clickable is-fullwidth has-text-weight-semibold',
                          styles['add-button'])}
                        onClick={onClickAddComment}
                        aria-hidden
                      >
                        <div className="mr-10 is-flex is-align-items-center">
                          <PlusIcon />
                        </div>
                        New Snippet
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={clsx('py-12 is-flex is-flex-grow-1 pl-12 pr-12')} onClick={onClickChild} aria-hidden>
                        <div
                          className={clsx('button has-text-gray-300 is-ghost is-clickable is-fullwidth has-text-weight-semibold',
                            styles['add-button'])}
                          onClick={onClickAddComment}
                          aria-hidden
                        >
                          {/* This is a HACK, in order for it to be responsive together with the `my snippets` card */}
                          <div className="mr-10 is-flex is-align-items-center">
                            <PlusIcon />
                          </div>
                          New Snippet
                        </div>
                      </div>
                      {/* TODO: In case this would be need in the future, this is the tags of the card (langauges). */}
                      {/* <div className="is-flex is-flex-grow-1 is-flex-wrap-wrap is-align-items-center is-justify-content-flex-end is-hidden-mobile">
                        {languages.slice(0, 2).map((language) => <Tag tag={language} _id={_id} type="language" />)}
                        {languages.length > 2 && (<Tag tag={`${languages.length-2}+`} _id={_id} type="language" />)}
                        {guides.slice(0, 2).map((guide) => <Tag tag={guide} _id={_id} type="guide" />)}
                        {guides.length > 2 && (<Tag tag={`${guides.length-2}+`} _id={_id} type="guide" />)}
                      </div> */}
                    </>
                  )}
                  <div className={clsx("dropdown is-right", showMenu ? "is-active" : null)} onClick={onClickChild}>
                    <div className="dropdown-trigger">
                      <button className="button is-ghost has-text-black-900" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleMenu}>
                        <OptionsIcon />
                      </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu" ref={popupRef}>
                      <div className="dropdown-content">
                        {
                          canEdit && (
                            <>
                              <a href={`${PATHS.SNIPPETS.EDIT}?cid=${_id}`} className="dropdown-item">
                                Edit Collection
                              </a>
                              {
                                !isSemaDefaultCollection(name) && (
                                  <a className="dropdown-item is-clickable" onClick={isNotArchived ? onClickArchiveCollection : onClickUnarchiveCollection}>
                                    {isNotArchived ? 'Archive' : 'Unarchive'} Collection
                                  </a>
                                )
                              }
                            </>
                          )
                        }
                        <a href="#" className="dropdown-item is-active">
                          Share with Sema Community
                        </a>
                      </div>
                    </div>
                  </div>
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

