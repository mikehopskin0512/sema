import React from 'react';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import styles from './repoRow.module.scss';
import RepoUsers from '../repoUsers';

const RepoRow = (props) => {
  const {
    externalId = '', name = '', body = '', stats, users = []
  } = props;

  const onClickRow = () => {
    window.location = `/repo/${externalId}`;
  };

  return (
    <tr className="has-background-white my-10 is-clickable" onClick={onClickRow}>
      <td className={clsx('py-15 has-background-white px-10', styles.document)}>
        <div className="is-flex is-align-items-center">
          {/* <FontAwesomeIcon icon={faStarSolid} color="#FFA20F" className="mr-20" /> */}
          <p className={clsx("has-text-weight-semibold is-size-6", styles.body)}>{name}</p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-7">
            {isEmpty(body) ? 'No description' : body}
          </p>
        </div>
      </td>
      <td className={clsx('py-15 has-background-white px-10', styles['stats-col'])}>
        <p className="is-size-5 has-text-centered has-text-weight-bold">
          {stats?.totalPullRequests || 0}
        </p>
      </td>
      <td className={clsx('py-15 has-background-white px-10', styles['stats-col'])}>
        <p className="is-size-5 has-text-centered has-text-weight-bold">
          {stats?.totalSmartComments || 0}
        </p>
      </td>
      <td className={clsx('py-15 has-background-white px-10', styles['stats-col'])}>
        <p className="is-size-5 has-text-centered has-text-weight-bold">
          {stats?.totalSmartCommenters || 0}
        </p>
      </td>
      <td className={clsx('py-15 has-background-white px-10', styles['stats-col'])}>
        <p className="is-size-5 has-text-centered has-text-weight-bold">
          {stats?.totalSemaUsers || 0}
        </p>
      </td>
      <td className={clsx('py-15 has-background-white px-10 is-flex is-justify-content-center')}>
        <RepoUsers users={users} />
      </td>
    </tr>
  );
};

RepoRow.propTypes = {
  externalId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default RepoRow;
