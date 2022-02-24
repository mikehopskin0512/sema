import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './TeamManagement.module.scss';
import Helmet, { TeamManagementHelmet } from '../../utils/Helmet';
import Table from '../../table';
import withSelectedTeam from '../../auth/withSelectedTeam';
import RoleChangeModal from '../roleChangeModal';
import ActionMenu from '../ActionMenu';
import { teamsOperations } from '../../../state/features/teams';
import { rolesOperations } from '../../../state/features/roles';
import { fullName } from '../../../utils';
import usePermission from '../../../hooks/usePermission';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { ArrowDrowdownIcon, PlusIcon } from '../../Icons';
import { PATHS } from '../../../utils/constants';
import Badge from '../../badge/badge';

const { fetchTeamMembers } = teamsOperations;
const { fetchRoles, updateUserRole, removeUserRole } = rolesOperations;

const TeamManagement = () => {
  const router = useRouter();
  const { isTeamAdmin } = usePermission();
  const [isOpen, setIsOpen] = useState(false);
  const [editableMember, setEditableMember] = useState({
    name: '',
    newRole: '',
    userRoleId: '',
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [userRole, setUserRole] = useState({});

  const { auth, team, role } = useSelector((state) => ({
    auth: state.authState,
    team: state.teamsState,
    role: state.rolesState,
  }));
  const { user = {}, token } = auth;
  const { members, membersCount } = team;
  const { roles } = role;

  const dispatch = useDispatch();
  const canModifyRoles = isTeamAdmin();
  const { teamId } = router.query;

  useAuthEffect(() => {
    if (teamId) {
      dispatch(fetchTeamMembers(teamId, { page, perPage }, token));
      dispatch(fetchRoles(token));
    }
  }, [user, dispatch, page, perPage, teamId]);

  const rolesOptions = useMemo(() => roles?.map((role) => ({
    value: role._id,
    label: role.name,
  })) || [], [roles]);

  const dataSource = useMemo(() => members?.map((member) => ({
    _id: member._id,
    userInfo: {
      userId: member.user?._id,
      name: fullName(member.user),
      avatarUrl: member && member.user ? member.user.avatarUrl : '',
    },
    email: member.user && member.user.username,
    role: member.role ? member.role._id : null,
    roleName: member.role ? member.role.name : null,
    disableEdit: member.user?._id === user._id,
    status: 'Active',
  })) || [], [members]);

  const handleChangeRole = useCallback((newValue, row) => {
    setIsOpen(true);
    setEditableMember({
      name: row && row.original && row.original.userInfo ? row.original.userInfo.name : '',
      newRole: newValue,
      userRoleId: row && row.original ? row.original._id : '',
    });
  }, []);

  const updateRole = async (userRoleId, newRole) => {
    await dispatch(updateUserRole(userRoleId, { role: newRole, teamId }, token));
    await dispatch(fetchTeamMembers(teamId, { page, perPage }, token));
  };

  const onRemoveMember = useCallback(async (userRoleId) => {
    await dispatch(removeUserRole(teamId, userRoleId, token));
    await dispatch(fetchTeamMembers(teamId, { page, perPage }, token));
  }, [dispatch, page, perPage, token, user]);

  const getBadgeColor = useCallback((label) => {
    if (label === 'Active') return 'success';
    if (label === 'Invited') return 'warning';
    if (label === 'Invite Expired') return 'error';

    return 'primary';
  }, []);

  useEffect(() => {
    if (team.teams.length) {
      const activeRole = _.find(team.teams, function (o) {
        return o.team._id === teamId
      });
      if (activeRole) {
        setUserRole(activeRole)
      }
    }
  }, [team]);

  const columns = useMemo(() => [
    {
      Header: () => <div className="is-size-8 is-uppercase">Member</div>,
      accessor: 'userInfo',
      className: 'pl-20 pr-50 py-10 has-background-white-50',
      Cell: ({ cell: { value } }) => (
        <div className="is-flex is-align-items-center is-cursor-pointer">
          <img src={value.avatarUrl} alt="avatar" width={32} height={32} className="mr-10" style={{ borderRadius: '100%' }} />
          <span className="is-whitespace-nowrap">{ value.name }</span>
        </div>
      ),
    },
    {
      Header: () => <div className="is-size-8 is-uppercase">Email</div>,
      isVisible: false,
      accessor: 'email',
      className: 'pl-20 pr-50 py-10 has-background-gray-200',
    },
    {
      Header: () => <div className="is-size-8 is-uppercase">Roles</div>,
      accessor: 'role',
      className: clsx('px-20 py-10 has-background-white-50 is-full-width '),
      Cell: ({ cell: { value }, row }) => canModifyRoles ? (
        <div className={clsx('is-flex')}>
          <Select
            className={`${styles.status} is-flex-grow-1`}
            options={rolesOptions}
            value={rolesOptions.find((item) => item.value === value)}
            onChange={(newValue) => handleChangeRole(newValue, row)}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: () => <ArrowDrowdownIcon className="mr-5" />
            }}
          />
        </div>
      ) : (
        <span>{row.original.roleName}</span>
      ),
    },
    {
      Header: () => <div className="is-size-8 is-uppercase">Status</div>,
      isVisible: false,
      accessor: 'status',
      className: 'pl-20 pr-50 py-10 has-background-white-50',
      Cell: ({ cell: { value } }) => (
        <div className="is-flex is-align-items-center">
          <Badge label={value} color={getBadgeColor(value)} />
          {
            value !== 'Active' && (
              <button className="button border-none has-text-primary">Re-invite</button>
            )
          }
        </div>
      ),
    },
    {
      Header: "",
      isVisible: false,
      accessor: 'action',
      className: 'pl-20 py-10 has-background-white-50',
      Cell: ({ cell: { value }, row }) => canModifyRoles ? (
        <div className="is-flex is-justify-content-flex-end">
          <ActionMenu member={row.original} onRemove={onRemoveMember} disabled={row.original.disableEdit}/>
        </div>
      ) : (
        <div />
      ),
    },
  ], [rolesOptions, handleChangeRole, onRemoveMember, getBadgeColor]);

  const fetchData = useCallback(({ pageIndex, pageSize }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  const initialState = useMemo(() => {
    let defaultHidden = []
    if (!canModifyRoles) {
      defaultHidden = ['actions']
    }
    const initState = {
      hiddenColumns: [...defaultHidden]
    }
    return initState
  }, [canModifyRoles, rolesOptions, handleChangeRole, onRemoveMember])

  const goToInvitePage = () => {
    router.push(PATHS.TEAM.INVITE(teamId));
  };

  return (
    <div className="hero mx-10">
      <Helmet {...TeamManagementHelmet} />
      <div className="is-flex is-justify-content-space-between is-align-items-center mt-10 mb-30">
        <div className="is-size-4 has-text-weight-semibold has-text-black-950">Team Management</div>
        <button
          className="button is-primary border-radius-4px"
          type="button"
          onClick={goToInvitePage}
        >
          <PlusIcon size="small" />
          <span className="ml-10">Invite New Members</span>
        </button>
      </div>
      <div className="hero-body py-0 px-0">
        <div className="content-container px-0">
          <div className={clsx('has-background-gray-300 pb-15', styles['table-wrapper'])}>
            <Table
              className="overflow-unset"
              data={dataSource}
              columns={columns}
              pagination={{
                page,
                perPage,
                totalCount: membersCount,
                fetchData,
              }}
              initialState={initialState}
            />
          </div>
        </div>
        <RoleChangeModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          member={editableMember}
          onSubmit={updateRole}
        />
      </div>
    </div>
  );
};

export default withSelectedTeam(TeamManagement);
