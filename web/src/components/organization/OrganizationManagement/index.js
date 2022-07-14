import React, { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import { getInvitesBySender } from '../../../state/features/invitations/actions';
import styles from './OrganizationManagement.module.scss';
import Helmet, { OrganizationManagementHelmet } from '../../utils/Helmet';
import Table from '../../table';
import withSelectedOrganization from '../../auth/withSelectedOrganization';
import RoleChangeModal from '../roleChangeModal';
import ActionMenu from '../ActionMenu';
import { organizationsOperations } from '../../../state/features/organizations[new]';
import { rolesOperations } from '../../../state/features/roles';
import { fullName } from '../../../utils';
import usePermission from '../../../hooks/usePermission';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { ArrowDropdownIcon } from '../../Icons';
import { ALERT_TYPES, PATHS } from '../../../utils/constants';
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import { notify } from '../../../components/toaster/index';

const { fetchOrganizationMembers } = organizationsOperations;
const { fetchRoles, updateUserRole, removeUserRole } = rolesOperations;

const OrganizationManagement = ({ activeOrganization }) => {
  const router = useRouter();
  const { isOrganizationAdmin, isSemaAdmin } = usePermission();
  const [isOpen, setIsOpen] = useState(false);
  const [editableMember, setEditableMember] = useState({
    name: '',
    newRole: '',
    userRoleId: '',
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const { auth, organization, role, invitations } = useSelector((state) => ({
    auth: state.authState,
    organization: state.organizationsNewState,
    role: state.rolesState,
    invitations: state.invitationsState.data,
  }));
  const { user = {}, token } = auth;
  const { members, membersCount } = organization;
  const { roles } = role;

  const dispatch = useDispatch();
  const canModifyRoles = isOrganizationAdmin();
  const organizationId = activeOrganization?.organization?._id;

  useAuthEffect(() => {
    if (organizationId && perPage && page) {
      dispatch(fetchOrganizationMembers(organizationId, { page, perPage }, token));
      dispatch(fetchRoles(token));
      dispatch(getInvitesBySender({senderId: user._id}, token))
    }
  }, [user, dispatch, page, perPage, organizationId, activeOrganization]);

  const rolesOptions = useMemo(() => roles?.map((role) => ({
    value: role._id,
    label: role.name,
  })) || [], [roles]);

  const dataSource = useMemo(() => members ? members.map((member) => ({
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
    status: 'Invited',
  })).sort((member1, member2) => member1.userInfo.name.localeCompare(member2.userInfo.name)) : [], [members]);

  const handleChangeRole = useCallback((newValue, row) => {
    setIsOpen(true);
    setEditableMember({
      name: row && row.original && row.original.userInfo ? row.original.userInfo.name : '',
      newRole: newValue,
      userRoleId: row && row.original ? row.original._id : '',
    });
  }, []);

  const updateRole = async (userRoleId, newRole) => {
    await dispatch(updateUserRole(userRoleId, { role: newRole, organizationId }, token));
    await dispatch(fetchOrganizationMembers(organizationId, { page, perPage }, token));
  };

  const onRemoveMember = useCallback(async (userRoleId) => {
    await dispatch(removeUserRole(organizationId, userRoleId, token));
    await dispatch(fetchOrganizationMembers(organizationId, { page, perPage }, token));
  }, [dispatch, page, perPage, token, user, organizationId]);

  const columns = useMemo(() => [
    {
      Header: () => <div className="is-size-8 is-uppercase">Member</div>,
      accessor: 'userInfo',
      className: 'pl-20 pr-50 py-10 has-background-white-50',
      Cell: ({ cell: { value } }) => {
        const nameRef = useRef(null);
        return (
          <div className={clsx("is-flex is-align-items-center is-cursor-pointer",)}>
            <Avatar src={value.avatarUrl} size="32" round />
            <OverflowTooltip ref={nameRef} text={value.name}>
              <p ref={nameRef} className={clsx("ml-10 has-overflow-ellipsis", styles.name)}>{value.name}</p>
            </OverflowTooltip>
          </div>
        )
      },
    },
    {
      Header: () => <div className="is-size-8 is-uppercase">Email</div>,
      isVisible: false,
      accessor: 'email',
      className: 'pl-20 pr-50 py-10 has-background-gray-200',
      Cell: ({ cell: { value } }) => {
        const emailRef = useRef(null);
        return (
          <OverflowTooltip ref={emailRef} text={value}>
            <p ref={emailRef} className={clsx("has-overflow-ellipsis", styles.email)}>{value}</p>
          </OverflowTooltip>
        )
      },
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
              DropdownIndicator: () => <ArrowDropdownIcon className="mr-5" />
            }}
          />
        </div>
      ) : (
        <span>{row.original.roleName}</span>
      ),
    },
    {
      Header: "",
      isVisible: false,
      accessor: 'action',
      className: 'pl-20 py-10 has-background-white-50',
      Cell: ({ row }) => canModifyRoles ? (
        <div className="is-flex is-justify-content-flex-end">
          <ActionMenu member={row.original} onRemove={onRemoveMember} disabled={row.original.disableEdit} />
        </div>
      ) : (
        <div />
      ),
    },
  ], [rolesOptions, handleChangeRole, onRemoveMember]);

  const fetchData = useCallback(({
    pageIndex,
    pageSize,
  }) => {
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
    router.push(PATHS.ORGANIZATIONS.INVITE(organizationId));
  };

  const onInviteLinkCopy = async (e) => {
    const invitationToken = invitations.find((invite) => invite.organizationId === organizationId)?.token;
    if (!invitationToken) {
      notify('Invitation link was not copied.', {
        type: ALERT_TYPES.ERROR,
        duration: 3000,
      });
      e.target?.parentNode?.blur() || e.target?.blur();
      return;
    }
    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}${PATHS.LOGIN}?token=${invitationToken}`;

    e.target?.parentNode?.blur() || e.target?.blur();

    try {
      await navigator.clipboard.writeText(magicLink);
      notify('Invitation link was copied.', {
        type: ALERT_TYPES.SUCCESS,
        duration: 3000,
      });
    } catch (err) {
      notify('Invitation link was not copied.', {
        type: ALERT_TYPES.ERROR,
        duration: 3000,
      });
    }
  }

  return (
    <div className='hero mx-10'>
      <Helmet {...OrganizationManagementHelmet} />
      <div className='is-flex is-justify-content-space-between is-align-items-center mt-10 mb-30'>
        <div className='is-size-4 has-text-weight-semibold has-text-black-950'>Organization Management</div>
      </div>
      <div className='hero-body py-0 px-0'>
        <div className='content-container px-0'>
          <div className={clsx('has-background-gray-300 pb-15', styles['table-wrapper'])}>
            <Table
              className='overflow-unset'
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
          <RoleChangeModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            member={editableMember}
            onSubmit={updateRole}
          />
        </div>
      </div>
    </div>
  );
};

export default withSelectedOrganization(OrganizationManagement);
