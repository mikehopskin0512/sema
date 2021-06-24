import clsx from 'clsx';
import { useState } from 'react';
import styles from './footer.module.scss';
import SupportForm from '../supportForm';

const Footer = () => {
  const [dashboardLink] = useState('https://app.semasoftware.com');
  const [termsAndConditionsLink] = useState('https://semasoftware.com/terms-and-conditions');
  const [supportForm, setSupportForm] = useState(false);

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  return (
    <footer className={styles.footer}>
      <SupportForm active={supportForm} closeForm={closeSupportForm} type="Feedback" />
      <div className="columns is-vcentered is-centered">
        <div className={clsx('column is-one-quarter-fullhd is-1-desktop', styles.tile)} />
        <div className="column has-text-primary-light has-text-centered">
          &copy; {new Date().getFullYear()} Sema
        </div>
        <div className="column has-text-centered">
          <a className="button is-ghost has-text-primary-light" href={"/"}>Dashboard</a>
        </div>
        <div className="column has-text-centered">
          <a className="button is-ghost has-text-primary-light" href={termsAndConditionsLink}>Terms and Conditions</a>
        </div>
        <div className="column has-text-centered">
          <div className="button is-ghost has-text-primary-light is-size-m-desktop" onClick={openSupportForm}>Send Feedback</div>
        </div>
        <div className="column is-one-quarter-fullhd is-1-desktop" />
      </div>
    </footer>
  );
};

export default Footer;
