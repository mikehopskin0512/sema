import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { OptionsIcon } from '../../Icons';
import { PATHS } from '../../../utils/constants';
import { collectionsOperations } from '../../../state/features/collections';
import { alertOperations } from '../../../state/features/alerts';
import { isSemaDefaultCollection } from '../../../utils';
import useOutsideClick from '../../../utils/useOutsideClick';
import usePopup from "../../../hooks/usePopup";
import { fetchTeamCollections } from '../../../state/features/teams/actions';
import { updateOrganizationCollectionIsActiveAndFetchCollections } from '../../../state/features/teams/operations';

const { triggerAlert } = alertOperations;
const { updateCollection, fetchAllUserCollections } = collectionsOperations;

const ActionMenu = ({ collectionData, collectionActive }) => {
  const popupRef = useRef(null);
  const { isOpen, toggleMenu, closeMenu } = usePopup(popupRef);
  const dispatch = useDispatch();
  const { _id = '', isActive, name } = collectionData || {};
  const { token, selectedTeam } = useSelector((state) => state.authState);

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const toggleArchiveCollection = async (activeStatus) => {
    try {
      await dispatch(updateCollection(_id, { collection: { isActive: activeStatus } }, token));
      if(collectionActive) {
        dispatch(updateOrganizationCollectionIsActiveAndFetchCollections(_id, selectedTeam.team?._id, token));
      }
      dispatch(triggerAlert(activeStatus ? 'Collection unarchived!' : 'Collection archived!', 'success'));
      dispatch(fetchAllUserCollections(token));
      dispatch(fetchTeamCollections(selectedTeam?.team?._id, token));
    } catch (error) {
      dispatch(triggerAlert(activeStatus ? 'Unable to unarchived collection' : 'Unable to archive collection', 'error'));
    }
  };

  useOutsideClick(popupRef, () => {
    if (isOpen) closeMenu();
  });

  return (
    <div className={clsx('dropdown is-right', isOpen ? 'is-active' : '')} onClick={onClickChild} ref={popupRef}>
      <div className="dropdown-trigger">
        <button className="button is-text" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleMenu}>
          <OptionsIcon />
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <a href={`${PATHS.SNIPPETS.EDIT}?cid=${_id}`} className="dropdown-item">
            Edit Collection
          </a>
          {
            !isSemaDefaultCollection(name) && (
              <div className="dropdown-item is-clickable" onClick={() => toggleArchiveCollection(!isActive)}>
                {isActive ? 'Archive' : 'Unarchive'} Collection
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;
