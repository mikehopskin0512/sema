import React from 'react';

const ErrorPage = ({ type }) => (
  <div className="is-flex is-flex-direction-column is-justify-content-center is-full-height is-align-items-center is-flex-wrap-wrap">
    <img src="/img/icons/no-reactions-data.svg" alt="no-reactions" />
    <span className='is-size-4 has-text-black-950 has-text-weight-semibold mt-20 mb-4'>
      You do not have access to this portfolio
    </span>
    <p className="is-size-6 has-text-centered has-text-black-950 mt-8">
      The portfolio owner has restricted viewing access at this time.
    </p>
  </div>
);

export default ErrorPage;