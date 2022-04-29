import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { collectionsOperations } from '../../../state/features/collections';
import { teamsOperations } from '../../../state/features/teams';
import { PATHS, DEFAULT_COLLECTION_NAME, SEMA_CORPORATE_TEAM_ID, COLLECTION_TYPES } from '../../../utils/constants';
import { PlusIcon } from '../../Icons';
import ActionMenu from '../actionMenu';
import usePermission from '../../../hooks/usePermission';
import { isEmpty } from 'lodash';
import { isSemaDefaultCollection, isTeamDefaultCollection } from "../../../utils";
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import styles from "./commentCollectionsList.module.scss";

const { updateCollectionIsActiveAndFetchCollections } = collectionsOperations;
const { updateTeamCollectionIsActiveAndFetchCollections } = teamsOperations;

const CollectionRow = ({ data }) => {
  const titleRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, selectedTeam } = useSelector((state) => state.authState);
  const { collectionData, isActive } = data ?? {};
  const { _id, name, description, source, author, commentsCount, isActive: isNotArchived, type } = collectionData;
  const { checkAccess, checkTeamPermission } = usePermission();

  const isTeamSnippet = selectedTeam?.team?.name?.toLowerCase() === author?.toLowerCase() || false

  const onChangeToggle = (e) => {
    e.stopPropagation();
    // TODO: would be great to add error handling here in case of network error
    if (!isEmpty(selectedTeam)) {
      dispatch(updateTeamCollectionIsActiveAndFetchCollections(_id, selectedTeam.team?._id, token));
    } else {
      dispatch(updateCollectionIsActiveAndFetchCollections(_id, token));
    }
  };

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const onClickAddComment = (e) => {
    e.stopPropagation();
    router.push(`${PATHS.SNIPPETS.ADD}?cid=${_id}`)
  };

  const canEdit = checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditCollections');
  const canEditSnippets = checkTeamPermission('canEditSnippets') || isSemaDefaultCollection(name) || isTeamDefaultCollection(selectedTeam, { name })
  const isHighlightNeeded = type === COLLECTION_TYPES.PERSONAL || type === COLLECTION_TYPES.TEAM;
  
  return (
    <Link href={`?cid=${_id}`}>
      <tr className="has-background-white my-10 is-clickable">
        <td className="py-15 has-background-white px-10 is-relative" width={80}>
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
        <td className="py-15 has-background-white px-10 is-hidden-mobile">
          <div className="is-flex is-align-items-center is-justify-content-space-between">
            <OverflowTooltip ref={titleRef} text={name}>
              <p ref={titleRef} className={clsx("is-size-7 has-text-weight-semibold has-overflow-ellipsis", styles.title)}>
                {name}
              </p>
            </OverflowTooltip>
            {canEditSnippets && (
              <div
                className={'button is-primary is-outlined is-clickable has-text-weight-semibold is-size-7'}
                onClick={onClickAddComment}
                aria-hidden
              >
                <div className="is-flex is-align-items-center mr-10">
                  <PlusIcon size="small" />
                </div>
                Add a snippet
              </div>
            )}
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile">
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7">
              {description}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
              {source || ''}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
              {author}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold has-text-centered">
              {commentsCount}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
            { isNotArchived ? 'Available' : 'Archived' }
            </p>
          </div>
        </td>
        { canEdit && (
          <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
            <ActionMenu collectionData={collectionData} collectionActive={isActive} />
          </td>
        )}
      </tr>
    </Link>
  );
};

CollectionRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CollectionRow;
