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
          className="button is-primary has-text-weight-semibold mt-25 p-0 pr-15"
          onClick={() => window.open(EXTENSION_LINK, '_blank')}
        >
          <img src="/img/icons/svg/download.svg" alt="install" className={clsx("mx-15 my-18")} />
          Add Extension Here
        </button>
      </>
    );
  }
  return (
    <div className="is-flex is-align-items-center mt-25">
      <img src="/img/icons/svg/green-check.svg"></img>
      <p className="has-text-black-900 has-text-weight-semibold ml-15">Extension Installed</p>
    </div>
  );
};