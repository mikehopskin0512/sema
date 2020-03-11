import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SelectDevelopers from './selectDevelopers';

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

        <div id="navbarBasicExample" className="navbar-menu">


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
      <div className="columns has-background-white-ter is-hidden" ref={filterMenu}>
        <div className="column">
          <div className="columns is-mobile">
            <div className="column is-half is-offset-one-quarter">
              <SelectDevelopers updateFilters={updateFilters} />
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
