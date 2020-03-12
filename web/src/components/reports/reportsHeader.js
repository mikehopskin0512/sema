import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilterDateRange from './filterDateRange';
import FilterDevelopers from './filterDevelopers';
import FilterFileTypes from './FilterFileTypes';
import FilterRepositories from './filterRepositories';

const ReportsHeader = (props) => {
  // Create REFs for menus
  const filterMenu = useRef(null);

  const { updateFilters } = props;

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
              <FilterRepositories updateFilters={updateFilters} />
            </div>
            <div className="column">
              <FilterDevelopers updateFilters={updateFilters} />
            </div>
            <div className="column">
              <FilterFileTypes updateFilters={updateFilters} />
            </div>
            <div className="column">
              <FilterDateRange updateFilters={updateFilters} />
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
