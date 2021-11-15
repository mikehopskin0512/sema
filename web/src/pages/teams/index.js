import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Helmet, { TeamManagementHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PageHeader from '../../components/pageHeader';
import styles from './teams.module.scss';
import Table from '../../components/table';
import ActionMenu from '../../components/team/actionMenu';
import { PlusIcon } from '../../components/Icons';
import { PATHS } from '../../utils/constants';

function SwitchCell({ name, row }) {
  return (
    <div className="field switch-input" aria-hidden>
      <input
        id={`${name}-${row.id}`}
        type="checkbox"
        className="switch is-rounded"
      />
      <label htmlFor={`${name}-${row.id}`} />
    </div>
  );
}

SwitchCell.propTypes = {
  row: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

function StatusCell() {
  const options = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Disable',
      value: 'disable',
    },
  ];

  return (
    <Select
      options={options}
    />
  );
}

const TeamManagementPage = () => {
  const router = useRouter();

  const columns = [
    {
      Header: () => <div className="is-size-8">Member</div>,
      accessor: 'name',
      className: 'px-20 py-10 has-background-gray-9',
    },
    {
      Header: () => <div className="is-size-8">Email</div>,
      accessor: 'email',
      className: 'px-20 py-10 has-background-gray-9',
    },
    {
      Header: () => <div className="is-size-8">Add Suggested Snippets</div>,
      accessor: 'suggestedComments',
      className: 'px-20 py-10 has-background-gray-9',
      Cell: (props) => <SwitchCell name="suggestedComments" {...props} />,
    },
    {
      Header: () => <div className="is-size-8">Add Community Guides</div>,
      accessor: 'communityGuides',
      className: 'px-20 py-10 has-background-gray-9',
      Cell: (props) => <SwitchCell name="communityGuides" {...props} />,
    },
    {
      Header: () => <div className="is-size-8">Library Admin</div>,
      accessor: 'libraryAdmin',
      className: 'px-20 py-10 has-background-gray-9',
      Cell: (props) => <SwitchCell name="libraryAdmin" {...props} />,
    },
    {
      Header: () => <div className="is-size-8">Status</div>,
      accessor: 'status',
      className: clsx('px-20 py-10 has-background-gray-9', styles.status),
      Cell: StatusCell,
    },
    {
      Header: '',
      accessor: 'action',
      className: 'px-20 py-10 has-background-gray-9',
      Cell: ActionMenu,
    },
  ];

  const dataSource = [
    {
      name: 'Harrison Shoff',
      email: 'harrison.shoff@gmail.com',
      suggestedComments: false,
      communityGuides: false,
      libraryAdmin: false,
      status: '',
    },
    {
      name: 'Darlene Robertson',
      email: 'amaranth@outlook.com',
      suggestedComments: true,
      communityGuides: false,
      libraryAdmin: false,
      status: '',
    },
    {
      name: 'Jerome Bell',
      email: 'amaranth@outlook.com',
      suggestedComments: true,
      communityGuides: true,
      libraryAdmin: true,
      status: '',
    },
    {
      name: 'Annette Black',
      email: 'amaranth@outlook.com',
      suggestedComments: true,
      communityGuides: true,
      libraryAdmin: false,
      status: '',
    },
    {
      name: 'Ariene McCoy',
      email: 'amaranth@outlook.com',
      suggestedComments: true,
      communityGuides: true,
      libraryAdmin: false,
      status: '',
    },
    {
      name: 'Robert Fox',
      email: 'amaranth@outlook.com',
      suggestedComments: true,
      communityGuides: false,
      libraryAdmin: false,
      status: '',
    },
  ];

  const goToInviteMembers = () => {
    router.push(`${PATHS.TEAMS}/invite`);
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet {...TeamManagementHelmet} />
      <div className="hero-body pb-300">
        <PageHeader />
        <div className="content-container px-20">
          <div className="is-flex is-align-items-center mb-15">
            <p className="has-text-weight-semibold has-text-deep-black is-size-5 mr-10">
              Team admin
            </p>
            <span
              className={clsx('p-15 tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-primary', styles.tag)}
            >
              39 members
            </span>
          </div>
          <div className="is-flex is-justify-content-space-between mb-25">
            <p>The members will have access to the Team's Suggested Snippets and Community Guides</p>
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={goToInviteMembers}
            >
              <PlusIcon size="small" />
              <span className="ml-8">
                Invite new members
              </span>
            </button>
          </div>
          <div className={styles['table-wrapper']}>
            <Table data={dataSource} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(TeamManagementPage);
