import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { content } from './content';

const ContentPage = ({ page, nextPage, previousPage }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    setTitle(content[page - 1].title);
    setSubtitle(content[page - 1].subtitle);
  }, [page]);

  return (
    <>
      <div className="columns">
        <div className="column">
          <p className="mt-200 mb-20 title">{title}</p>
          <p className="mt-20 mb-200 subtitle">{subtitle}</p>
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
        <div className="column" style={{ backgroundColor: "#E4E4E4" }}>
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
