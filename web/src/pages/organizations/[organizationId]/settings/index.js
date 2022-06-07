import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { OrganizationDashboardHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import PageHeader from '../../../../components/pageHeader';
import { organizationsOperations } from '../../../../state/features/organizations[new]';
import LabelsManagement from '../../../../components/organization/LabelsManagement';
import OrganizationManagement from '../../../../components/organization/OrganizationManagement';
import usePermission from '../../../../hooks/usePermission';
import {PATHS, TAB} from '../../../../utils/constants';
import { TagIcon, TeamIcon } from '../../../../components/Icons';

const { fetchOrganizationMembers } = organizationsOperations;

const OrganizationSettings = () => {
  const dispatch = useDispatch();
  const { isOrganizationAdminOrLibraryEditor, isSemaAdmin } = usePermission();
  const router = useRouter();
  const {
    query: { organizationId, tab },
  } = router;

  const { auth, organizations } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsNewState
    }),
  );
  const { token } = auth;
  const [activeOrganization, setActiveOrganization] = useState({});

  useEffect(() => {
    dispatch(fetchOrganizationMembers(organizationId, {}, token));
  }, [organizationId]);

  const setDefaultTag = () => {
    router.push({
      pathname: PATHS.ORGANIZATIONS.SETTINGS(organizationId),
      query: { tab: TAB.management },
    });
  };

  useEffect(() => {
    if (organizations.organizations.length) {
      const organization = organizations.organizations.find(({ organization }) => {
        return (organization?.url === organizationId) || (organization?._id === organizationId)
      });
      if (organization) {
        setActiveOrganization(organization);
      }
    }
  }, [organizations, organizationId]);

  useEffect(() => {
    !tab && setDefaultTag();
  }, []);

  const menus = [
    (isOrganizationAdminOrLibraryEditor() && {
      label: 'Organization Management',
      path: PATHS.ORGANIZATIONS.MANAGEMENT(organizationId),
      id: TAB.management,
      icon: <TeamIcon width={20} />,
    }),
    (isSemaAdmin() && {
      label: 'Labels Management',
      path: PATHS.ORGANIZATIONS.LABELS(organizationId),
      id: TAB.labels,
      icon: <TagIcon />,
    }),
  ];

  useEffect(() => {
    if (!isSemaAdmin() && tab === 'labels') {
      setDefaultTag()
    }
  }, [tab])

  return (
    <>
      <div className="has-background-white">
        <div className="container pt-40">
          <Helmet {...OrganizationDashboardHelmet} />
          <PageHeader menus={menus} userRole={activeOrganization} />
        </div>
      </div>
      <div className="container">
        <div className="has-background-white-50">
          <div className="hero-body pt-0 pb-100 px-0">
            {tab === 'management' && <OrganizationManagement activeOrganization={activeOrganization}/>}
            {tab === 'labels' && <LabelsManagement activeOrganization={activeOrganization}/>}
          </div>
        </div>
      </div>
    </>
  )
}

export default withLayout(OrganizationSettings);
