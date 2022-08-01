import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { collectionsOperations } from '../../../state/features/collections';
import { organizationsOperations } from '../../../state/features/organizations[new]';
import { COLLECTION_TYPES, DEFAULT_COLLECTION_NAME, PATHS } from '../../../utils/constants';
import { PlusIcon } from '../../Icons';
import ActionMenu from '../actionMenu';
import usePermission from '../../../hooks/usePermission';
import { isEmpty } from 'lodash';
import { isSemaDefaultCollection } from '../../../utils';
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import styles from './commentCollectionsList.module.scss';
import { notify } from '../../../components/toaster/index';
import { MENU_ITEMS_TYPES } from '../../../components/comment/card';

const { updateCollectionIsActiveAndFetchCollections } = collectionsOperations;
const { updateorganizationCollectionIsActiveAndFetchCollections } = organizationsOperations;

const CollectionRow = ({ data }) => {
  const titleRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, selectedOrganization, user } = useSelector((state) => state.authState);
  const { collectionData, isActive } = data ?? {};
  const { _id, name, description, source, author, commentsCount, isActive: isNotArchived, type } = collectionData;
  const {
    checkOrganizationPermission,
    isOrganizationAdmin,
    isOrganizationAdminOrLibraryEditor,
    isSemaAdmin,
    isIndividualUser,
  } = usePermission();
  const isMyComments =
    name.toLowerCase() === DEFAULT_COLLECTION_NAME ||
    name.toLowerCase() === 'custom snippets';


  const isOrganizationSnippet = selectedOrganization?.organization?.name?.toLowerCase() === author?.toLowerCase() || false

  const onChangeToggle = (e) => {
    e.stopPropagation();
    try {
      if (!isEmpty(selectedOrganization)) {
        dispatch(updateorganizationCollectionIsActiveAndFetchCollections(_id, selectedOrganization.organization?._id, token));
      } else {
        dispatch(updateCollectionIsActiveAndFetchCollections(_id, token));
      }
    } catch (err) {
      notify('Organization update failed', { type: 'error', duration: 2500 })
    }
  };

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const onClickAddComment = (e) => {
    e.stopPropagation();
    router.push(`${PATHS.SNIPPETS.ADD}?cid=${_id}`)
  };

  const actionMenuItems = useMemo(() => {
    const isDefaultUserCollection =
      isIndividualUser() &&
      collectionData.author.toLowerCase() === user.username.toLowerCase() &&
      isSemaDefaultCollection(name);
    const isOrganizationSnippet =
      selectedOrganization?.organization?.name?.toLowerCase() ===
      author?.toLowerCase() || false;
    const canArchive = isSemaAdmin();
    const canEdit =
      (isOrganizationAdminOrLibraryEditor() && isOrganizationSnippet) ||
      (isOrganizationAdmin() && isOrganizationSnippet) ||
      isDefaultUserCollection ||
      isSemaAdmin();
    const items = [];
    if (canEdit) {
      items.push(MENU_ITEMS_TYPES.EDIT);
    }
    if (canArchive) {
      items.push(MENU_ITEMS_TYPES.ARCHIVE);
    }
    return items;
  }, [selectedOrganization, collectionData, user]);

  const canEdit = actionMenuItems.includes(MENU_ITEMS_TYPES.EDIT);

  const isAddButtonNeeded = isOrganizationAdminOrLibraryEditor() || isSemaAdmin();

  const canAddSnippets = isMyComments || (isOrganizationSnippet && checkOrganizationPermission('canCreateSnippets') && isAddButtonNeeded)

  const isHighlightNeeded = type === COLLECTION_TYPES.PERSONAL || type === COLLECTION_TYPES.ORGANIZATION;

  return (
    <Link href={`?cid=${_id}`}>
      <tr className="has-background-white my-10 is-clickable is-fullwidth">
        <td className="py-15 has-background-white px-10 is-relative" width={67}>
          {isHighlightNeeded && <div className={clsx('has-background-orange-300 is-absolute', styles['collection-highlight'])}/>}
          <div className="is-flex is-flex-direction-column is-justify-content-center">
          <div className="field" aria-hidden onClick={onClickChild}>
            <input
              id={`activeSwitch-${_id}`}
              type="checkbox"
              onChange={onChangeToggle}
              name={`activeSwitch-${_id}`}
              className={clsx('switch is-rounded', isHighlightNeeded && 'is-orange-300')}
              checked={isActive}
              disabled={!isNotArchived}
            />
            <label htmlFor={`activeSwitch-${_id}`} />
          </div>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile m-0" width={"27%"}>
          <div className={clsx("is-flex is-align-items-center is-justify-content-space-between m-0", styles.title)}>
            <OverflowTooltip ref={titleRef} text={name}>
              <p ref={titleRef} className={clsx("is-size-7 has-text-weight-semibold has-overflow-ellipsis m-0", styles.titleText)}>
                {name}
              </p>
            </OverflowTooltip>
            {canAddSnippets && (
              <div
                className={'button is-primary is-outlined is-clickable has-text-weight-semibold is-size-7'}
                onClick={onClickAddComment}
                aria-hidden
              >
                <div className="is-flex is-align-items-center mr-10">
                  <PlusIcon size="small" />
                </div>
                New Snippet
              </div>
            )}
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={327}>
          <div className="is-flex is-flex-direction-column is-justify-content-center is-fullwidth">
            <p className={clsx("is-size-7", styles.description)}>
              {description}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" style={{minWidth: '110px'}}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
              {source || ''}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile has-overflow-ellipsis" width={217} style={{minWidth: '217px'}}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold" style={{maxWidth: "100%"}}>
              {author}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={"9%"}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-centered has-text-weight-semibold">
              {commentsCount}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={canEdit ? "8%" : "15%"}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
            { isNotArchived ? 'Available' : 'Archived' }
            </p>
          </div>
        </td>
        <td className='py-15 has-background-white px-10 is-hidden-mobile' width={'10%'}>
          {canEdit && (
            <ActionMenu collectionData={collectionData} collectionActive={isActive} />
          )}
        </td>
      </tr>
    </Link>
  );
};

CollectionRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CollectionRow;
