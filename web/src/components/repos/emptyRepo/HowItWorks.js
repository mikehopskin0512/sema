import React, { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './emptyRepo.module.scss';
import SupportForm from '../../supportForm';
import Select from '../../activity/select';
import { SUPPORT_VIDEO_LANGUAGES, SEMA_FAQ_URL } from '../../../utils/constants';

const HowItWorks = () => {
  const [language, setLanguage] = useState(SUPPORT_VIDEO_LANGUAGES[0]);
  const [supportForm, setSupportForm] = useState(false);

  const openSupportForm = () =>  setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  return(
    <div className={clsx("has-background-white border-radius-4px p-40 mb-50", styles.container)}>
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="has-text-centered">
        <p className="has-text-weight-semibold is-size-5">See how it works</p>
        <p>Sema supercharges your GitHub snippets with snippets, summaries, and tags.</p>
        <img src="/img/no-repos.svg" className="mt-60" />
        <span className="has-text-weight-semibold">
          Learn more about <Link href={`${SEMA_FAQ_URL}#what-do-summaries-mean`}><span className="has-text-primary is-clickable is-underlined">Summaries and Tags</span></Link>
        </span>
      </div>
      <div className="is-divider" />
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
  )
}

export default HowItWorks;