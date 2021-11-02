import React, { useState, useEffect, useMemo } from 'react';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import withLayout from '../../components/layout';
import Loader from '../../components/Loader';
import Toaster from '../../components/toaster';
import FilterLabels from '../../components/labels-management/FilterLabels';
import LabelsTable from '../../components/labels-management/LabelsTable';
import LabelsTableRow from '../../components/labels-management/LabelsTableRow';
import Helmet, { LabelsManagementHelmet } from '../../components/utils/Helmet';
import { ViewAdmin } from '../../data/permissions';
import usePermission from '../../hooks/usePermission';
import { tagsOperations } from '../../state/features/tags';
import { alertOperations } from '../../state/features/alerts';

const { clearAlert } = alertOperations;
const { fetchTagList } = tagsOperations;

const LabelsManagement = () => {
  const dispatch = useDispatch();
  const { checkAccess } = usePermission();
  const router = useRouter();
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
  const { token, user } = auth;
  const { roles } = user ?? { roles: [] };
  const { tags = [], isFetching } = tagsState;

  const roleTeam = roles.find((role) => {
    const { team } = role;
    // While teams selection is not implemented
    return team?.name === "Sema Super Team";
  });

  const isAuthorized = useMemo(() => checkAccess({name: 'Sema Super Team'}, ViewAdmin) || false, []);

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
    if (!isAuthorized) {
      router.replace('/');
    }
  }, []);
  
  if (!isAuthorized) {
    return(
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '50vh' }}>
        <Loader />
      </div>
    )
  }

  return(
    <div className="my-50 px-10">
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet {...LabelsManagementHelmet} />
      <div className="is-flex is-align-items-center mb-30">
        <Avatar
          name={roleTeam?.team?.name || "Team"}
          src={roleTeam?.team?.avatarUrl}
          size="30"
          round
          textSizeRatio={2.5}
          className="mr-15"
          maxInitials={2}
        />
        <p className="is-size-4 has-text-weight-semibold has-text-deep-black">{roleTeam?.team?.name}</p>
      </div>
      <div className="tabs">
        <ul>
          <li className="is-active"><a href="/labels-management" className="px-0">Label Management</a></li>
        </ul>
      </div>
      <FilterLabels setFilters={setFilters} filters={filters} />
      { isFetching ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '30vh' }}>
          <Loader />
        </div>
      ) : filteredData.length > 0 ? (
        <LabelsTable
          data={filteredData}
          columns={[{ label: 'Label'}, { label: 'Category', isHiddenMobile: true }, { label: 'Suggested Snippets', isHiddenMobile: true }]}
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
