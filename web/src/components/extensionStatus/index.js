import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { isExtensionInstalled } from '../../utils/extension';
import styles from './extensionStatus.module.scss';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const ExtensionStatus = () => {
  const { route } = useRouter();
  const [extensionStatus, setExtensionInstalled] = useState(true);

  const buttonAction = () => {
    window.open(EXTENSION_LINK, '_blank');
  };

  const isHidden = () => {
    const enabledPaths = ['/overview', '/repo', '/dashboard', '/suggested-comments', '/support', '/profile', '/guides', '/invitations', '/personal-insights'];
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
  }, [extensionStatus]);

  useEffect(() => {
    (async () => {
      const result = await isExtensionInstalled();
      setExtensionInstalled(result);
    })();
  }, []);

  return (
    <div className={clsx(styles['status-container'], isHidden() && 'is-hidden', extensionStatus && 'is-hidden')}>
      <div className="hero content-container">
        <div className="hero-body py-15">
          <div className="is-flex m-0 is-align-items-center is-flex-wrap-wrap is-justify-content-space-between">
            <div className="is-flex is-align-items-center">
              <div className="mr-20 is-hidden-mobile">
                <img src="/img/code-logo.png" alt="sema-logo" />
              </div>
              <div className="my-10">
                <div className="has-text-weight-semibold">
                  Activate Chrome Plugin
                </div>
                <div>
                  The Sema Chrome Plugin allows us to modify the GitHub commenting UI and supercharge your code review workflow.
                </div>
              </div>
            </div>
            <div className="">
              <button
                type="button"
                className="button is-primary is-pulled-right"
                onClick={buttonAction}
              >
                Activate Chrome Plugin
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExtensionStatus;
