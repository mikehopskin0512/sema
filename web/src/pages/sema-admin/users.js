import React, { useEffect, useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import SearchInput from '../../components/admin/searchInput';
import styles from './users.module.scss';

import { usersOperations } from '../../state/features/users';
import { fullName } from '../../utils';
import useDebounce from '../../hooks/useDebounce';

const { fetchUsers, updateUserAvailableInvitationsCount } = usersOperations;

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.usersState);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    dispatch(fetchUsers({ search: searchTerm }));
  }, [debounceSearchTerm]);

  const handleUpdateUserInvitations = useCallback(async (userId, amount) => {
    await dispatch(updateUserAvailableInvitationsCount(userId, amount));
    dispatch(fetchUsers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'userInfo',
        sorted: true,
        Cell: ({ cell: { value } }) => (
          <div className={styles.name}>
            <img src={value.avatarUrl} alt="avatar" className={styles['avatar-img']}/>
            { value.name }
          </div>
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
    ],
    [debounceSearchTerm],
  );

  const dataSource = users.map((item) => ({
    ...item,
    userInfo: {
      name: fullName(item),
      avatarUrl: item.avatarUrl,
    },
    activeDate: `${moment(item.createdAt).format('DD')}d`,
    invites: {
      available: item.inviteCount,
      pending: item.pendingCount,
      accepted: item.acceptCount,
      id: item._id,
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
