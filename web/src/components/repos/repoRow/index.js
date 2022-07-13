import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { alertOperations } from '../../../state/features/alerts';
import styles from './repoRow.module.scss';
import RepoUsers from '../repoUsers';
import { PATHS } from '../../../utils/constants';
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import { OptionsIcon } from '../../Icons';
import DropDownMenu from '../../dropDownMenu';
import usePermission from '../../../hooks/usePermission';
import DeleteRepoModal from '../repoCard/deleteRepoModal';
import RepoSyncText from '../../repoSync/repoSyncText';
import { useFlags } from '../../launchDarkly';

function RepoRow(props) {
  const titleRef = useRef(null);
  const { repoSyncTab } = useFlags();
  const dispatch = useDispatch();
  const {
    externalId = '', name = '', body = '', repoStats, users = [], language = '', _id: repoId, removeRepo, isOrganizationView = false,
    sync = {},
  } = props;
  const { isOrganizationAdmin } = usePermission();
  const [isDeleteRepoModalOpen, toggleDeleteModal] = useState(false);
  const [repoStatus] = useState(sync?.status || 'notsynced');

  const onRemoveRepo = async (e) => {
    e.stopPropagation();
    await removeRepo(repoId);
    toggleDeleteModal(false);
  };

  return (
    <>
      <Link href={`${PATHS.REPO}/${externalId}`}>
        <tr className="has-background-white my-10 is-clickable" >
          <td className={clsx('py-15 has-background-white px-10', styles.document)}>
            <div className="is-flex is-align-items-center">
              {/* <FontAwesomeIcon icon={faStarSolid} color="#FFA20F" className="mr-20" /> */}
              <OverflowTooltip ref={titleRef} text={name}>
                <p ref={titleRef} className={clsx("has-text-weight-semibold is-size-6", styles.body)}>{name}</p>
              </OverflowTooltip>
            </div>
          </td>
          <td className="py-15 has-background-white px-10">
            <div className="is-flex is-flex-direction-column is-justify-content-center">
              <p className="is-size-7">
                {language}
              </p>
            </div>
          </td>
          <td className={clsx('py-15 has-background-white px-10')}>
            <p className="is-size-5 has-text-centered has-text-weight-bold">
              {repoStats?.smartCodeReviews || 0}
            </p>
          </td>
          <td className={clsx('py-15 has-background-white px-10')}>
            <p className="is-size-5 has-text-centered has-text-weight-bold">
              {repoStats?.smartComments || 0}
            </p>
          </td>
          <td className={clsx('py-15 has-background-white px-10')}>
            <p className="is-size-5 has-text-centered has-text-weight-bold">
              {repoStats?.smartCommenters || 0}
            </p>
          </td>
          <td className={clsx('py-15 has-background-white px-10')}>
            <RepoUsers users={isOrganizationView ? repoStats.userIds : users} />
          </td>
          {repoSyncTab && <td className={clsx('py-15 has-background-white px-10')}>
            <div className='is-flex is-align-items-center'>
              <RepoSyncText repoStatus={repoStatus} />
            </div>
          </td>}
        </tr>
      </Link>
      {isOrganizationAdmin() && (
        <DeleteRepoModal
          isOpen={isDeleteRepoModalOpen}
          onCancel={() => toggleDeleteModal(false)}
          onConfirm={onRemoveRepo}
        />
      )}
    </>
  );
}

RepoRow.propTypes = {
  externalId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default RepoRow;
