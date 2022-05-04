import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { format, formatDistanceToNowStrict } from 'date-fns';
import useDebounce from '../../hooks/useDebounce';
import Badge from '../../components/badge/badge';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import withSemaAdmin from '../../components/auth/withSemaAdmin';
import SearchInput from '../../components/admin/searchInput';
import StatusFilter from '../../components/admin/statusFilter';
import Helmet, { UserManagementHelmet } from '../../components/utils/Helmet';

import { usersOperations } from '../../state/features/users';
import { fullName } from '../../utils';
import FilterTabs from '../../components/admin/filterTabs';
import BulkAdmitForm from '../../components/admin/bulkAdmitForm';
import ExportButton from '../../components/admin/exportButton';
import { suggestCommentsOperations } from '../../state/features/suggest-snippets';
import InlineEdit from '../../components/inlineEdit';
import { gray300 } from '../../../styles/_colors.module.scss';

const {
  fetchUsers,
  updateUserAvailableInvitationsCount,
  updateStatus,
  bulkAdmitUsers,
  exportUsers,
  updateUser,
  trackWaitlistAccepted,
} = usersOperations;

const { exportSuggestedComments } = suggestCommentsOperations;

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, analytic, totalCount, isFetching } = useSelector((state) => state.usersState);
  const { token, user } = useSelector((state) => state.authState);

  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);
  const initFilters = {
    Waitlisted: false,
    Registered: false,
    Blocked: false,
    Disabled: false,
  };
  const [statusFilters, setStatusFilters] = useState(initFilters);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    setPage(1);
  }, [debounceSearchTerm, statusFilters]);

  const getUsers = useCallback(() => {
    const statusQuery = Object.entries(statusFilters)
      .filter((item) => item[1])
      .map((item) => item[0]);

    dispatch(fetchUsers({ search: debounceSearchTerm, status: statusQuery, page, perPage }));
  }, [dispatch, debounceSearchTerm, statusFilters, page, perPage]);

  const onExport = useCallback(async () => {
    const statusQuery = Object.entries(statusFilters)
      .filter((item) => item[1])
      .map((item) => item[0]);
    await exportUsers({ search: debounceSearchTerm, status: statusQuery });
  }, [debounceSearchTerm, statusFilters]);

  useEffect(() => {
    getUsers();
  }, [debounceSearchTerm, statusFilters, page, perPage, getUsers]);

  const handleUpdateUserInvitations = useCallback(async (userId, amount) => {
    await dispatch(updateUserAvailableInvitationsCount(userId, amount));
    getUsers();
  }, [dispatch, getUsers]);

  const handleAdmitUser = useCallback(async (userId, email) => {
    await dispatch(updateStatus(userId, {
      key: 'isWaitlist',
      value: false,
    }));
    getUsers();
    trackWaitlistAccepted(userId, { approverUserId: user._id, approverEmail: user.username });
  }, [dispatch, getUsers]);

  const handleBlockOrDisableUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isActive',
      value: false,
    }));
    getUsers();
  }, [dispatch, getUsers]);

  const handleEnableUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isActive',
      value: true,
    }));
    getUsers();
  }, [dispatch, getUsers]);

  const getBadgeColor = (value) => {
    if (value === 'Waitlisted') return 'primary';
    if (value === 'Registered') return 'success';
    if (value === 'Blocked') return 'danger';

    return 'dark';
  };

  const renderActionCell = (userStatus) => {
    const { id, status, email } = userStatus;
    switch (status) {
    case 'Registered':
      return (
        <div className="is-flex">
          <a onClick={() => handleBlockOrDisableUser(id)}>Disable</a>
        </div>
      );
    case 'Waitlisted':
      return (
        <div className="is-flex">
          <a className="mr-5" onClick={() => handleAdmitUser(id, email)}>Admit</a>
          <a onClick={() => handleBlockOrDisableUser(id)}>Block</a>
        </div>
      );
    case 'Disabled':
      return (
        <div className="is-flex">
          <a onClick={() => handleEnableUser(id)}>Enable</a>
        </div>
      );
    case 'Blocked':
      return (
        <div className="is-flex">
          <a onClick={() => handleEnableUser(id)}>Unblock</a>
        </div>
      );
    default:
      return null;
    }
  };

  const handleUpdateUser = (obj, user) => {
    if (!user || !user._id) return;
    const status = Object.entries(statusFilters)
      .filter((item) => item[1])
      .map((item) => item[0]);
    dispatch(updateUser(user._id, obj, { page, perPage, status }));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'userInfo',
        sorted: false,
        Cell: ({ cell: { value } }) => (
          <div className="is-flex is-align-items-center is-cursor-pointer" onClick={() => Router.push(`/sema-admin/users/${value.id}`)}>
            <img src={value.avatarUrl} alt="avatar" width={32} height={32} className="mr-10" style={{ borderRadius: '100%' }} />
            { value.name }
          </div>
        ),
      },
      {
        Header: () => (
          <div className="is-flex">
            <div className="mr-2">Status</div>
            <StatusFilter value={statusFilters} onChange={setStatusFilters} />
          </div>
        ),
        accessor: 'status',
        sorted: false,
        Cell: ({ cell: { value } }) => (
          <Badge
            label={value}
            color={getBadgeColor(value)}
          />
        ),
      },
      {
        Header: 'Active Date',
        accessor: 'activeDate',
        Cell: ({ cell: { value } }) => <div className="has-text-centered">{value}</div>,
      },
      {
        Header: 'Week of signup',
        accessor: 'weekOfSignUp',
      },
      {
        Header: 'Email',
        accessor: 'username',
        sorted: false,
      },
      {
        Header: 'Last Login',
        accessor: 'lastLogin',
        sorted: false,
      },
      {
        Header: 'Company Name',
        accessor: 'companyName',
        sorted: false,
        Cell: ({ cell: { value }, row: { original } }) => (
          <InlineEdit onSave={(companyName) => handleUpdateUser({ companyName }, original)} value={value} />
        ),
      },
      {
        Header: 'Cohort',
        accessor: 'cohort',
        sorted: false,
        Cell: ({ cell: { value }, row: { original } }) => (
          <InlineEdit onSave={(cohort) => handleUpdateUser({ cohort }, original)} value={value} />
        ),
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        sorted: false,
        Cell: ({ cell: { value }, row: { original } }) => (
          <InlineEdit onSave={(notes) => handleUpdateUser({ notes }, original)} value={value} />
        ),
      },
      {
        Header: () => (
          <div className="has-text-centered pt-10" style={{ background: gray300 }}>
            <div>Invite</div>
            <div className="is-flex py-10" style={{ background: gray300 }}>
              <div className="has-text-left px-15 py-0 column">Available</div>
              <div className="has-text-left px-15 py-0 column">Pending</div>
              <div className="has-text-left px-15 py-0 column">Accepted</div>
            </div>
          </div>
        ),
        accessor: 'invites',
        tooltip: 'Sort is based on total invites sent, pending and accepted',
        Cell: ({ cell: { value } }) => (
          <div className="is-flex py-10">
            <div className="is-whitespace-nowrap has-text-left px-15 py-0 column">
              { value.available }
              <button
                type="button"
                className="button is-small ml-5 mr-5 is-size-8 is-line-height-1 is-height-auto px-10 py-5"
                onClick={() => handleUpdateUserInvitations(value.id, 1)}
              >
                +
              </button>
              <button
                type="button"
                className="button is-small ml-5 mr-5 is-size-8 is-line-height-1 is-height-auto px-10 py-5"
                onClick={() => handleUpdateUserInvitations(value.id, -1)}
              >
                -
              </button>
            </div>
            <div className="has-text-left px-15 py-0 column">{ value.pending }</div>
            <div className="has-text-left px-15 py-0 column">{ value.accepted }</div>
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actionStatus',
        Cell: ({ cell: { value } }) => renderActionCell(value),
      },
    ],
    [handleUpdateUser, handleUpdateUserInvitations, renderActionCell, statusFilters],
  );

  const getStatus = (user) => {
    if (user.isActive && user.isWaitlist) return 'Waitlisted';
    if (user.isActive && !user.isWaitlist) return 'Registered';
    if (!user.isActive && user.isWaitlist) return 'Blocked';

    return 'Disabled';
  };

  const getDays = (createdAt) => {
    if (!createdAt) return '';
    const days = formatDistanceToNowStrict(new Date(createdAt), { unit: 'day' });
    return days.replace(/ days?/, '');
  };

  const dataSource = users.map((item) => ({
    ...item,
    userInfo: {
      id: item._id,
      name: fullName(item),
      avatarUrl: item.avatarUrl,
    },
    status: getStatus(item),
    activeDate: (getDays(item.createdAt)),
    invites: {
      available: item.inviteCount,
      pending: item.pendingCount,
      accepted: item.acceptCount,
      id: item._id,
    },
    lastLogin: item.lastLogin ? format(new Date(item.lastLogin), 'yyyy-MM-dd hh:mm:ss') : '',
    weekOfSignUp: item.createdAt ? format(new Date(item.createdAt), 'yyyy.ww', { firstWeekContainsDate: 4, weekStartsOn: 1 }) : '',
    actionStatus: {
      id: item._id,
      status: getStatus(item),
      email: item.username,
    },
    companyName: item.companyName,
    cohort: item.cohort,
    notes: item.notes,
  }));

  const tabOptions = useMemo(() => [
    {
      label: `All (${analytic.total ? analytic.total : 0})`,
      value: 'all',
    },
    {
      label: `Registered Users (${analytic.active ? analytic.active : 0})`,
      value: 'registered',
    },
    {
      label: `On the waitlist (${analytic.waitlist ? analytic.waitlist : 0})`,
      value: 'waitlist',
    },
    {
      label: `Blocked (${analytic.blocked ? analytic.blocked : 0})`,
      value: 'blocked',
    },
    {
      label: `Disabled (${analytic.disabled ? analytic.disabled : 0})`,
      value: 'disabled',
    },
  ], [analytic]);

  const [activeTab, setActiveTab] = useState('all');

  const onChangeTab = (value) => {
    setActiveTab(value);

    switch (value) {
    case 'waitlist':
      setStatusFilters({ ...initFilters, Waitlisted: true });
      break;
    case 'registered':
      setStatusFilters({ ...initFilters, Registered: true });
      break;
    case 'blocked':
      setStatusFilters({ ...initFilters, Blocked: true });
      break;
    case 'disabled':
      setStatusFilters({ ...initFilters, Disabled: true });
      break;
    default:
      setStatusFilters(initFilters);
      break;
    }
  };

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  const onBulkAdmitUsers = async (bulkCount) => {
    await dispatch(bulkAdmitUsers(bulkCount));
    dispatch(fetchUsers({ search: searchTerm }));
  };

  return (
    <>
      <Helmet {...UserManagementHelmet} />
      <div className="is-flex is-justify-content-space-between">
        <div>
          <h1 className="has-text-black has-text-weight-bold is-size-3">User Management</h1>
          <p className="mb-15 is-size-6 text-gray-light">Manage your users at a glance</p>
        </div>
        <BulkAdmitForm onSubmit={onBulkAdmitUsers} />
      </div>
      <div className="p-20 is-flex-grow-1 has-background-white" style={{ borderRadius: 10 }}>
        <div className="is-flex is-justify-content-space-between">
          <FilterTabs tabs={tabOptions} onChange={onChangeTab} value={activeTab} />
          <div className="is-flex">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <div className="ml-10">
              <ExportButton onExport={onExport} />
            </div>
            <div className="ml-10">
              <ExportButton
                label="Export All Snippets"
                onExport={() => exportSuggestedComments({}, token)}
              />
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={dataSource}
          pagination={{
            page,
            perPage,
            totalCount,
            fetchData,
            loading: isFetching,
          }}
        />
      </div>
    </>
  );
};

export default withSemaAdmin(withLayout(UsersPage));
