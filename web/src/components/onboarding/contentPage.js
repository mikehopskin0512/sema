import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { content } from './content';
import styles from './onboarding.module.scss';

const ContentPage = ({ page, nextPage, previousPage }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    setTitle(content[page - 1].title);
    setSubtitle(content[page - 1].subtitle);
    setImg(content[page - 1].img);
  }, [page]);

  return (
    <>
      <div className="columns m-0" style={{}}>
        <div className="column is-6 p-20 px-40">
          <p className={clsx('mt-250 mb-20 title', styles.title)}>{title}</p>
          <p className={clsx('mt-20 mb-200 subtitle', styles.subtitle)}>{subtitle}</p>
          {
            page !== 1 && (
              <button
                type="button"
                className="button is-primary my-20 is-outlined"
                onClick={previousPage}
              >
                <FontAwesomeIcon icon={faArrowLeft} color="primary" size="lg" />
              </button>
            )
          }
          <button
            type="button"
            className="button is-primary my-20 is-pulled-right"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
        <div className="column is-flex is-justify-content-center is-6 p-20" style={{ backgroundColor: '#F9F9F9' }}>
          <div className="is-flex is-justify-content-center is-align-items-center">
            <img src={img} alt="sema-img" className="is-full-width" />
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
};

export default ContentPage;
