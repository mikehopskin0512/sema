import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { content } from './content';
import styles from './onboarding.module.scss';

import { authOperations } from '../../state/features/auth';

const { trackOnboardingCompleted } = authOperations;

const ContentPage = ({
  page, nextPage, previousPage, isPluginInstalled, closeModal,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [img, setImg] = useState('');
  const [animationData, setAnimationData] = useState('');

  useEffect(() => {
    setTitle(content[page - 1].title);
    setSubtitle(content[page - 1].subtitle);
    setImg(content[page - 1].img);
    setAnimationData(content[page - 1].animationData);
  }, [page]);

  const handleOnClick = () => {
    trackOnboardingCompleted();
    closeModal();
  };

  return (
    <>
      <div className="columns m-0 is-full-height" style={{}}>
        <div className="is-flex is-justify-content-space-between is-align-items-center p-15 is-hidden-desktop">
          <p className="has-text-primary has-text-weight-semibold is-size-4 p-5">Here's how it works</p>
          <button className="button is-white" onClick={handleOnClick}>
            <FontAwesomeIcon className="is-clickable" icon={faTimes} size="lg" />
          </button>
        </div>
        <div className={clsx('column is-flex is-justify-content-center is-6 p-25', styles['animation-container'])}>
          <div className={clsx('is-flex is-justify-content-center is-align-items-center')}>
            {/* <img src={img} alt="sema-img" className="is-full-width" /> */}
            <div className={styles.relative}>
              {animationData ? (
                <>
                  <div className={styles['animation-gradient']} />
                  <Lottie
                    play
                    loop
                    animationData={animationData}
                  />
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
        <div className="column is-6 p-20 px-40 is-relative is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="is-flex is-justify-content-space-between is-align-items-center is-hidden-touch">
            <p className="has-text-primary has-text-weight-semibold is-size-5 p-5">Here's how it works</p>
            <button className="button is-white" onClick={handleOnClick}>
              <FontAwesomeIcon className="is-clickable" icon={faTimes} />
            </button>
          </div>
          <div className={styles.info}>
            <p className={clsx('mb-20 is-size-4 has-text-weight-semibold has-text-black-950 ')}>{title}</p>
            <p className={clsx('mt-20')}>{subtitle}</p>
          </div>
          <div className={clsx('is-flex is-justify-content-space-between is-align-items-center mb-10', styles.footer)}>
            {
              page !== 1 ? (
                <button
                  type="button"
                  className={clsx('button is-primary is-outlined')}
                  onClick={previousPage}
                >
                  <FontAwesomeIcon icon={faArrowLeft} color="primary" size="lg" />
                </button>
              ) : <div className={styles.space} />
            }
            <ul className={styles.ul}>
              <li className={page === 1 ? styles.active : null} />
              <li className={page === 2 ? styles.active : null} />
              <li className={page === 3 ? styles.active : null} />
              { !isPluginInstalled ? (<li className={page === 4 ? styles.active : null} />) : '' }
            </ul>
            {page === 3 && isPluginInstalled ? (
              <button
                type="button"
                className={clsx('button is-primary')}
                onClick={handleOnClick}
              >
                Done
              </button>

            ) : (
              <button
                type="button"
                className={clsx('button is-primary')}
                onClick={nextPage}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

ContentPage.propTypes = {
  page: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ContentPage;
