import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { flatten, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import styles from '../../engineering.module.scss';

import ContactUs from '../../../../components/contactUs';
import SupportForm from '../../../../components/supportForm';
import Helmet from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';

import { engGuidesOperations } from '../../../../state/features/engGuides';

const { getEngGuides } = engGuidesOperations;

const EngineeringGuidePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [supportForm, setSupportForm] = useState(false);
  const [engGuideData, setEngGuideData] = useState();
  const { auth, engGuideState } = useSelector((state) => ({
    auth: state.authState,
    engGuideState: state.engGuidesState,
  }));

  const { token, userVoiceToken } = auth;
  const { engGuideId } = router.query;
  const { engGuides, isFetching } = engGuideState;

  useEffect(() => {
    dispatch(getEngGuides(token));
  }, [dispatch, token]);

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  useEffect(() => {
    const engGuidesList = flatten(engGuides.map((item) => {
      const { collectionData: { comments, name, _id } } = item;
      return {
        name,
        _id,
        data: comments.filter((comment) => comment._id === engGuideId)[0],
      };
    })).filter((item) => item.data);
    if (engGuidesList.length > 0) {
      setEngGuideData(engGuidesList[0]);
    }
  }, [engGuideId, engGuides]);

  const renderTags = (tagsArr) => {
    if (tagsArr.length > 0) {
      return tagsArr.map(
        (tag) => (
          <div
            key={`tag-${tag._id}`}
            className={clsx('tag is-uppercase is-rounded is-size-7 has-text-weight-semibold', tag.type === 'language' ? 'has-text-primary is-primary' : 'is-light')}>
            {tag.title}
          </div>
        ),
      );
    }
  };

  const formatText = (text) => {
    const newText = text.split('\n').map((str) => {
      if (
        str.toLowerCase() === 'introduction' ||
        str.toLowerCase() === 'rationale' ||
        str.toLowerCase() === 'examples' ||
        str.toLowerCase() === 'considerations'
      ) {
        return (
          <b className="py-10">{str}</b>
        );
      }
      if (str.toLowerCase() === 'links to learn more') {
        return (
          <div className="py">
            <div className="is-divider" />
            <b>{str}</b>
          </div>
        );
      }
      return <p className="pb-10">{str}</p>;
    });
    return newText;
  };

  return (
    <div className="hero">
      <Helmet title="Engineering Guide" />
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="hero-body">
        { engGuideData ? (
          <>
            <div className="is-flex is-align-items-center px-10 mb-15">
              <a href="/engineering" className="is-hidden-mobile">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
              </a>
              <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                  <li><a href="/engineering" className="has-text-grey">Community Eng Guides</a></li>
                  <li className="is-active has-text-weight-semibold"><a href={`/engineering/guide/${engGuideData._id}`}>{engGuideData.name}</a></li>
                </ul>
              </nav>
            </div>
            <div className="px-30 my-20">
              <div className="is-flex">
                <p className="mr-15 has-text-weight-semibold has-text-deep-black is-size-4">{engGuideData.data.title}</p>
                <div className="is-flex is-flex-wrap-wrap is-align-items-center">
                  {renderTags(engGuideData.data.tags)}
                </div>
              </div>
              <div className="is-flex my-10 is-align-items-center">
                <p className="is-underlined mr-15 has-text-deep-black">{isEmpty(engGuideData.data.author) ? 'user' : engGuideData.data.author}</p>
                {/* <p className="is-size-7 has-text-grey">Jan 10, 2021</p> */}
              </div>
              <div className="is-flex my-10 is-align-items-center">
                <p className="is-size-5 has-text-deep-black"><b>Source:</b> {engGuideData.data.source.name}</p>
                <div className="is-divider-vertical" />
                <p className="is-size-5 mr-15 has-text-deep-black"><b>Collection:</b> {engGuideData.name}</p>
              </div>
              <div
                className={clsx('has-background-white has-border-10px p-25 is-size-6', styles['body-container'])}>
                {formatText(engGuideData.data.body)}
              </div>
            </div>
          </>
        ) : 'Not found' }
      </div>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm} />
    </div>
  );
};

export default withLayout(EngineeringGuidePage);
