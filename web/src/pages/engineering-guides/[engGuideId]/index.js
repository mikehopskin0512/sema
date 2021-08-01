import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import ContactUs from '../../../components/contactUs';
import CommentFilter from '../../../components/comment/commentFilter';
import EngGuideTable from '../../../components/engGuides/engGuideTable';
import withLayout from '../../../components/layout';
import SupportForm from '../../../components/supportForm';
import Helmet from '../../../components/utils/Helmet';

import { commentsOperations } from '../../../state/features/comments';

const NUM_PER_PAGE = 10;

const CollectionEngGuides = () => {
  const router = useRouter();
  const [supportForm, setSupportForm] = useState(false);
  const [tagFilters, setTagFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const { auth, engGuides } = useSelector((state) => ({
    auth: state.authState,
    engGuides: state.engGuidesState,
  }));

  const { engGuideId } = router.query;
  const { token, userVoiceToken } = auth;

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  const onSearch = ({ search, tag, language }) => {
    console.log({ search, tag, language });
  }

  return (
    <div className="has-background-gray-9 hero">
      <Helmet title="Engineering Guide" />
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="hero-body">
        <div className="is-flex is-align-items-center px-10 mb-15">
          <a href="/collections" className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/collections" className="has-text-grey">Community Eng Guides</a></li>
              <li className="is-active has-text-weight-semibold"><a href={`/engineering-guidelines/${engGuideId}`}>nem</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex is-flex-wrap-wrap p-10 is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            nem
          </p>
          <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
            3 suggested comments
          </span>
        </div>
        <CommentFilter onSearch={onSearch} tags={tagFilters} languages={languageFilters} />
        <EngGuideTable />
      </div>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm} />
    </div>
  );
};

export default withLayout(CollectionEngGuides);
