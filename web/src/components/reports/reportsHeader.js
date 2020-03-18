import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateRangeFilter from './dateRangeFilter';
import MultiSelectFilter from './multiSelectFilter';

import { organizationsOperations } from '../../state/features/organizations';

const { fetchFilterLists } = organizationsOperations;

const ReportsHeader = (props) => {
  // Create REFs for menus
  const filterMenu = useRef(null);
  const dispatch = useDispatch();

  // Import state vars
  const { auth, organizations } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsState,
    }),
  );

  const { user: { organization_id: orgId } } = auth;
  const { updateFilters } = props;

  useEffect(() => {
    dispatch(fetchFilterLists(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { repositories, developers, fileTypes } = organizations;

  const repositoriesList = repositories.map((repository) => (
    {
      value: repository.id,
      label: repository.name,
    }
  ));

  const developersList = developers.map((user) => (
    {
      value: user.id,
      label: `${user.first_name} ${user.last_name}`,
    }
  ));

  const fileTypesList = fileTypes.map((fileType) => (
    {
      value: fileType.id,
      label: fileType.typename,
    }
  ));

  const toggleFilterMenu = () => {
    if (filterMenu.current) {
      if (filterMenu.current.classList.contains('is-hidden')) {
        filterMenu.current.classList.remove('is-hidden');
      } else {
        filterMenu.current.classList.add('is-hidden');
      }
    }
  };

  return (
    <div>
      <nav className="navbar has-background-primary" style={{ zIndex: '1' }} role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item has-text-white">
            <FontAwesomeIcon icon="arrow-left" />&nbsp;&nbsp;&nbsp;<span>Report title goes here</span>
          </div>

          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <button
                type="button"
                className="button is-small is-primary is-inverted is-outlined margin-right-1"
                onClick={toggleFilterMenu}>
                <span className="icon">
                  <FontAwesomeIcon icon="filter" />
                </span>
                <span>Filter report</span>
              </button>
              <FontAwesomeIcon icon="cloud-download-alt" className="has-text-white" />
            </div>
          </div>
        </div>
      </nav>
      <div className="columns is-marginless has-background-white-ter is-hidden" ref={filterMenu}>
        <div className="column is-10 is-offset-1">
          <div className="columns">
            <div className="column">
              <MultiSelectFilter
                updateFilters={updateFilters}
                selectData={repositoriesList}
                paramName="param_z_repositories"
                placeholder="Repositories" />
            </div>
            <div className="column">
              <MultiSelectFilter
                updateFilters={updateFilters}
                selectData={developersList}
                paramName="param_z_developers"
                placeholder="Developers" />
            </div>
            <div className="column">
              <MultiSelectFilter
                updateFilters={updateFilters}
                selectData={fileTypesList}
                paramName="param_z_fileTypes"
                placeholder="File Types" />
            </div>
            <div className="column">
              <DateRangeFilter
                updateFilters={updateFilters}
                paramStartDate="param_z_date_start"
                paramEndDate="param_z_date_end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ReportsHeader.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default ReportsHeader;
