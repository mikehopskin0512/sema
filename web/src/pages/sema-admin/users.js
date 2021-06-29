import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNowStrict } from 'date-fns';
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

const { fetchUsers, updateUserAvailableInvitationsCount, updateStatus, bulkAdmitUsers } = usersOperations;

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, analytic, totalCount, isFetching } = useSelector((state) => state.usersState);

  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);
  const initFilters = {
    Waitlisted: false,
    Active: false,
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
  }, [dispatch, fetchUsers, debounceSearchTerm, statusFilters, page, perPage]);

  useEffect(() => {
    getUsers();
  }, [debounceSearchTerm, statusFilters, page, perPage]);

  const handleUpdateUserInvitations = useCallback(async (userId, amount) => {
    await dispatch(updateUserAvailableInvitationsCount(userId, amount));
    getUsers();
  }, [dispatch, updateUserAvailableInvitationsCount, getUsers]);

  const handleAdmitUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isWaitlist',
      value: false,
    }));
    getUsers();
  }, [dispatch, updateStatus, getUsers]);

  const handleBlockOrDisableUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isActive',
      value: false,
    }));
    getUsers();
  }, [dispatch, updateStatus, getUsers]);

  const handleEnableUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isActive',
      value: true,
    }));
    getUsers();
  }, [dispatch, updateStatus, getUsers]);

  const getBadgeColor = (value) => {
    if (value === 'Waitlisted') return 'primary';
    if (value === 'Active') return 'success';
    if (value === 'Blocked') return 'danger';

    return 'dark';
  };

  const renderActionCell = (userStatus) => {
    const { id, status } = userStatus;
    switch (status) {
      case 'Active':
        return (
          <div className="is-flex">
            <a onClick={() => handleBlockOrDisableUser(id)}>Disable</a>
          </div>
        );
      case 'Waitlisted':
        return (
          <div className="is-flex">
            <a className="mr-5" onClick={() => handleAdmitUser(id)}>Admit</a>
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

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'userInfo',
        sorted: false,
        Cell: ({ cell: { value } }) => (
          <div className='is-flex is-align-items-center is-cursor-pointer' onClick={() => Router.push(`/sema-admin/users/${value.id}`)}>
            <img src={value.avatarUrl} alt="avatar" width={32} height={32} className='mr-10' style={{ borderRadius: '100%' }}/>
            { value.name }
          </div>
        ),
      },
      {
        Header: () => (
          <div className='is-flex'>
            <div className='mr-2'>Status</div>
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
        className: 'has-text-centered mr-10',
        accessor: 'activeDate',
        Cell: ({ cell: { value } }) => <div className="has-text-centered">{value}</div>,
      },
      {
        Header: 'Email',
        accessor: 'username',
        sorted: false,
      },
      {
        Header: () => (
          <div className='has-text-centered pt-10' style={{ background: '#E9E1F0' }}>
            <div>Invite</div>
            <div className='is-flex py-10' style={{ background: '#E3D6EF' }}>
              <div className='has-text-left px-15 py-0 column'>Available</div>
              <div className='has-text-left px-15 py-0 column'>Pending</div>
              <div className='has-text-left px-15 py-0 column'>Accepted</div>
            </div>
          </div>
        ),
        accessor: 'invites',
        Cell: ({ cell: { value } }) => (
          <div className='is-flex py-10'>
            <div className='is-whitespace-nowrap has-text-left px-15 py-0 column'>
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
            <div className='has-text-left px-15 py-0 column'>{ value.pending }</div>
            <div className='has-text-left px-15 py-0 column'>{ value.accepted }</div>
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actionStatus',
        Cell: ({ cell: { value } }) => renderActionCell(value),
      },
    ],
    [debounceSearchTerm, handleUpdateUserInvitations, statusFilters],
  );

  const getStatus = (user) => {
    if (user.isActive && user.isWaitlist) return 'Waitlisted';
    if (user.isActive && !user.isWaitlist) return 'Active';
    if (!user.isActive && user.isWaitlist) return 'Blocked';

    return 'Disabled';
  };

  const dataSource = users.map((item) => ({
    ...item,
    userInfo: {
      id: item._id,
      name: fullName(item),
      avatarUrl: item.avatarUrl,
    },
    status: getStatus(item),
    activeDate: ((item.createdAt) ? formatDistanceToNowStrict(new Date(item.createdAt), { unit: 'day' }).replace(/ days?/, 'd') : ''),
    invites: {
      available: item.inviteCount,
      pending: item.pendingCount,
      accepted: item.acceptCount,
      id: item._id,
    },
    actionStatus: {
      id: item._id,
      status: getStatus(item),
    },
  }));

  const tabOptions = useMemo(() => {
    return [
      {
        label: `All (${analytic.total ? analytic.total : 0})`,
        value: 'all',
      },
      {
        label: `Active Users (${analytic.active ? analytic.active : 0})`,
        value: 'active',
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
    ]
  }, [analytic]);

  const [activeTab, setActiveTab] = useState('all');

  const onChangeTab = (value) => {
    setActiveTab(value);

    switch (value) {
      case 'waitlist':
        setStatusFilters({ ...initFilters, Waitlisted: true });
        break;
      case 'active':
        setStatusFilters({ ...initFilters, Active: true });
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
    <div className="hero is-fullheight is-flex is-flex-direction-column px-25 py-25 background-gray-white">
      <Helmet {...UserManagementHelmet} />
      <div className='is-flex is-justify-content-space-between'>
        <div>
          <h1 className='has-text-black has-text-weight-bold is-size-3'>User Management</h1>
          <p className='mb-15 is-size-6 text-gray-light'>Manage your users at a glance</p>
        </div>
        <BulkAdmitForm onSubmit={onBulkAdmitUsers} />
      </div>
      <div className='p-20 is-flex-grow-1 has-background-white' style={{ borderRadius: 10 }}>
        <div className='is-flex sema-is-justify-content-space-between'>
          <FilterTabs tabs={tabOptions} onChange={onChangeTab} value={activeTab} />
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Table
          columns={columns}
          data={dataSource}
          pagination={{
            page,
            perPage,
            totalCount,
            fetchData,
            loading: isFetching
          }}
        />
      </div>
    </div>
  );
};

export default withSemaAdmin(withLayout(UsersPage));
