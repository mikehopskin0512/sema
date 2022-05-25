import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import LabelsTable from '../../labels-management/LabelsTable';
import LabelsTableRow from '../../labels-management/LabelsTableRow';
import Helmet, { LabelsManagementHelmet } from '../../utils/Helmet';
import Loader from '../../Loader';
import Toaster from '../../toaster';
import FilterLabels from '../../labels-management/FilterLabels';
import usePermission from '../../../hooks/usePermission';
import { tagsOperations } from '../../../state/features/tags';
import { alertOperations } from '../../../state/features/alerts';
import { SEMA_CORPORATE_ORGANIZATION_ID } from '../../../utils/constants';

const { clearAlert } = alertOperations;
const { fetchTagList } = tagsOperations;

const LabelsManagement = ({ activeTeam }) => {
  const dispatch = useDispatch();
  const { isTeamAdminOrLibraryEditor } = usePermission();
  const router = useRouter();
  const teamId = activeTeam?._id;
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
  const isAuthorized = useMemo(() => isTeamAdminOrLibraryEditor());

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

  useEffect(() => {
    if (activeTeam && !isAuthorized) {
      router.replace('/');
    }
  }, [activeTeam]);

  if (!isAuthorized) {
    return(
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '50vh' }}>
        <Loader />
      </div>
    )
  }

  return(
    <div className="px-10">
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet {...LabelsManagementHelmet} />
      <FilterLabels setFilters={setFilters} filters={filters} teamId={teamId} />
      { isFetching ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '30vh' }}>
          <Loader />
        </div>
      ) : filteredData.length > 0 ? (
        <LabelsTable
          data={filteredData}
          columns={[{ label: 'Label'}, { label: 'Category', isHiddenMobile: true }, { label: 'Snippets', isHiddenMobile: true }]}
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

export default LabelsManagement;
