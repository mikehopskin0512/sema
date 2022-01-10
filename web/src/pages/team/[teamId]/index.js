import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import Helmet, { TeamManagementHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import PageHeader from '../../../components/pageHeader';
import styles from './team.module.scss';
import Table from '../../../components/table';
import { teamsOperations } from '../../../state/features/teams';
import { rolesOperations } from '../../../state/features/roles';
import { fullName } from '../../../utils';
import withSelectedTeam from '../../../components/auth/withSelectedTeam';
import RoleChangeModal from '../../../components/team/roleChangeModal';
import usePermission from '../../../hooks/usePermission';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import ActionMenu from '../../../components/team/ActionMenu';
import { useRouter } from 'next/router';

const { fetchTeamMembers } = teamsOperations;
const { fetchRoles, updateUserRole, removeUserRole } = rolesOperations;

const TeamManagementPage = () => {
  const router = useRouter();
  const { checkAccess, checkTeam } = usePermission();
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
  const canModifyRoles = checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers');
  const canViewUserRoles = checkTeam(SEMA_CORPORATE_TEAM_ID);
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
    await dispatch(updateUserRole(userRoleId, { role: newRole }, token));
    await dispatch(fetchTeamMembers(teamId, { page, perPage }, token));
  };

  const onRemoveMember = useCallback(async (userRoleId) => {
    await dispatch(removeUserRole(userRoleId, token));
    await dispatch(fetchTeamMembers(teamId, { page, perPage }, token));
  }, [dispatch, page, perPage, token, user]);

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

  const menus = [
    {
      name: 'Team Management',
      path: '/',
      pathname: `${PATHS.TEAM._}/[teamId]`,
    },
  ];

  const columns = useMemo(() => [
    {
      Header: () => <div className="is-size-8 is-uppercase">Member</div>,
      accessor: 'userInfo',
      className: 'pl-20 pr-50 py-10 has-background-gray-100',
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
      className: 'pl-20 pr-50 py-10 has-background-gray-100',
    },
    {
      Header: () => <div className="is-size-8 is-uppercase">Roles</div>,
      accessor: 'roleName',
      toggleHidden: true,
      className: clsx('px-20 py-10 has-background-gray-100 is-full-width'),
    },
    {
      Header: () => <div className="is-size-8 is-uppercase">Roles</div>,
      accessor: 'role',
      className: clsx('px-20 py-10 has-background-gray-100 is-full-width'),
      Cell: ({ cell: { value }, row }) => row.original.disableEdit ? (
        <span>{row.original.roleName}</span>
      ) : (
        <Select
          className={styles.status}
          options={rolesOptions}
          value={rolesOptions.find((item) => item.value === value)}
          onChange={(newValue) => handleChangeRole(newValue, row)}
        />
      ),
    },
    {
      Header: '',
      accessor: 'actions',
      className: clsx('px-20 py-10 has-background-gray-100 is-full-width'),
      Cell: ({ row }) => <ActionMenu member={row.original} onRemove={onRemoveMember} disabled={row.original.disableEdit}/>,
    },
  ], [rolesOptions, handleChangeRole, onRemoveMember]);

  const fetchData = useCallback(({ pageIndex, pageSize }) => {
    setPage(pageIndex + 1);
    setPerPage(pageSize);
  }, [setPage, setPerPage]);

  const initialState = useMemo(() => {
    let defaultHidden = []
    if (canModifyRoles) {
      defaultHidden = ['roleName']
    } else if (canViewUserRoles) {
      defaultHidden = ['role', 'actions']
    }
    const initState = {
      hiddenColumns: [...defaultHidden]
    }
    return initState
  }, [canModifyRoles, canViewUserRoles, rolesOptions, handleChangeRole, onRemoveMember])

  return (
    <div className="has-background-gray-100 hero">
      <Helmet {...TeamManagementHelmet} />
      <div className="hero-body pb-300">
        <PageHeader userRole={userRole} menus={menus} />
        <div className="content-container px-20">
          <div className={styles['table-wrapper']}>
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

export default withSelectedTeam(withLayout(TeamManagementPage));
