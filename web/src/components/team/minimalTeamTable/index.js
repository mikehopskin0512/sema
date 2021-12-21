import React, { useMemo } from 'react'
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Table from '../../table';
import styles from './minimalTeamTable.module.scss'
import { DEFAULT_AVATAR, PATHS } from '../../../utils/constants';
import { differenceInCalendarDays, differenceInHours } from 'date-fns';

const MinimalTeamTable = ({ members }) => {
  const router = useRouter();
  const {
    query: { teamId },
  } = useRouter();
  const columns = useMemo(
    () => [
      {
        Header: 'USER',
        accessor: 'name',
        className: 'border-none',
        Cell: ({ cell: { value }, row: {original: { role, avatarUrl }} }) => (
          <div className='is-flex is-align-items-center py-20'>
            <img className={clsx('ml-10 mr-20 is-circularr')} src={avatarUrl || DEFAULT_AVATAR} alt={''} width='32px' />
            <div>
              <p className='has-text-weight-semibold'> {value}</p>
              <p className='has-text-primary has-text-weight-semibold'>{role || 'Member'}</p>
            </div>
          </div>
        ),
      },
      {
        Header: 'Sent',
        accessor: 'lastLogin',
        className: 'border-none',
        Cell: ({ cell: { value } }) => (
          <div className="is-flex is-align-items-center has-text-weight-semibold">
            {value}
          </div>
        ),
      },
    ],
    [],
  );

  const dataSource = useMemo(() => {
    return members.map((member) => {
      const { user: { firstName, lastName, identities, lastLogin }, role } = member;
      const field = {
        lastLogin: ''
      }
      const { email, avatarUrl } = identities.length && identities.find((item) => item?.provider === "github");
      const hoursDiff = differenceInHours(new Date(), new Date(lastLogin))
      const daysDiff = differenceInCalendarDays(new Date(), new Date(lastLogin))
      field.name = `${firstName} ${lastName}`;
      field.email = email;
      field.avatarUrl = avatarUrl || ''
      field.role = role.name || ''
      if (lastLogin) {
        field.lastLogin = `ACTIVE ${hoursDiff}H AGO`
        if (hoursDiff > 24) {
          field.lastLogin = `ACTIVE ${daysDiff} ${daysDiff > 1 ? 'DAYS' : 'DAY'} AGO`
        }
        if (hoursDiff === 0) {
          field.lastLogin = `ACTIVE NOW`
        }
      }
      return field;
    });
  }, [members]);

  return (
    <>
      <div className='is-bordered'>
        <div className={clsx('is-flex is-align-items-center is-justify-content-space-between', styles['custom-header'])}>
          <p className="has-text-deep-black has-text-weight-semibold is-size-6 px-15 ml-15">{dataSource.length} members</p>
          <button class="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push(`${PATHS.TEAM._}/${teamId}`)}>View All</button>
        </div>
        <Table
          columns={columns}
          data={dataSource.slice(0,6)}
          hasHeader={false}
          minimal={true}
          striped={false}
          empty={(
            <div className="is-flex is-align-content-center is-justify-content-center py-120 is-flex-direction-column">
              <img className={styles['no-data-img']} src="/img/empty-invite-table.png" />
              <div className={"subtitle has-text-centered mt-50 has-text-gray-dark is-size-5"}>
                You haven't added anyone on the team yet.
              </div>
            </div>
          )}
        />
      </div>
    </>
  )
}

export default MinimalTeamTable
