import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import useLocalStorage from '../../hooks/useLocalStorage';
import { isExtensionInstalled } from '../../utils/extension';
import styles from './extensionStatus.module.scss';
import { CodeIcon } from '../Icons';
import { PATHS } from '../../utils/constants';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const ExtensionStatus = () => {
  const [isActive, setActive] = useLocalStorage('sema_extension_active', 'true');
  const { route } = useRouter();
  const buttonAction = () => {
    window.open(EXTENSION_LINK, '_blank');
  };

  const isHidden = () => {
    const enabledPaths = [
      PATHS.OVERVIEW, PATHS.REPO,
      PATHS.DASHBOARD, PATHS.SNIPPETS._,
      PATHS.SUPPORT, PATHS.PROFILE,
      PATHS.GUIDES, PATHS.INVITATIONS,
      PATHS.PERSONAL_INSIGHTS, PATHS.ORGANIZATION_INSIGHTS];
    let hidden = true;
    enabledPaths.forEach((item) => {
      if (route.includes(item)) {
        hidden = false;
      }
    });
    return hidden || isActive;
  };
  useEffect(() => {
    let unmounted = false;
    function checkExtensionStatus() {
      isExtensionInstalled().then((res) => {
        if (!unmounted) {
          setActive(res);
        }
      });
    }
    checkExtensionStatus();
    const interval = setInterval(checkExtensionStatus, 5000);
    return () => {
      unmounted = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={clsx(styles['status-container'], isHidden() && 'is-hidden')}>
      <div className="hero content-container">
        <div className="hero-body py-15">
          <div className="is-flex m-0 is-align-items-center is-flex-wrap-wrap is-justify-content-space-between">
            <div className="is-flex is-align-items-center">
              <div className="mr-20 is-hidden-mobile">
                <CodeIcon />
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
