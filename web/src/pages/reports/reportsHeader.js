import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ReportsHeader = () => {
  return (
    <div>
      <nav className="navbar has-background-primary" role="navigation" aria-label="main navigation">
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
              <button type="button" className="button is-small is-primary is-inverted is-outlined margin-right-1">
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
      <div className="columns has-background-white-ter">
<div className="column">
<div class="columns is-mobile">
  <div class="column is-half is-offset-one-quarter">Filters</div>
</div>      
</div>
      </div>
    </div>
  );
};

export default ReportsHeader;
