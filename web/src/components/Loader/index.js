import React from 'react';
import Logo from '../Logo';

const Loader = ({ customText }) => (
  <div className="is-flex is-align-content-center is-align-items-center is-flex-direction-column is-justify-content-center p-20">
    <Logo width={60} height={60} />
    <p className="has-text-weight-semibold mt-20">{customText ?? 'Warming up the photons...'}</p>
  </div>
);

export default Loader;
