import React, { useState } from 'react';
import clsx from 'clsx';
import Lottie from 'react-lottie-player';
import { articles } from '../../data/help';
import { content } from '../../data/supportContent';
import Helmet, { HelpSupportHelmet } from '../../components/utils/Helmet';
import styles from './support.module.scss';
import withLayout from '../../components/layout';
import { SEMA_FAQ_URL } from '../../utils/constants';

const HelpAndSupport = () => {
  const [hovered, setHovered] = useState(null);

  const renderArticle = ({
    author, id, title, date, mins, link,
  }) => (
    <a href={link} className={clsx("my-25", styles.article)} target="_blank" rel="noreferrer" key={`${id}-article`}>
      <div className="has-text-left p-10">
        <p className="has-text-weight-bold is-size-6 has-text-deep-black">By {author}</p>
        <p className="has-text-weight-bold is-size-5 has-text-primary">{title}</p>
        <p className="is-size-7 has-text-deep-black">{date} &#8226; {mins} minutes read</p>
      </div>
    </a>
  );

  const renderBestPractices = () => (
    <>
      <p className="has-text-weight-semibold has-text-black is-size-2 is-size-4-mobile">Best Practices for Code Reviews</p>
      <div className="is-flex is-align-items-flex-start is-flex-wrap-wrap is-justify-content-space-between my-50">
        {articles.map((child) => renderArticle(child))}
      </div>
    </>
  );

  const onHover = (item) => {
    setHovered(item);
  }

  const onRemoveHover = () => {
    setHovered(null);
  }

  return (
    <div>
      <Helmet {...HelpSupportHelmet} />
      <div className="has-background-white">
        <div className="py-50 has-text-centered">
          <p className="has-text-weight-semibold has-text-black is-size-2 is-size-4-mobile px-20">Help and Support</p>
        </div>
        <div className={clsx(
          'is-flex is-justify-content-space-between is-align-items-stretch is-flex-wrap-wrap container',
          styles['animation-container'],
        )}>
          { content.map((item) => {
            const { img, animationData, title, subtitle } = item;
            return(
              <div
                key={title}
                className={clsx("p-30 mb-20 has-background-gray-4 border-radius-14px colored-shadow", styles.lottie)}
                onMouseEnter={() => onHover(title)}
                onMouseLeave={() => onRemoveHover()}
              >
                <div className="is-flex is-align-items-center" style={{ height: 300 }}>
                  {hovered === title ? (
                    <Lottie
                      loop
                      animationData={animationData}
                      play={hovered === title}
                    />
                  ) : (
                    <div className="is-full-height is-flex is-align-items-center is-justify-content-center">
                      <img src="/img/button-play.png" className={clsx(styles['button-play'], hovered === title ? 'is-invisible' : '')} />
                      <img src={img} className={styles.img} />
                    </div>
                  )}
                </div>
                <p className="is-size-5 mb-10 has-text-weight-semibold has-text-primary">{title}</p>
                <p className="is-size-57 has-text-deep-black mb-20">{subtitle}</p>
              </div>
            )
          }) }
        </div>
        <div className="has-background-white py-120 px-80 container">
          <div className="is-flex is-flex-wrap-wrap is-justify-content-space-evenly is-align-items-center">
            <div className="mb-25">
              <p className="has-text-weight-semibold has-text-deep-black is-size-3 is-size-4-mobile">Frequently asked questions</p>
              <p className="has-text-deep-black is-size-4 is-size-5-mobile mt-15">Check our FAQ page to learn more about Sema</p>
              <a href={SEMA_FAQ_URL} target="_blank" rel="noreferrer">
                <button className="button is-primary has-text-weight-semibold px-50 py-20 colored-shadow-small mt-25" type="button">FAQ page</button>
              </a>
            </div>
            <div>
              <img src="/img/faq.png" alt="faq" />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-50">
        <div className="pt-50 has-text-centered px-120 is-hidden-mobile container">
          {renderBestPractices()}
        </div>
        <div className="pt-50 has-text-centered px-20 is-hidden-desktop container">
          {renderBestPractices()}
        </div>
      </div>
    </div>
  );
};

export default withLayout(HelpAndSupport);