import Link from 'next/link';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateRangeFilter from './dateRangeFilter';
import MultiSelectFilter from './multiSelectFilter';
import styles from './reportsHeader.module.scss';
import { reportsOperations } from '../../state/features/reports';
import { organizationsOperations } from '../../state/features/organizations';
import { PATHS } from '../../utils/constants';
import useAuthEffect from '../../hooks/useAuthEffect';

const { downloadPdf } = reportsOperations;
const { fetchFilterLists, toggleFilters, clearFilters } = organizationsOperations;

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

  // TEMP: Hardcode orgId to 84 until we can make connection between orgs in PG DB
  // const { user: { orgId } } = auth;
  const orgId = 84;
  const { updateFilters } = props;

  useAuthEffect(() => {
    dispatch(fetchFilterLists(orgId, auth.token));
  }, [orgId]);

  const {
    repositories = [],
    contributors = [],
    fileTypes = [],
    showFilters,
    currentFilters,
  } = organizations;
  const { reportId, reportTitle, runToken } = reports;

  const repositoriesList = repositories.map((repository) => (
    {
      value: repository.id,
      label: repository.name,
    }
  ));

  const contributorsList = contributors.map((contributor) => (
    {
      value: contributor.id,
      label: contributor.name,
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
    dispatch(toggleFilters(!showFilters));
  };

  return (
    <div>
      <nav className={`level is-marginless has-background-white-ter is-mobile ${styles['report-header']}`}>
        {/* -- Left side -- */}
        <div className="level-left">
          <div className="level-item">
            <Link href={`${PATHS.REPORTS}/`}><span><FontAwesomeIcon icon="arrow-left" />&nbsp;&nbsp;&nbsp;Report list</span></Link>
          </div>
        </div>

        {/* -- Right side -- */}
        <div className="level-right">
          <div className="level-item">
            <button
              type="button"
              className="button is-outlined mr-1r"
              onClick={toggleFilterMenu}>
              <span className="icon">
                <FontAwesomeIcon icon="filter" />
              </span>
              <span>{(showFilters) ? 'Hide' : 'Show'} filters</span>
            </button>
            <a href='#' onClick={handlePdfDownload} aria-label="Download"><FontAwesomeIcon icon="cloud-download-alt" className="is-size-4 has-text-black" /></a>
          </div>
        </div>
      </nav>

      <div className={`columns is-marginless has-background-white-ter ${!showFilters && 'is-hidden'}`} ref={filterMenu}>
        <div className="column is-11 is-offset-1">
          <div className="columns">
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
                selectData={contributorsList}
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
            <div className="column">
              <button
                type="button"
                className="button is-inverted is-outlined"
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
