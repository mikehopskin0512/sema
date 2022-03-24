import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './emptyRepo.module.scss';
import SupportForm from '../../supportForm';
import Select from '../../activity/select';

import { SUPPORT_VIDEO_LANGUAGES, SEMA_FAQ_URL, SEMA_FAQ_SLUGS } from '../../../utils/constants';
import * as analytics from '../../../utils/analytics';

const HowItWorks = () => {
  const [language, setLanguage] = useState(SUPPORT_VIDEO_LANGUAGES[0]);
  const [supportForm, setSupportForm] = useState(false);

  const openSupportForm = () =>  {
    setSupportForm(true);
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_CONTACT_SUPPORT, {});
  };
  const closeSupportForm = () => setSupportForm(false);

  const openSemaDocs = () => {
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_LEARN_MORE_ABOUT_SUMMARIES_AND_TAGS, {});
  };
  
  useEffect(() => {
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_ON_DIFFERENT_LANGUAGE_VIDEO, { language: language.label });
  }, [language]);

  return(
    <>
    <div className={clsx("has-background-blue-0 border-radius-4px p-40", styles.container)}>
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="has-text-centered">
        <p className="has-text-weight-semibold has-text-primary is-size-5 mb-10">See how it works</p>
        <p>Sema supercharges your GitHub reviews with snippets, summaries, and tags.</p>
        <div className="has-background-white mt-30">
          <img src="/img/no-repos3.svg" className="my-60" />
        </div>
      </div>
    </div>
    <div className="is-divider p-0 m-0" />
    <div className={clsx("has-background-white border-radius-4px p-40 mb-40", styles.container)}>
      <div className="is-flex is-justify-content-flex-end is-align-items-center mb-15">
        <p className="is-size-7 mr-10">Video Language</p>
        <Select
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
        />
      </div>
      <div className={styles['video-container']}>
        <iframe src={language.url} key={language.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <div className="has-text-centered is-flex is-flex-direction-column is-align-items-center mt-50">
        <p>Have more questions or want to get a personal demo?</p>
        <p>We'd love to show you. </p>
        <button type="button" className="button is-primary mb-20 has-text-weight-semibold mt-25" onClick={() => openSupportForm('Support')}>Contact Support</button>
      </div>
    </div>
    </>
  )
}

export default HowItWorks;