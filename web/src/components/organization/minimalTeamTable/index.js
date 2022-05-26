import { PlusIcon } from '../../Icons';
import React, { useMemo } from 'react'
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Avatar from 'react-avatar';
import { isEmpty } from 'lodash';
import usePermission from '../../../hooks/usePermission';
import Table from '../../table';
import styles from './minimalOrganizationTable.module.scss'
import { DEFAULT_AVATAR, PATHS, SEMA_CORPORATE_ORGANIZATION_ID } from '../../../utils/constants';
import { differenceInCalendarDays, differenceInHours } from 'date-fns';

const MAX_MEMBERS = 6;

const MinimalOrganizationTable = ({ members, count, organizationId }) => {
  const router = useRouter();
  const { checkAccess } = usePermission();
  const columns = useMemo(
    () => [
      {
        Header: 'USER',
        accessor: 'name',
        className: 'border-none pt-12',
        Cell: ({ cell: { value }, row: {original: { role, avatarUrl }} }) => (
          <div className='is-flex is-align-items-center'>
            <div style={{ minWeight: 52 }}>
              <Avatar
                src={avatarUrl || DEFAULT_AVATAR}
                round
                size={52}
              />
            </div>
            <div  className="ml-20">
              <p className='has-text-weight-semibold'> {value}</p>
              <p className='is-uppercase has-text-primary has-text-weight-semibold'>{role || 'Member'}</p>
            </div>
          </div>
        ),
      },
      {
        Header: 'Sent',
        accessor: 'lastLogin',
        className: 'border-none',
        Cell: ({ cell: { value } }) => (
          <div className="is-justify-content-end pr-24 is-size-8 is-flex is-align-items-center has-text-weight-semibold">
            {value}
          </div>
        ),
      },
    ],
    [],
  );

  const dataSource = useMemo(() => {
    return members ? members.filter((member) => member.user).map((member) => {
      const { user: { firstName = '', lastName = '', identities, lastLogin }, role } = member;
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
    }) : [];
  }, [members]);

  return (
    <>
      <div className='is-bordered'>
        <div className={clsx('is-flex is-align-items-center is-justify-content-space-between', styles['custom-header'])}>
          <p className="has-text-deep-black has-text-weight-semibold is-size-6 px-15 ml-15">{count} members</p>
          {checkAccess(SEMA_CORPORATE_ORGANIZATION_ID, 'canEditUsers') && (
            <button
              className="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold"
              onClick={() => router.push(PATHS.ORGANIZATIONS.INVITE(organizationId))}
            >
              <PlusIcon size="small" />
              <span className="ml-8">Invite new members</span>
            </button>
          )}
        </div>
        <Table
          columns={columns}
          data={dataSource.slice(0, MAX_MEMBERS)}
          hasHeader={false}
          minimal={true}
          striped={false}
          empty={(
            <div className="is-flex is-align-content-center is-justify-content-center py-120 is-flex-direction-column">
              <img className={styles['no-data-img']} src="/img/empty-invite-table.png" />
              <div className={"subtitle has-text-centered mt-50 has-text-gray-dark is-size-5"}>
                You haven't added anyone on the organization yet.
              </div>
            </div>
          )}
        />
      </div>
    </>
  )
}

export default MinimalOrganizationTable
