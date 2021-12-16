import React from 'react';
import clsx from 'clsx';
import { articles } from '../../data/help';
import Helmet, { HelpSupportHelmet } from '../../components/utils/Helmet';
import styles from './support.module.scss';
import withLayout from '../../components/layout';
import { SEMA_FAQ_URL } from '../../utils/constants';
import HowItWorks from '../../components/repos/emptyRepo/HowItWorks';

const HelpAndSupport = () => {
  const renderArticle = ({
    author, id, title, date, mins, link,
  }) => (
    <a href={link} className={clsx("my-25", styles.article)} target="_blank" rel="noreferrer" key={`${id}-article`}>
      <div className="has-text-left p-10">
        <p className="has-text-weight-bold is-size-6 has-text-black-950">By {author}</p>
        <p className="has-text-weight-bold is-size-5 has-text-primary">{title}</p>
        <p className="is-size-7 has-text-black-950">{date} &#8226; {mins} minutes read</p>
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

  return (
    <div>
      <Helmet {...HelpSupportHelmet} />
      <div className="has-background-white">
        <div className="py-50 has-text-centered">
          <p className="has-text-weight-semibold has-text-black is-size-3 is-size-4-mobile px-20">Help and Support</p>
        </div>
        <div className="container">
          <HowItWorks />
        </div>
        <div className="has-background-white py-120 px-80 container">
          <div className="is-flex is-flex-wrap-wrap is-justify-content-space-evenly is-align-items-center">
            <div className="mb-25">
              <p className="has-text-weight-semibold has-text-black-950 is-size-3 is-size-4-mobile">Frequently asked questions</p>
              <p className="has-text-black-950 is-size-4 is-size-5-mobile mt-15">Check our FAQ page to learn more about Sema</p>
              <a href={SEMA_FAQ_URL} target="_blank" rel="noreferrer">
                <button className="button is-primary has-text-weight-semibold px-50 py-20 colored-shadow-small mt-25" type="button">FAQ page</button>
              </a>
            </div>
            <div>
              <img src="/img/ide-question.svg" alt="faq" />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-50">
        <div className="pt-50 has-text-centered px-120 is-hidden-touch container">
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
