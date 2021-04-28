import clsx from 'clsx';
import { useState } from 'react';
import styles from './footer.module.scss';

const Footer = () => {
  const [dashboardLink] = useState('https://app.semasoftware.com');
  const [termsAndConditionsLink] = useState('https://semasoftware.com/terms-and-conditions');
  const [semaEmail] = useState('feedback@semasoftware.com');

  return (
    <footer className={clsx('', styles.footer)}>
      <div className={clsx('tile is-ancestor is-align-items-center', styles.tile)}>
        <div className="tile is-child has-text-primary-light has-text-centered">
          &copy; {new Date().getFullYear()} Sema
        </div>
        <div className="tile is-child has-text-centered">
          <a className="button is-ghost has-text-primary-light" href={dashboardLink}>Dashboard</a>
        </div>
        <div className="tile is-child has-text-centered">
          <a className="button is-ghost has-text-primary-light" href={termsAndConditionsLink}>Terms and Conditions</a>
        </div>
        <div className="tile is-child has-text-centered">
          <a className="button is-ghost has-text-primary-light" href={`mailto:${semaEmail}?subject=Product Feedback`}>Send Feedback</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
