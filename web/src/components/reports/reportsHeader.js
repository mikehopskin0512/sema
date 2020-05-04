import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateRangeFilter from './dateRangeFilter';
import MultiSelectFilter from './multiSelectFilter';

import { reportsOperations } from '../../state/features/reports';
import { organizationsOperations } from '../../state/features/organizations';

const { downloadPdf } = reportsOperations;
const { fetchFilterLists, clearFilters } = organizationsOperations;

const ReportsHeader = (props) => {
  // Create REFs for menus
  const filterMenu = useRef(null);
  const dispatch = useDispatch();

  // Import state vars
  const { auth, organizations, reports } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsState,
      reports: state.reportsState,
    }),
  );

  const { user: { organization_id: orgId } } = auth;
  const { updateFilters } = props;

  useEffect(() => {
    dispatch(fetchFilterLists(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { repositories, developers, fileTypes, currentFilters } = organizations;
  const { reportId, reportTitle, runToken } = reports;

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

  const handlePdfDownload = () => {
    if (reportId && runToken) {
      dispatch(downloadPdf(reportId, reportTitle, runToken, auth.token));
    } else {
      alert('PDF is still being generated. Try again shortly.');
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

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
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
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
              <a href='#' onClick={handlePdfDownload} aria-label="Download"><FontAwesomeIcon icon="cloud-download-alt" className="has-text-white" /></a>
            </div>
          </div>
        </div>
      </nav>
      <div className="columns is-marginless has-background-white-ter is-hidden" ref={filterMenu}>
        <div className="column is-11 is-offset-1">
          <div className="columns is-vcentered">
            <div className="column">
              <MultiSelectFilter
                updateFilters={updateFilters}
                selectData={repositoriesList}
                currentFilters={currentFilters}
                paramName="param_z_repositories"
                placeholder="Repositories" />
            </div>
            <div className="column">
              <MultiSelectFilter
                updateFilters={updateFilters}
                selectData={developersList}
                currentFilters={currentFilters}
                paramName="param_z_developers"
                placeholder="Developers" />
            </div>
            <div className="column">
              <MultiSelectFilter
                updateFilters={updateFilters}
                selectData={fileTypesList}
                currentFilters={currentFilters}
                paramName="param_z_fileTypes"
                placeholder="File Types" />
            </div>
            <div className="column">
              <DateRangeFilter
                updateFilters={updateFilters}
                currentFilters={currentFilters}
                paramStartDate="param_z_date_start"
                paramEndDate="param_z_date_end" />
            </div>
            <div className="column is-1">
              <button
                type="button"
                className="button is-inverted is-outlined is-small"
                onClick={handleClearFilters}>Clear
              </button>
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
