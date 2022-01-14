import React from 'react'
import Avatar from 'react-avatar';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import styles from './TeamInfo.module.scss';
import usePermission from '../../../hooks/usePermission';

const TeamInfo = ({ userRole, teams, teamId }) => {
  const { isTeamAdmin } = usePermission();
  const router = useRouter();
  return (
    <div className="content-container px-20">
      <div className='is-flex is-align-items-center is-justify-content-space-between'>
        <div className="is-flex is-align-items-center mb-15">
          <Avatar
            name={userRole?.team?.name || "Team"}
            src={userRole?.team?.avatarUrl}
            size="35"
            round
            textSizeRatio={2.5}
            maxInitials={2}
          />
          <p className="has-text-weight-semibold has-text-black-950 is-size-5 ml-20">
            {userRole?.team?.name}
          </p>
          <span
            className='ml-15 p-15 tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-primary is-background-blue-50 is-text-blue-700'
          >
            {teams.membersCount === 1 ? `${teams.membersCount} member` : `${teams.membersCount} members`}
          </span>
        </div>
        {isTeamAdmin() && <button className="button is-primary is-outlined is-pulled-right has-text-weight-semibold" onClick={() => router.push(`/team/${teamId}/edit`)}>Edit</button>}
      </div>
      <div className={clsx(styles['team-description'], `has-text-gray-800 is-flex is-justify-content-space-between mb-25 is-flex-wrap-wrap`)}>
        <p>{`${userRole?.team?.description || ''}`}</p>
      </div>
    </div>
  )
}

export default TeamInfo;