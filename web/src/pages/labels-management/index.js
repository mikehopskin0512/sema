import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import withLayout from '../../components/layout';
import Loader from '../../components/Loader';
import Toaster from '../../components/toaster';
import FilterLabels from '../../components/labels-management/FilterLabels';
import LabelsTable from '../../components/labels-management/LabelsTable';
import LabelsTableRow from '../../components/labels-management/LabelsTableRow';
import Helmet, { LabelsManagementHelmet } from '../../components/utils/Helmet';
import { tagsOperations } from '../../state/features/tags';
import { alertOperations } from '../../state/features/alerts';

const { clearAlert } = alertOperations;
const { fetchTagList } = tagsOperations;

const LabelsManagement = () => {
  const dispatch = useDispatch();
  const { auth, tagsState, alerts } = useSelector((state) => ({
    auth: state.authState,
    tagsState: state.tagsState,
    alerts: state.alertsState,
  }));

  const [filters, setFilters] = useState({
    label: ''
  });
  const [filteredData, setFilteredData] = useState([]);

  const { showAlert, alertType, alertLabel } = alerts;
  const { token } = auth;
  const { tags = [], isFetching } = tagsState;

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

  useEffect(() => {
    setFilteredData(tags.filter((tag) => {
      return tag.label.toLowerCase().includes(filters.label.toLowerCase()) && (
        !filters.languages && !filters.others ? true :
        (filters.languages && tag.type === 'language' || filters.others && tag.type !== 'language')
      )
    }))
  }, [tags, filters]);
  
  return(
    <div className="my-50 px-10">
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
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
      <FilterLabels setFilters={setFilters} filters={filters} />
      { isFetching ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '30vh' }}>
          <Loader />
        </div>
      ) : filteredData.length > 0 ? (
        <LabelsTable
          data={filteredData}
          columns={[{ label: 'Label'}, { label: 'Category', isHiddenMobile: true }, { label: 'Suggested Comments', isHiddenMobile: true }]}
          renderRow={(tag) => <LabelsTableRow data={tag} key={`tag-${tag.label}`} token={token} />}
        />
      ) : (
        <div className="is-flex py-25 is-justify-content-center">
          No tags found!
        </div>
      ) }
    </div>
  )
}

export default withLayout(LabelsManagement);
