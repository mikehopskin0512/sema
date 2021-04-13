import withLayout from '@/components/layout';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Loader from 'react-loader-spinner';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { isExtensionInstalled } from 'src/utils/extension';

import styles from './invite.module.scss';

const Invite = () => {
  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [title, setTitle] = useState('You&apos;re almost there!');
  const [buttonText, setButtonText] = useState('Install Chrome Package');
  const [body2, setBody2] = useState('Learn more about Sema while you wait...');
  const [loading, setLoading] = useState(false);
  const [isCardVisible, toggleCard] = useState(true);

  useEffect(() => {
    if (isPluginInstalled) {
      setTitle('Install Complete');
      setButtonText('Done');
      setBody2('Here&apos;s how to use Sema');
    }
  }, [isPluginInstalled]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await isExtensionInstalled();
      togglePluginInstalled(res);
      setLoading(false);
    })();
  }, []);

  const buttonAction = () => {
    if (isPluginInstalled) {
      toggleCard(false);
      return;
    }
    const EXTENSION_LINK =
      'https://chrome.google.com/webstore/detail/code-review-assistant/nompfgddpldjighjfnkncgehjdbcphbf';
    window.open(EXTENSION_LINK, '_blank');
  };

  const renderIcon = () => {
    if (!isPluginInstalled) {
      return (
        <div className={clsx(styles.loader)}>
          <Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
          <p>Searching for plugin...</p>
        </div>
      );
    }
    return (
      <>
        <div className={clsx(styles.loader)}>
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="6x"
            className={styles.block}
          />
          <p>Extension Installed!</p>
        </div>
      </>
    );
  };

  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <div className={clsx('container', styles['styled-container'])}>
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <article className="tile is-child has-text-centered">
                  <p className={clsx('title is-size-1', styles.title)}>
                    Welcome to Sema!
                  </p>
                </article>
              </div>
            </div>
            <PluginStateCard
              title={title}
              buttonText={buttonText}
              loading={loading}
              isCardVisible={isCardVisible}
              buttonAction={buttonAction}
              renderIcon={renderIcon}
            />
            <p
              className={clsx(
                'title has-text-centered has-text-weight-semibold is-size-4',
                styles.body2
              )}
              dangerouslySetInnerHTML={{ __html: body2 }}
            />
            <div className="tile is-ancestor">
              <div className="tile is-parent is-vertical">
                <div className={clsx('tile is-child', styles['img-filler'])} />
                <article className="tile is-child">
                  <p className={clsx(styles.circular)}>2</p>
                  <p className={clsx('subtitle', styles.padded)}>
                    Type some texts, code suggestion will be highlighted
                  </p>
                </article>
              </div>
              <div className="tile is-parent is-vertical">
                <div className={clsx('tile is-child', styles['img-filler'])} />
                <article className="tile is-child">
                  <p className={clsx(styles.circular)}>3</p>

                  <p className={clsx('subtitle', styles.padded)}>
                    Click on an highlighted word to get smart code reviews.
                  </p>
                </article>
              </div>
              <div className="tile is-parent is-vertical">
                <div className={clsx('tile is-child', styles['img-filler'])} />
                <article className="tile is-child">
                  <p className={clsx(styles.circular)}>4</p>
                  <p className={clsx('subtitle', styles.padded)}>
                    Open Sema Chrome Plugin to search for lorem ipsum.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const PluginStateCard = ({
  title,
  buttonText,
  loading,
  isCardVisible,
  buttonAction,
  renderIcon,
}) => {
  return (
    <div className={clsx('tile is-ancestor', !isCardVisible && styles.remove)}>
      <div className="tile is-parent">
        <article
          className={clsx(
            'tile is-child notification has-background-white has-text-centered',
            styles['styled-tile']
          )}
        >
          <p
            className={clsx('title is-size-3', styles['styled-title'])}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className={clsx('subtitle', styles.body)}>
            The Sema Chrome Plugin allows us to modify the Github commenting UI
            and supercharge your code review workflow
          </p>
          {renderIcon()}
          <button
            type="button"
            className="button has-background-black has-text-white"
            onClick={buttonAction}
          >
            {buttonText}
          </button>
        </article>
      </div>
    </div>
  );
};

export default withLayout(Invite);
