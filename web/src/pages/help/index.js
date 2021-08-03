import React from 'react';
import clsx from 'clsx';
import { chunk } from 'lodash';
import { articles } from '../../data/help';
import styles from './help.module.scss';
import withLayout from '../../components/layout';

const FAQLink = 'https://semasoftware.com/faq';

const HelpAndSupport = () => {
  const renderArticle = ({
    author, id, title, date, mins, link,
  }) => (
    <a href={link} className="is-flex-grow-1 my-25" target="_blank" rel="noreferrer" key={`${id}-article`}>
      <div className={clsx('has-text-left', styles.article)}>
        <p className="has-text-weight-bold is-size-6 has-text-deep-black">By {author}</p>
        <p className="has-text-weight-bold is-size-5 has-text-primary">{title}</p>
        <p className="is-size-7 has-text-deep-black">{date} &#8226; {mins} minutes read</p>
      </div>
    </a>
  );

  const renderBestPractices = () => (
    <>
      <p className="has-text-weight-semibold has-text-black is-size-2 is-size-4-mobile">Best Practices for Code Reviews</p>
      <div className="is-full-width my-50">
        { chunk(articles, 3).map((item) => (
          <div className="is-flex is-flex-wrap-wrap is-justify-content-space-evenly">
            {item.map((child) => renderArticle(child))}
          </div>
        )) }
      </div>
    </>
  );

  return (
    <div>
      <div className="my-50 has-text-centered">
        <p className="has-text-weight-semibold has-text-black is-size-2 is-size-4-mobile px-20">Help and Support</p>
      </div>
      <div className={clsx(
        'is-flex py-60 px-120 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap',
        styles['animation-container'],
      )}>
        <div className="is-flex-grow-2 is-flex-shrink-1 has-background-white p-60">
          {/* Animation 1 */}
        </div>
        <div className="is-flex-grow-2 is-flex-shrink-1 has-background-white p-60">
          {/* Animation 2 */}
        </div>
      </div>
      <div className="has-background-gray-9 pb-50">
        <div className="pt-50 has-text-centered px-120 is-hidden-mobile">
          {renderBestPractices()}
        </div>
        <div className="pt-50 has-text-centered px-20 is-hidden-desktop">
          {renderBestPractices()}
        </div>
      </div>
      <div className="has-background-white py-120 px-80">
        <div className="is-flex is-flex-wrap-wrap is-justify-content-space-evenly is-align-items-center">
          <div className="mb-25">
            <p className="has-text-weight-semibold has-text-deep-black is-size-3 is-size-4-mobile">Frequently asked questions</p>
            <p className="has-text-deep-black is-size-4 is-size-5-mobile mt-15">Check our FAQ page to learn more about Sema</p>
            <a href={FAQLink} target="_blank" rel="noreferrer">
              <button className="button is-primary has-text-weight-semibold px-50 py-20 colored-shadow-small mt-25" type="button">FAQ page</button>
            </a>
          </div>
          <div>
            <img src="/img/faq.png" alt="faq" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(HelpAndSupport);
