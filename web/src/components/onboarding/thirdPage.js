import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'

const SecondPage = ({ nextPage, previousPage }) => {
  const [title] = useState('Smart Tags');
  const [subtitle] = useState('Write great comments faster by quickly search for and insert pre-written comments from some of the best knowledge bases in the world, and add your own!');

  return (
    <>
      <div className="columns">
        <div className="column">
          <p className="mt-200 mb-20 title">{title}</p>
          <p className="mt-20 mb-200 subtitle">
            {subtitle}
          </p>
          <button
            type="button"
            className="button is-primary my-20 is-outlined"
            onClick={nextPage}
          >
            <FontAwesomeIcon icon={faArrowLeft} color="white" size="lg" />
          </button>
          <button
            type="button"
            className="button is-primary my-20 is-pulled-right"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
        <div class="column" style={{ backgroundColor: "#E4E4E4" }}>
        </div>
      </div>
    </>
  )
}

export default SecondPage
