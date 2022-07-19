import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { range } from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { InputField } from 'adonis';
import { content } from './content';
import ExtensionButton from './extension-button';
import styles from './onboarding.module.scss';
import { useRouter } from 'next/router';

import { authOperations } from '../../state/features/auth';

const { trackOnboardingCompleted } = authOperations;

const SNIPPETS_PAGE = 1;
const SUMMARIES_PAGE = 2;
const TAGS_PAGE = 3;
const EXTENSION_PAGE = 4;

const TOTAL_PAGES = 4;

const ContentPage = ({
  page,
  nextPage,
  previousPage,
  isPluginInstalled,
  closeModal,
}) => {
  const [organizationName, setOrganizationName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState([]);
  const [img, setImg] = useState('');
  useEffect(() => {
    setTitle(content[page - 1].title);
    setSubtitle(content[page - 1].subtitle);
    setImg(content[page - 1].img);
  }, [page]);
  const Router = useRouter();

  const handleOnClick = () => {
    trackOnboardingCompleted();
    closeModal();
  };
  const isLastPage = page === TOTAL_PAGES;

  return (
    <>
      <div className="columns m-0 is-full-height" style={{}}>
        <div className="is-flex is-justify-content-space-between is-align-items-center p-15 is-hidden-desktop">
          <p className="has-text-primary has-text-weight-semibold is-size-4 p-5">
            {isLastPage ? 'One last step' : "Here's how it works"}
          </p>
          <button className="button is-white" onClick={handleOnClick}>
            <FontAwesomeIcon
              className="is-clickable has-text-weight-regular"
              icon={faTimes}
              size="lg"
            />
          </button>
        </div>
        <div
          className={clsx(
            'column is-flex is-justify-content-center is-6 p-25',
            styles['animation-container']
          )}
        >
          <div
            className={clsx(
              'is-flex is-justify-content-center is-align-items-center'
            )}
          >
            {/* <img src={img} alt="sema-img" className="is-full-width" /> */}
            <div className={styles.relative}>
              <img alt="" src={img} />
            </div>
          </div>
        </div>
        <div className="column is-6 p-40 is-relative is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="is-flex is-justify-content-space-between is-align-items-center is-hidden-touch">
            <p className="has-text-primary has-text-weight-semibold is-size-5 p-5">
              {isLastPage ? 'One last step' : "Here's how it works"}
            </p>
            <button className="button is-white" onClick={handleOnClick}>
              <FontAwesomeIcon className="is-clickable" icon={faTimes} />
            </button>
          </div>
          <div
            className={`${styles.info} is-flex is-flex-direction-column is-align-items-flex-start`}
          >
            <p
              className={clsx(
                'mb-20 is-size-3 has-text-weight-semibold has-text-black-900'
              )}
            >
              {title}
            </p>
            {subtitle &&
              subtitle.map((subtitleLine) => (
                <p className="has-text-black-900">{subtitleLine}</p>
              ))}
            {page === EXTENSION_PAGE && (
              <ExtensionButton isInstalled={isPluginInstalled} />
            )}
          </div>
          <div
            className={clsx(
              'is-flex is-justify-content-space-between is-align-items-center mb-10',
              styles.footer
            )}
          >
            {page !== 1 ? (
              <button className="button is-white" onClick={previousPage}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="has-text-black-900"
                  size="lg"
                />
              </button>
            ) : (
              <div className={styles.space} />
            )}
            <ul className={styles.ul}>
              {range(TOTAL_PAGES).map((index) => (
                <li
                  key={index}
                  className={clsx(page === index + 1 && styles.active)}
                />
              ))}
            </ul>
            {!isLastPage && (
              <button
                type="button"
                className={clsx(
                  'button is-primary has-text-weight-semibold',
                  styles.nextBtn
                )}
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
