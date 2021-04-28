import clsx from 'clsx';
import styles from './footer.module.scss';

const Footer = () => (
  <footer className={clsx('', styles.footer)}>
    <div className={clsx('tile is-ancestor is-align-items-center', styles.tile)}>
      <div className="tile is-child has-text-primary-light has-text-centered">
        &copy; {new Date().getFullYear()} Sema
      </div>
      <div className="tile is-child has-text-centered">
        <a className="button is-ghost has-text-primary-light" href="#">Dashboard</a>
      </div>
      <div className="tile is-child has-text-centered">
        <a className="button is-ghost has-text-primary-light" href="#">Terms and Conditions</a>
      </div>
      <div className="tile is-child has-text-centered">
      <a className="button is-ghost has-text-primary-light" href="#">Send Feedback</a>
      </div>
    </div>
  </footer>
);

export default Footer;
