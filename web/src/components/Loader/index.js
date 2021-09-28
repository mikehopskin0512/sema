import React from 'react';

const LoadingScreen = () => {
  return(
    <div className="is-flex is-align-content-center is-align-items-center is-flex-direction-column is-justify-content-center p-20">
      <img src="/img/logo.png" alt="sema" width={60} className="mb-20" />
      <p className="has-text-weight-semibold">Warming up the photons...</p>
    </div>
  )
}

export default LoadingScreen;