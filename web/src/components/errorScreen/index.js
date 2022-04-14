import { useState } from 'react';
import Link from 'next/link';
import { PATHS } from '../../utils/constants';
import SupportForm from '../../components/supportForm';
import styles from './errorScreen.module.scss';

export default function ErrorScreen({ imagePath, title, subtitle }) {
  const [supportForm, setSupportForm] = useState(false);

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  return (
    <div className={styles.container}>
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <img src={imagePath} />
      <p className="has-text-weight-semibold is-size-2 has-text-black">{title}</p>
      <p className="has-text-black has-text-centered">{subtitle}</p>
      <Link href={PATHS.DASHBOARD}>
        <a className="button is-primary my-50 px-40">Return to Dashboard</a>
      </Link>
      <button
        onClick={openSupportForm}
        className="button is-text has-text-black mb-10"
        type="button"
      >
        Contact us for help
      </button>
    </div>
  );
}
