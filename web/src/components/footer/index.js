import clsx from 'clsx';
import styles from './footer.module.scss';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="columns is-vcentered is-centered">
      <div className="column is-one-quarter-fullhd is-1-desktop" />
      <div className="column has-text-primary-light has-text-centered">
        &copy; {new Date().getFullYear()} Sema
      </div>
      <div className="column has-text-centered">
        <a className="button is-ghost has-text-primary-light" href="#">Dashboard</a>
      </div>
      <div className="column has-text-centered">
        <a className="button is-ghost has-text-primary-light" href="#">Terms and Conditions</a>
      </div>
      <div className="column has-text-centered">
        <a className="button is-ghost has-text-primary-light is-size-m-desktop" href="#">Send Feedback</a>
      </div>
      <div className="column is-one-quarter-fullhd is-1-desktop" />
    </div>
  </footer>
);

export default Footer;
