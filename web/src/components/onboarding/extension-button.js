import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './onboarding.module.scss';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

export default function ExtensionButton({ isInstalled }) {
  if (!isInstalled) {
    return (
      <>
        <button
          type="button"
          className="button is-primary has-text-weight-semibold mt-25"
          onClick={() => window.open(EXTENSION_LINK, '_blank')}
        >
          <img src="/img/onboarding/google-extension.png" alt="install" className={clsx("mr-10", styles['chrome-button'])} />
          Add Extension Here
        </button>
      </>
    );
  }
  return (
    <div className="is-flex is-align-items-center mt-25">
      <FontAwesomeIcon icon={faCheckCircle} className="has-text-primary mr-10" size="lg" />
      <p>Extension Added</p>
    </div>
  );
};