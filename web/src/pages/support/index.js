import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { InputField } from 'adonis';
import { useSelector } from 'react-redux';
import Helmet, { HelpSupportHelmet } from '../../components/utils/Helmet';
import styles from './support.module.scss';
import withLayout from '../../components/layout';
import { KNOWLEDGE_BASE_TITLES, KNOWLEDGE_BASE, SEMA_INTERCOM_URL } from '../../utils/constants';
import HowItWorks from '../../components/repos/emptyRepo/HowItWorks';
import * as analytics from '../../utils/analytics';
import { SupportIcon, SemaCircleIcon, SearchIcon } from '../../components/Icons'
import SupportForm from '../../components/supportForm';
import { supportOperations } from '../../state/features/support';

function HelpAndSupport() {
  const [supportForm, setSupportForm] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [articles, setArticles] = useState([{}]);
  const [filteredArticles, setFilteredArticles] = useState([{}]);
  const { fetchKnowledgeBase } = supportOperations;
  const { token } = useSelector((state) => state.authState);

  const openSupportForm = () => {
    setSupportForm(true);
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_CONTACT_SUPPORT, {});
  };
  const closeSupportForm = () => setSupportForm(false);

  const renderContactUs = () => (
    <div className={clsx("has-background-gray-100 has-text-centered is-flex is-flex-direction-row is-align-items-center is-justify-content-center", styles['contact-wrapper'])}>
      <div className={clsx('mr-16', styles['icon-wrapper'])}>
        <SupportIcon />
      </div>
      <div className={styles['contact-us-container']}>
        <p className="has-text-weight-semibold has-text-black is-size-3 is-size-4-mobile px-20">Contact us</p>
        <p className='mt-32'>We will answer within 24 hours</p>
        <button type="button" className="button is-primary has-text-weight-semibold mt-12" onClick={() => openSupportForm('Support')}>Contact us via Email</button>
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="has-background-white py-60 has-text-centered container">
      <p className="has-text-weight-semibold has-text-black is-size-3 is-size-4-mobile px-20">Knowledge Base</p>
      <div className={`dropdown ml-5 is-full-width ${searchString.length > 2 && filteredArticles.length > 0 && 'is-active'}`}>
        <div className="dropdown-trigger is-full-width">
          <InputField
            className={clsx(styles['search-wrapper'])}
            type="text"
            placeholder="What would you like to find?"
            onChange={(value) => setSearchString(value)}
            value={searchString}
            iconLeft={<SearchIcon />}
          />
        </div>
        <div className={`dropdown-menu is-full-width pt-10 my-0 mx-auto ${styles['dropdown-container']}`} id="status-filter-popup" role="menu">
          <div className={`dropdown-content px-15 py-10 is-background-white ${styles['dropwdown-wrapper']}`}>
            {filteredArticles.map((article) => (
              <div key={article.id} className={`has-text-left is-clickable py-5 ${styles['search-item']}`} onClick={() => window.open(article.url, '_blank')}>
                <span className='is-size-7'>{article.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={clsx('mt-40 mb-32', styles['grid-container'])}>
        {KNOWLEDGE_BASE_TITLES.map((item) => (
          <div key={item.title}>
            <p className="has-text-weight-semibold has-text-black is-size-6 px-20">{item.title}</p>
          </div>
        ))}
        {KNOWLEDGE_BASE.map((item) => (
          <a key={item.description} href={item.link} target="_blank" rel="noreferrer">
            <div className={clsx('border-radius-8px is-clickable px-16 py-16', styles['article-item'])}>
              <div className='is-flex is-justify-content-center is-align-items-center'>
                <SemaCircleIcon className="mr-32" />
                <span className='has-text-black-900 has-text-left'>{item.description}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <a href={SEMA_INTERCOM_URL} target="_blank" className="has-text-weight-semibold has-text-blue-700 is-size-6" rel="noreferrer">View More</a>
    </div>
  );

  const fetchArticles = async () => {
    try {
      setArticles(await fetchKnowledgeBase(token));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchString.length > 2) {
      setFilteredArticles(articles.filter((article) => article.title.toLowerCase().includes(searchString.toLowerCase()) && article.url !== null));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString])

  useEffect(() => {
    if(filteredArticles.length > 5) setFilteredArticles((filteredArticle) => filteredArticle.splice(0,5));
  }, [filteredArticles])

  return (
    <div>
      <Helmet {...HelpSupportHelmet} />
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="has-background-white">
        <div className="py-50 has-text-centered">
          <p className="has-text-weight-semibold has-text-black is-size-3 is-size-4-mobile px-20">Help and Support</p>
        </div>
        <div className={clsx(styles['hiw-wrapper'])}>
          <HowItWorks />
        </div>
        {renderKnowledgeBase()}
      </div>
      {renderContactUs()}
    </div>
  );
}

export default withLayout(HelpAndSupport);
