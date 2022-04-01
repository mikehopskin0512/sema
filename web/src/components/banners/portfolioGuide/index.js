import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './portfolioGuide.module.scss';
import PortfolioGuideModal from '../../portfolios/guideModal';

const PortfolioGuideBanner = () => {
  const [isGuideModalActive, toggleGuideModal] = useState(false);
  return (
    <>
      <PortfolioGuideModal isActive={isGuideModalActive} onClose={() => toggleGuideModal(false)} />
      <div className={clsx(styles.banner, 'px-40 py-15 is-flex is-align-items-center mb-30')}>
        <div className="is-flex is-flex-direction-column">
          <span className="has-text-weight-semibold mr-10">Portfolios are designed to help you show off your hard work.</span>
          <span className="mr-20">Add some snapshots from your personal insights & activity log to get started.</span>
        </div>
        <div className={clsx(styles.hero, '')}>
          <img src="/img/hero-character.svg" alt="hero" />
        </div>
        <button type="button" className="button mr-30 has-text-weight-semibold" onClick={() => toggleGuideModal(true)}>Learn How It Works</button>
      </div>
    </>
  );
};

export default PortfolioGuideBanner;
