import React, { useCallback, useState } from 'react';
import GrowthRepositoryMetric from '../../components/admin/metrics/growthRepositoryMetric';
import InvitationMetric from '../../components/admin/metrics/invitationMetric';
import SearchQueryMetric from '../../components/admin/metrics/searchQueryMetric';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import Select from '../../components/select';
import SuggestedCommentsMetric from '../../components/admin/metrics/suggestedCommentsMetric';
import ShareOfWalletMetric from '../../components/admin/metrics/shareOfWalletMetric';
import UserActivityMetric from '../../components/admin/metrics/userActivityMetric';

const reportTypes = [
  {
    label: 'Invitation Metrics',
    value: 'invitation',
  },
  {
    label: 'Search Query Metrics',
    value: 'searchTerms',
  },
  {
    label: 'Suggest Comments Metrics',
    value: 'suggestComments',
  },
  {
    label: 'Share Of Wallet',
    value: 'sow',
  },
  {
    label: 'User Activity Change Metrics',
    value: 'userActivity',
  },
  {
    label: 'Growth in repository usage',
    value: 'growthRepository',
  },
];

const ReportsPage = () => {
  const [report, setReport] = useState('invitation');
  const [searchValue, setSearchValue] = useState('');

  const renderContent = () => {
    switch(report) {
      case 'invitation':
        return <InvitationMetric />;
      case 'searchTerms':
        return <SearchQueryMetric />;
      case 'suggestComments':
        return <SuggestedCommentsMetric />;
      case 'sow':
        return <ShareOfWalletMetric />;
      case 'userActivity':
        return <UserActivityMetric />;
      case 'growthRepository':
        return <GrowthRepositoryMetric />;
      default:
        return <div />;
    }
  };

  const getLabel = useCallback(() => {
    const option = reportTypes.find((o) => o.value === report);
    return option ? option.label : '';
  }, [report]);

  return (
    <>
      <h1 className="has-text-black has-text-weight-bold is-size-3">{getLabel()}</h1>
      <p className="mb-15 is-size-6 text-gray-light">Manage your {getLabel().toLowerCase()} at a glance</p>
      <div className="p-20 is-flex-grow-1 has-background-white" style={{ borderRadius: 10 }}>
        <div className="mb-15">
          <Select
            options={reportTypes}
            placeholder="Select Report"
            value={report}
            onChange={setReport}
            searchPlaceholder="Search Metrics"
            searchValue={searchValue}
            onChangeSearchValue={setSearchValue}
          />
        </div>
        { renderContent() }
      </div>
    </>
  );
};

export default withSemaAdmin(withLayout(ReportsPage));
