/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './card.module.scss';
import {
  COLLECTION_TYPES,
  DEFAULT_COLLECTION_NAME,
  PATHS,
  SEMA_CORPORATE_ORGANIZATION_ID,
} from '../../../utils/constants';
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';
import usePermission from '../../../hooks/usePermission';
import {
  PlusIcon,
  CommentsIcon,
  OptionsIcon,
  TeamIcon,
} from '../../../components/Icons';
import { isSemaDefaultCollection } from '../../../utils';
import { isEmpty } from 'lodash';
import { updateOrganizationCollectionIsActiveAndFetchCollections } from '../../../state/features/organizations[new]/operations';
import { fetchOrganizationCollections } from '../../../state/features/organizations[new]/actions';
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import { orange600 } from '../../../../styles/_colors.module.scss';

const { triggerAlert } = alertOperations;
const {
  updateCollectionIsActiveAndFetchCollections,
  updateCollection,
  fetchAllUserCollections,
} = collectionsOperations;

export const MENU_ITEMS_TYPES = {
  EDIT: 'edit',
  ARCHIVE: 'archive',
};

const Card = ({ isActive, collectionData, addNewComment, type }) => {
  const {
    isOrganizationAdmin,
    isOrganizationAdminOrLibraryEditor,
    isSemaAdmin,
    isIndividualUser,
    checkOrganizationPermission,
  } = usePermission();
  const popupRef = useRef(null);
  const router = useRouter();
  const { token, user, selectedOrganization } = useSelector(
    (state) => state.authState
  );
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { asPath } = router;

  const renderStats = (label, value) => (
    <div
      className={clsx(
        'has-background-gray-200 border-radius-8px p-10 is-full-width is-flex is-flex-direction-column is-justify-content-space-between mb-5'
      )}
    >
      <p
        className={clsx(
          'is-size-8 has-text-weight-semibold has-text-gray-700 is-uppercase'
        )}
      >
        {label}
      </p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">
        {value}
      </p>
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
    const {
      _id = '',
      name = '',
      description = '',
      comments = [],
      commentsCount,
      author = '',
      source,
      guides = [],
      languages = [],
      isActive: isNotArchived,
    } = collectionData;

    const isOrganizationSnippet =
      selectedOrganization?.organization?.name?.toLowerCase() ===
        author?.toLowerCase() || false;
    const isAddButtonNeeded =
      isOrganizationAdminOrLibraryEditor() || isSemaAdmin();

    const onChangeToggle = (e) => {
      e.stopPropagation();
      // TODO: would be great to add error handling here in case of network error
      if (!isEmpty(selectedOrganization)) {
        dispatch(
          updateOrganizationCollectionIsActiveAndFetchCollections(
            _id,
            selectedOrganization.organization?._id,
            token
          )
        );
      } else {
        dispatch(updateCollectionIsActiveAndFetchCollections(_id, token));
      }
    };

    const onClickAddComment = () => {
      router.push(`${PATHS.SNIPPETS.ADD}?cid=${_id}`);
    };

    const onClickArchiveCollection = async () => {
      try {
        await dispatch(
          updateCollection(_id, { collection: { isActive: false } }, token)
        );
        if (isActive) {
          dispatch(
            updateOrganizationCollectionIsActiveAndFetchCollections(
              _id,
              selectedOrganization.organization?._id,
              token
            )
          );
        }
        dispatch(triggerAlert('Collection archived!', 'success'));
        dispatch(fetchAllUserCollections(token));
        dispatch(
          fetchOrganizationCollections(
            selectedOrganization?.organization?._id,
            token
          )
        );
      } catch (error) {
        dispatch(triggerAlert('Unable to archive collection', 'error'));
      }
    };

    const onClickUnarchiveCollection = async () => {
      const collection = await dispatch(
        updateCollection(_id, { collection: { isActive: true } }, token)
      );
      if (collection) {
        dispatch(triggerAlert('Collection unarchived!', 'success'));
        dispatch(fetchAllUserCollections(token));
        dispatch(
          fetchOrganizationCollections(
            selectedOrganization?.organization?._id,
            token
          )
        );
        return;
      }
      dispatch(triggerAlert('Unable to unarchived collection', 'error'));
    };

    const isMyComments =
      name.toLowerCase() === DEFAULT_COLLECTION_NAME ||
      name.toLowerCase() === 'custom snippets';
    const isOrganizationIconNeeded =
      collectionData.type === COLLECTION_TYPES.ORGANIZATION;
    const isHighlightNeeded =
      collectionData.type === COLLECTION_TYPES.PERSONAL ||
      isOrganizationIconNeeded;

    const menuItems = useMemo(() => {
      const isOrganizationSnippet =
        selectedOrganization?.organization?.name?.toLowerCase() ===
          author?.toLowerCase() || false;
      const isDefaultUserCollection =
        isIndividualUser() &&
        collectionData.author.toLowerCase() === user.username.toLowerCase() &&
        isSemaDefaultCollection(name);
      const canEdit =
        (isOrganizationAdminOrLibraryEditor() && isOrganizationSnippet) ||
        (isOrganizationAdmin() && isOrganizationSnippet) ||
        isDefaultUserCollection ||
        isSemaAdmin();
      const canArchive = isSemaAdmin();
      const items = [];
      if (canEdit) {
        items.push(MENU_ITEMS_TYPES.EDIT);
      }
      if (canArchive) {
        items.push(MENU_ITEMS_TYPES.ARCHIVE);
      }
      return items;
    }, [selectedOrganization, collectionData, user]);

    return (
      <Link href={`?cid=${_id}`}>
        <div
          className={clsx('p-10 is-flex is-clickable', styles.card)}
          aria-hidden="true"
        >
          <div className="box has-background-white is-full-width p-0 border-radius-2px is-flex is-flex-direction-column">
            <div
              className={clsx(
                'is-full-width',
                styles['card-bar'],
                isHighlightNeeded
                  ? 'has-background-orange-300'
                  : type === 'active'
                  ? 'has-background-primary'
                  : 'has-background-gray-400'
              )}
            />
            <div className="is-flex is-justify-content-space-between px-25 pb-10 pt-20 is-align-items-center">
              {isOrganizationIconNeeded && (
                <div
                  className={clsx(
                    'is-circular has-background-orange-50 is-flex is-align-items-center is-justify-content-center',
                    styles['organization-icon-container']
                  )}
                >
                  <TeamIcon color={orange600} size="small" />
                </div>
              )}
              <OverflowTooltip
                text={name}
                typographyStyle={clsx(
                  'has-text-black-900 has-text-weight-semibold is-size-5 pr-10',
                  styles.title
                )}
              />
              {asPath === PATHS.SNIPPETS._ && (
                <div className="field" onClick={onClickChild} aria-hidden>
                  <input
                    id={`activeSwitch-${_id}`}
                    type="checkbox"
                    onChange={onChangeToggle}
                    name={`activeSwitch-${_id}`}
                    className={clsx(
                      'switch is-rounded',
                      isHighlightNeeded && 'is-orange-300'
                    )}
                    checked={isActive}
                    disabled={!isNotArchived}
                  />
                  <label htmlFor={`activeSwitch-${_id}`} />
                </div>
              )}
            </div>
            <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
              <div className="px-25 pb-15 has-text-gray-900 is-size-6 mr-20">
                <p className={clsx('is-fullwidth', styles.title)}>
                  {description}
                </p>
                {/* {!isMyComments && (
                  <div className="mt-10">
                    {source && <p><span className="has-text-weight-semibold">Source:</span> {source}</p>}
                    {author && <p><span className="has-text-weight-semibold">Author:</span> {author}</p>}
                  </div>
                )} */}
              </div>
              <div
                className={`is-flex is-justify-content-space-between is-align-items-center has-background-gray-300 ${
                  styles['card-bottom-section']
                } ${
                  (isMyComments || isOrganizationSnippet) && 'is-flex-wrap-wrap'
                }`}
              >
                <div
                  className={clsx(
                    'border-radius-8px p-10 is-flex is-align-items-center'
                  )}
                >
                  <div className="mr-10 is-flex is-align-items-center mr-10">
                    <CommentsIcon color="has-text-black-900" size="small" />
                  </div>
                  <p className="is-size-7 has-text-weight-semibold mr-8 has-text-blue-500">
                    {commentsCount || comments.length}
                  </p>
                  <p
                    className={clsx(
                      'is-size-7 has-text-weight-semibold has-text-blue-500'
                    )}
                  >
                    snippets
                  </p>
                </div>
                <div className="is-flex is-align-items-center">
                  {(isMyComments ||
                    (isOrganizationSnippet &&
                      checkOrganizationPermission('canCreateSnippets') &&
                      isAddButtonNeeded)) && (
                    <div
                      className={clsx(
                        'py-12 is-flex is-flex-grow-1 pl-12 pr-12'
                      )}
                      onClick={onClickChild}
                      aria-hidden
                    >
                      <div
                        className={clsx(
                          'button has-text-primary has-background-white-0 is-outlined is-clickable is-fullwidth has-text-weight-semibold',
                          styles['add-button']
                        )}
                        onClick={onClickAddComment}
                        aria-hidden
                      >
                        <div className="mr-10 is-flex is-align-items-center">
                          <PlusIcon />
                        </div>
                        New Snippet
                      </div>
                    </div>
                  )}
                  {asPath === PATHS.SNIPPETS._ && !isNotArchived && (
                    <div className="is-italic pr-24">Archived</div>
                  )}
                  <div
                    className={clsx(
                      'dropdown is-right',
                      showMenu ? 'is-active' : null
                    )}
                    onClick={onClickChild}
                  >
                    {Boolean(menuItems.length) && (
                      <div className="dropdown-trigger">
                        <button
                          className="button is-ghost has-text-black-900 pl-0"
                          aria-haspopup="true"
                          aria-controls="dropdown-menu"
                          onClick={toggleMenu}
                        >
                          <OptionsIcon />
                        </button>
                      </div>
                    )}
                    <div
                      className="dropdown-menu"
                      id="dropdown-menu"
                      role="menu"
                      ref={popupRef}
                    >
                      <div className="dropdown-content">
                        {menuItems.includes(MENU_ITEMS_TYPES.EDIT) && (
                          <a
                            href={`${PATHS.SNIPPETS.EDIT}?cid=${_id}`}
                            className="dropdown-item"
                          >
                            Edit Collection
                          </a>
                        )}
                        {menuItems.includes(MENU_ITEMS_TYPES.ARCHIVE) && (
                          <a
                            className="dropdown-item is-clickable"
                            onClick={
                              isNotArchived
                                ? onClickArchiveCollection
                                : onClickUnarchiveCollection
                            }
                          >
                            {isNotArchived ? 'Archive' : 'Unarchive'} Collection
                          </a>
                        )}
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
