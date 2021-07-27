import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { isExtensionInstalled } from '../../utils/extension';
import styles from "./extensionStatus.module.scss";

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const ExtensionStatus = () => {
  const { route } = useRouter();
  const [extensionStatus, setExtensionInstalled] = useState(false);

  const buttonAction = () => {
    window.location.href = EXTENSION_LINK;
  };

  const isHidden = () => {
    const enabledPaths = ['/stats', '/overview', '/activity'];
    let hidden = true;
    enabledPaths.forEach((item) => {
      if (route.includes(item)) {
        hidden = false;
      }
    });
    return hidden;
  };

  useEffect(() => {
    let interval;
    interval = setInterval(async () => {
      if (extensionStatus) {
        clearInterval(interval);
      }
      const result = await isExtensionInstalled();
      setExtensionInstalled(result);
    }, 5000);
  }, [])

  return (
    <div className={clsx(styles['status-container'], isHidden() && "is-hidden")}>
      <div className="columns m-0 is-align-items-center is-full-height ">
        <div className="column is-1">
          <img src="/img/code-logo.png" />
        </div>

        <div className="column is-9">
          <div>
            Install Chrome Plugin
          </div>
          <div>
            The Sema Chrome Plugin allows us to modify the Github commenting UI and supercharge you code review workflow.
          </div>
        </div>

        <div className="column is-2 ">
          <button
            type="button"
            className="button is-primary is-pulled-right"
            onClick={buttonAction}
          >
            Install Chrome Plugin
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExtensionStatus
