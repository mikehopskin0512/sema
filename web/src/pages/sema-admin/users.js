import React, { useEffect, useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Badge from '../../components/badge/badge';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import SearchInput from '../../components/admin/searchInput';

import { usersOperations } from '../../state/features/users';
import { fullName } from '../../utils';
import useDebounce from '../../hooks/useDebounce';
import StatusFilter from '../../components/admin/statusFilter';
import styles from './users.module.scss';

const { fetchUsers, updateUserAvailableInvitationsCount, updateStatus } = usersOperations;

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.usersState);

  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);
  const [statusFilters, setStatusFilters] = useState({
    Waitlisted: false,
    Active: false,
    Blocked: false,
    Disabled: false,
  });

  useEffect(() => {
    const statusQuery = Object.entries(statusFilters)
      .filter((item) => item[1])
      .map((item) => item[0]);

    dispatch(fetchUsers({ search: searchTerm, status: statusQuery }));
  }, [debounceSearchTerm, statusFilters]);

  const handleUpdateUserInvitations = useCallback(async (userId, amount) => {
    await dispatch(updateUserAvailableInvitationsCount(userId, amount));
    dispatch(fetchUsers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleAdmitUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isWaitlist',
      value: false,
    }));
    dispatch(fetchUsers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleBlockOrDisableUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isActive',
      value: false,
    }));
    dispatch(fetchUsers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleEnableUser = useCallback(async (userId) => {
    await dispatch(updateStatus(userId, {
      key: 'isActive',
      value: true,
    }));
    dispatch(fetchUsers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const getBadgeColor = (value) => {
    if (value === 'Waitlisted') return 'blue';
    if (value === 'Active') return 'green';
    if (value === 'Blocked') return 'pink';

    return 'purple';
  };

  const renderActionCell = (userStatus) => {
    const { id, status } = userStatus;
    switch (status) {
      case 'Active':
        return (
          <div className={clsx(styles.actionsCell, styles.flex)}>
            <a className={clsx(styles['flex-1'])} onClick={(e) => handleBlockOrDisableUser(id)}>Disable</a>
          </div>
        );
      case 'Waitlisted':
        return (
          <div className={clsx(styles.actionsCell, styles.flex)}>
            <a className={clsx(styles['flex-1'])} onClick={(e) => handleAdmitUser(id)}>Admit</a>
            <a className={clsx(styles['flex-1'])} onClick={(e) => handleBlockOrDisableUser(id)}>Block</a>
          </div>
        );
      case 'Disabled':
        return (
          <div className={clsx(styles.actionsCell, styles.flex)}>
            <a className={clsx(styles['flex-1'])} onClick={(e) => handleEnableUser(id)}>Enable</a>
          </div>
        );
      case 'Blocked':
        return (
          <div className={clsx(styles.actionsCell, styles.flex)}>
            <a className={clsx(styles['flex-1'])} onClick={(e) => handleEnableUser(id)}>Unblock</a>
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
          <div className={styles.name}>
            <img src={value.avatarUrl} alt="avatar" className={styles['avatar-img']} />
            { value.name }
          </div>
        ),
      },
      {
        Header: () => (
          <div className={clsx(styles.status, styles.flex)}>
            <div>Status</div>
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
        Header: ({ isSorted, isSortedDesc }) => (
          <div className={styles['text-center']}>
            <span style={{ marginRight: 10 }}>Active Date</span>
            {
              isSorted
                ? (
                  isSortedDesc
                    ? <FontAwesomeIcon icon="chevron-down" />
                    : <FontAwesomeIcon icon="chevron-up" />
                )
                : ''
            }
          </div>
        ),
        accessor: 'activeDate',
        Cell: ({ cell: { value } }) => <div style={{ textAlign: 'center' }}>{value}</div>,
      },
      {
        Header: 'Email',
        accessor: 'username',
        sorted: false,
      },
      {
        Header: () => (
          <div className={styles['invite-header']} style={{ textAlign: 'center' }}>
            <div>Invite</div>
            <div className={styles['invite-subheader']}>
              <div className={styles['invite-col']}>Available</div>
              <div className={styles['invite-col']}>Pending</div>
              <div className={styles['invite-col']}>Accepted</div>
            </div>
          </div>
        ),
        accessor: 'invites',
        Cell: ({ cell: { value } }) => (
          <div className={clsx(styles.subHeader, styles.flex)}>
            <div className={clsx(styles['flex-1'], styles['invite-col'])}>
              { value.available }
              <button
                type="button"
                className={styles.button}
                onClick={() => handleUpdateUserInvitations(value.id, 1)}
              >
                +
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={() => handleUpdateUserInvitations(value.id, -1)}
              >
                -
              </button>
            </div>
            <div className={clsx(styles['flex-1'], styles['invite-col'])}>{ value.pending }</div>
            <div className={clsx(styles['flex-1'], styles['invite-col'])}>{ value.accepted }</div>
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actionStatus',
        Cell: ({ cell: { value } }) => renderActionCell(value),
      },
    ],
    [handleUpdateUserInvitations],
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
      name: fullName(item),
      avatarUrl: item.avatarUrl,
    },
    status: getStatus(item),
    activeDate: `${moment().diff(item.createdAt, 'days')}d`,
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

  return (
    <div className={styles['users-page']}>
      <h1 className={styles['page-title']}>User Management</h1>
      <p className={styles['page-desc']}>Manage your users at a glance</p>
      <div className={styles['table-wrapper']}>
        <div className={styles['search-input-wrapper']}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Table columns={columns} data={dataSource} />
      </div>
    </div>
  );
};

export default withLayout(UsersPage);
