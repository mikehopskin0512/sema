import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './emptyRepo.module.scss';
import SupportForm from '../../supportForm';
import * as analytics from '../../../utils/analytics';
import { KNOWLEDGE_BASE_SUMMARIES_URL, KNOWLEDGE_BASE_TAGS_URL, SUPPORT_VIDEO_LANGUAGES } from '../../../utils/constants';
import { SupportHeroBackIcon, SupportHeroFrontIcon } from '../../Icons';

function HowItWorks() {
  const [language] = useState(SUPPORT_VIDEO_LANGUAGES[0]);
  const [supportForm, setSupportForm] = useState(false);
  const closeSupportForm = () => setSupportForm(false);

  useEffect(() => {
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_ON_DIFFERENT_LANGUAGE_VIDEO, { language: language.label });
  }, [language]);

  return(
    <>
    <div className={clsx("has-background-blue-0 border-radius-4px p-40", styles.container)}>
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="has-text-centered">
        <p className="has-text-weight-semibold has-text-primary is-size-4 mb-10">See How Sema Works</p>
        <p>Sema supercharges your GitHub reviews with snippets</p>
        <p>summaries, and tags.</p>
        <div className='has-text-left'>
          <SupportHeroFrontIcon className={`ml-16 ${styles['front-hero']}`} />
        </div>
        <div className={`has-background-white border-radius-8px ${styles['image-container']}`}>
          <img alt="sema example" src="/img/no-repos3.svg" className="my-60" />
        </div>
        <SupportHeroBackIcon className={styles['back-hero']} />
        <p className='has-text-gray-700 has-text-weight-semibold'>{'Learn more about '}
          <a href={KNOWLEDGE_BASE_SUMMARIES_URL} target="_blank" className='has-text-primary is-underlined' rel="noreferrer">Summaries</a>
          {' and '} 
          <a href={KNOWLEDGE_BASE_TAGS_URL} target="_blank" className='has-text-primary is-underlined' rel="noreferrer">Tags</a>
        </p>
      </div>
    </div>
      <div className={`${styles['video-container']} mt-40`}>
        <iframe src={language.url} key={language.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <div className="is-flex is-justify-content-center is-align-items-center mb-15 mt-30 is-flex-direction-column">
        {/* Commented for a future video language implementation */}
        {/* <Select
          selectProps={{
            options: SUPPORT_VIDEO_LANGUAGES,
            placeholder: 'Choose Language',
            onChange: setLanguage,
            isMulti: false,
            isSearchable: false,
            closeMenuOnSelect: true,
          }}
          label={language ? language.label : 'Choose Language'}
          outlined
          small
          width={150}
        /> */}
        <p className="is-size-6">Have more questions or want to get a personal demo? <br /> 
          We'd love to show you.
        </p>
        <button 
          className="button is-primary border-radius-4px mt-24"
          type="button"
          onClick={() => setSupportForm(true)}
        >
          <span>Contact Support</span>
        </button>
        {}
      </div>
    </>
  )
}

export default HowItWorks;