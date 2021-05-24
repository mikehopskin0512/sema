import React, { useEffect, useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table';
import withLayout from '../../components/layout/adminLayout';
import SearchInput from '../../components/admin/searchInput';

import { usersOperations } from '../../state/features/users';
import { fullName } from '../../utils';
import useDebounce from '../../hooks/useDebounce';
import { formatDistanceToNowStrict } from 'date-fns';

import styles from './users.module.scss';

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
          <div className='is-flex is-align-items-center'>
            <img src={value.avatarUrl} alt="avatar" width={32} height={32} className='mr-10' style={{ borderRadius: '100%' }}/>
            { value.name }
          </div>
        ),
      },
      {
        Header: ({ isSorted, isSortedDesc }) => (
          <div className='has-text-centered'>
            <span className="mr-10">Active Date</span>
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
        Cell: ({ cell: { value } }) => <div className="has-text-centered">{value}</div>,
      },
      {
        Header: 'Email',
        accessor: 'username',
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
            <div className='has-text-left px-15 py-0 column'>
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
            <div className='has-text-left px-15 py-0 column'>{ value.pending }</div>
            <div className='has-text-left px-15 py-0 column'>{ value.accepted }</div>
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
    activeDate: ((item.createdAt) ? formatDistanceToNowStrict(new Date(item.createdAt), { unit: 'day' }).replace(/ days?/, 'd') : ''),
    invites: {
      available: item.inviteCount,
      pending: item.pendingCount,
      accepted: item.acceptCount,
      id: item._id,
    },
  }));

  return (
    <div className={clsx(styles['users-page'], 'is-flex is-flex-direction-column')}>
      <h1 className='has-text-black has-text-weight-bold is-size-3'>User Management</h1>
      <p className='mb-15 is-size-6' style={{ color: '#9198a4' }}>Manage your users at a glance</p>
      <div className='p-20 is-flex-grow-1 is-background-white' style={{ borderRadius: 10 }}>
        <div className='is-flex is-justify-content-flex-end'>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Table columns={columns} data={dataSource} />
      </div>
    </div>
  );
};

export default withLayout(UsersPage);
