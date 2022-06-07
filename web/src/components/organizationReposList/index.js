import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '../../components/checkbox';
import { editOrganizationRepos, fetchOrganizationRepos } from '../../state/features/organizations[new]/actions';
import Loader from '../../components/Loader';
import Table from '../table';
import { alertOperations } from '../../state/features/alerts';
import { CloseIcon, SearchIcon } from '../../components/Icons';
import { InputField } from 'adonis';
import useDebounce from '../../hooks/useDebounce';

const OrganizationReposList = ({ isActive, onClose }) => {
  const { triggerAlert } = alertOperations;
  const dispatch = useDispatch();
  const { selectedOrganization, user, token } = useSelector((state) => state.authState);
  const { repos } = useSelector((state) => state.organizationsNewState);
  const {
    data: { repositories },
    isFetching: isFetchingAdminRepos
  } = useSelector((state) => state.repositoriesState);
  const [activeRepos, setActiveRepos] = useState(new Set(repos.map(repo => repo._id)));
  const isAllSelected = activeRepos.size === repositories.length;
  const { organization } = selectedOrganization;
  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm);

  const toggleRepoIsActive = (repoId) => {
    const repos = new Set(activeRepos);
    if (repos.has(repoId)) {
      repos.delete(repoId);
    } else {
      repos.add(repoId);
    }
    setActiveRepos(repos);
  };
  const toggleAllSelections = () => {
    setActiveRepos(new Set(
      isAllSelected ? [] : repositories.map((repo) => repo._id),
    ));
  };

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <div className="py-8 is-flex is-align-items-center">
            <Checkbox
              value={isAllSelected}
              onChange={toggleAllSelections}
              intermediate={!!activeRepos.size && !isAllSelected}
            />
            <div className="is-uppercase is-size-8 is-line-height-1 ml-8">Repo Name</div>
          </div>
        ),
        accessor: 'repo',
        className: 'px-12 has-text-weight-bold is-size-6',
        Cell: ({ cell: { value } }) => (
          <div className="is-flex py-16">
            <Checkbox
              value={activeRepos.has(value.id)}
              onChange={() => toggleRepoIsActive(value.id)}
            />
            <span className="ml-8">{value.name}</span>
          </div>
        ),
        sorted: true,
      },
      {
        Header: () => <div className="is-uppercase is-line-height-1 is-size-8">Date of last Comment</div>,
        accessor: 'lastCommentDate',
        className: 'has-text-weight-bold is-size-6',
      },
      {
        Header: () => <div className="is-uppercase is-line-height-1 is-size-8">Number of Sema comments</div>,
        accessor: 'totalComments',
        className: 'has-text-weight-bold is-size-6',
      },
    ],
    [activeRepos],
  );

  const data = useMemo(() => repositories
    .filter((item) => item.name.toLowerCase().indexOf(debounceSearchTerm.toLowerCase()) > -1)
    .map(repo => ({
      repo: {
        name: repo.name,
        isActive: true,
        id: repo._id,
      },
      lastCommentDate: repo.updatedAt ? format(new Date(repo.updatedAt), 'yyyy-MM-dd') : '-',
      totalComments: repo.repoStats?.smartComments || '-',
    })), [repositories, debounceSearchTerm]);

  const addRepos = async () => {
    try {
      await dispatch(editOrganizationRepos(organization._id, { repos: Array(...activeRepos) }, token));
      dispatch(fetchOrganizationRepos({ organizationId: organization._id }, token));
      dispatch(triggerAlert('Repos were added', 'success'));
      onClose();
    } catch (e) {
      dispatch(triggerAlert('Unable to add repos', 'error'));
    }
  };
  if (!organization) {
    return null
  }
  return (
    <div className={clsx('modal', isActive && 'is-active')}>
      <div className="modal-background" />
      <div className="modal-content p-50" style={{ width: 950 }}>
        <div className="is-relative has-background-white px-40 py-30 is-rounded border-radius-8px">
          <div className="is-flex is-align-items-center is-justify-content-space-between mb-20">
            <p className="is-size-4 has-text-weight-semibold is-size-3-mobile">
              Choose Repos for {organization.name}
            </p>
            <CloseIcon onClick={onClose} />
          </div>
          <p className="is-size-7 mb-15">Remember, adding the selected repos will give your organization full access to code review information</p>
          <div className="control mb-10">
            <InputField
              className="has-background-white is-small border-radius-4px"
              type="input"
              placeholder="Search the repo"
              value={searchTerm}
              onChange={(searchValue) => setSearchTerm(searchValue)}
              iconLeft={<SearchIcon size="small" />}
            />
          </div>
          {isFetchingAdminRepos ? (
            <Loader />
          ) : (
            <Table
              className="no-border border-radius-8px"
              data={data}
              columns={columns}
              minimal
            />
          )}
          <div className="field is-grouped mt-25 is-flex is-justify-content-space-between sema-is-align-items-center">
            <div className="is-flex is-align-items-center is-size-7 mr-70">
              When you write or receive code reviews on GitHub using Sema, your repo will display here.
            </div>
            <div className="control">
              <button onClick={onClose} className="button mr-16" type="button">Cancel</button>
              <button
                onClick={addRepos}
                className={'button is-primary is-pulled-right'}
                disabled={activeRepos.size === 0}
              >
                Add {activeRepos.size}
                {activeRepos.size === 1 ? ' Repo' : ' Repos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationReposList;
