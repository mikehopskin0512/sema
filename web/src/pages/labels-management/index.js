import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import withLayout from '../../components/layout';
import FilterLabels from '../../components/labels-management/FilterLabels';
import LabelsTable from '../../components/labels-management/LabelsTable';
import Helmet, { LabelsManagementHelmet } from '../../components/utils/Helmet';
import { tagsOperations } from '../../state/features/tags';

const { fetchTagList } = tagsOperations;

const LabelsManagement = () => {
  const dispatch = useDispatch();
  const { auth, tagsState } = useSelector((state) => ({
    auth: state.authState,
    tagsState: state.tagsState,
  }));

  const { token } = auth;
  const { tags } = tagsState;

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, []);
  
  return(
    <div className="my-50">
      <Helmet {...LabelsManagementHelmet} />
      <div className="is-flex is-justify-content-space-between">
        <div>
          <p className="has-text-weight-semibold has-text-deep-black is-size-4">
            Labels Management
          </p>
          <p>View and Edit Labels</p>
        </div>
        <a href="/labels-management/add">
          <button
            className="button is-small is-primary border-radius-4px has-text-semibold"
            type="button">
            <FontAwesomeIcon icon={faPlus} className="mr-10" />
            Add Labels
          </button>
        </a>
      </div>
      <FilterLabels />
      <LabelsTable data={tags} />
    </div>
  )
}

export default withLayout(LabelsManagement);
