import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import styles from './repoRow.module.scss';
import RepoUsers from '../repoUsers';
import { PATHS } from '../../../utils/constants';
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import Tooltip from '../../Tooltip';
import { OptionsIcon, StarFilledIcon, StarOutlineScg } from '../../Icons';
import DropDownMenu from '../../dropDownMenu';
import usePermission from '../../../hooks/usePermission';
import DeleteRepoModal from '../repoCard/deleteRepoModal';
import { toggleIsPinnedRepos } from '../../../state/features/repositories/actions';
import { black900, orange400 } from '../../../../styles/_colors.module.scss';
import { toggleUserRepoPinned } from '../../../state/features/auth/actions';
import { toggleOrgRepoPinned } from '../../../state/features/organizations[new]/actions';

const RepoRow = (props) => {
  const dispatch = useDispatch();
  const { token, user, selectedOrganization } = useSelector((state) => state.authState);
  const titleRef = useRef(null);
  const {
    externalId = '', name = '', body = '', repoStats, users = [], language = '', _id: repoId, removeRepo, isOrganizationView = false, isPinned = false,
  } = props;
  const { isOrganizationAdmin } = usePermission();
  const [isDeleteRepoModalOpen, toggleDeleteModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  const onRemoveRepo = async (e) => {
    e.stopPropagation();
    await removeRepo(repoId);
    toggleDeleteModal(false);
  };

  const onToggleIsPinned = async (e) => {
    e.stopPropagation();
    selectedOrganization?.organization ? await dispatch(toggleOrgRepoPinned({
      orgId: selectedOrganization.organization._id,
      repoId,
      token
    })) : 
      await dispatch(toggleUserRepoPinned({
        userId: user._id,
        repoId,
        token
      }));
  }

  const ActionColumn = () => {
    if (isOrganizationAdmin()) {
      return (
        <td className={clsx('py-15 has-background-white px-10')}>
          <DropDownMenu
            isRight
            options={[
              {
                label: 'Remove from Organization',
                onClick: () => toggleDeleteModal(true),
              },
            ]}
            trigger={
              <div className="is-clickable is-flex">
                <OptionsIcon />
              </div>
            }
          />
        </td>
      )
    }
    return '';
  };

  return (
    <>
      <Link href={`${PATHS.REPO}/${externalId}`}>
        <tr className="has-background-white my-10 is-clickable" >
          <td className={clsx('py-15 has-background-white px-10', styles.document)}>
            <div className="is-flex is-align-items-center">
              {/* <FontAwesomeIcon icon={faStarSolid} color="#FFA20F" className="mr-20" /> */}
              <Tooltip direction='right' text={isPinned ? 'Remove from Pinned Repos' : 'Pin this Repo'} isActive={true} showDelay={0} isRepoPage={true}>
                <div className="mt-5" onClick={onToggleIsPinned} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                  {isPinned ? <StarFilledIcon color={orange400} /> : <StarOutlineScg color={hovered ? orange400 : black900} />}
                </div>
              </Tooltip>
              <OverflowTooltip ref={titleRef} text={name}>
                <p ref={titleRef} className={clsx("has-text-weight-semibold is-size-6 ml-25", styles.body)}>{name}</p>
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
            {ActionColumn()}
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
};

RepoRow.propTypes = {
  externalId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default RepoRow;
