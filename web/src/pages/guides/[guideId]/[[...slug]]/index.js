import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { flatten, get, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLinkedinIn, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { alertOperations } from '../../../../state/features/alerts';

const { triggerAlert, clearAlert } = alertOperations;

import styles from '../../guides.module.scss';

import Helmet from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import Toaster from '../../../../components/toaster';

import { engGuidesOperations } from '../../../../state/features/engGuides';

const { getEngGuides } = engGuidesOperations;

const initialEngGuideData = {
  name: '',
  _id: '',
  data: {
    author: '',
    body: '',
    collections: [],
    displayId: '',
    isActive: true,
    source: {
      name: '',
      url: '',
    },
    tags: [],
    title: '',
    _id: '',
  },
};

const EngineeringGuidePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [engGuideData, setEngGuideData] = useState(initialEngGuideData);
  const { auth, engGuideState, alerts } = useSelector((state) => ({
    auth: state.authState,
    engGuideState: state.engGuidesState,
    alerts: state.alertsState,
  }));

  const { token } = auth;
  const { query: { guideId, slug = '' }, asPath } = router;
  const { engGuides } = engGuideState;
  const {
    name,
    data,
    _id
  } = engGuideData;
  const {
    title = 'Guide',
    author = 'Sema User',
    tags,
    source,
    body
  } = data;

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${asPath}`;
  const { showAlert, alertType, alertLabel } = alerts;

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  useEffect(() => {
    dispatch(getEngGuides());
  }, [dispatch, token]);

  useEffect(() => {
    const engGuidesList = flatten(engGuides.map((item) => {
      const { collectionData: { comments = [], name = '', _id = '' } } = item;
      return {
        name,
        _id,
        data: comments.filter((comment) => comment._id === guideId)[0],
      };
    })).filter((item) => item.data);
    if (engGuidesList.length > 0) {
      setEngGuideData(engGuidesList[0]);
    }
  }, [guideId, engGuides]);

  const renderTags = (tagsArr) => {
    if (tagsArr.length > 0) {
      return tagsArr.map(
        (tag) => (tag.label && tag.type ? (
          <div
            key={`tag-${tag._id}`}
            className={clsx('tag is-uppercase is-rounded is-size-8 has-text-weight-semibold mr-5', tag.type === 'language' ? 'is-primary' : 'is-light')}>
            {tag.label}
          </div>
        ) : null),
      );
    }
  };

  const formatText = (text) => {
    const newText = text.split('\n').map((str, index) => {
      if (
        str.toLowerCase() === 'introduction' ||
        str.toLowerCase() === 'rationale' ||
        str.toLowerCase() === 'examples' ||
        str.toLowerCase() === 'considerations'
      ) {
        return (
          <b className="py-10" key={`str-${index}`}>{str}</b>
        );
      }
      if (str.toLowerCase() === 'links to learn more') {
        return (
          <div className="py" key={`str-${index}`}>
            <div className="is-divider" />
            <b>{str}</b>
          </div>
        );
      }
      return <p className="pb-10" key={`str-${index}`}>{str}</p>;
    });
    return newText;
  };

  return (
    <div className="hero">
      <Helmet title="Engineering Guide">
        <meta property='og:title' content={`Sema Software | Engineering Guide`}/>
        <meta property='og:image' content='/img/logo_white.png'/>
        <meta property='og:description' content={`Engineering Guide - ${name}: ${title} by ${author}`}/>
        <meta property='og:url' content={url} />
        <meta property='og:type' content='website' />
      </Helmet>
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert}
      />
      <div className="hero-body pb-300">
        { data ? (
          <>
            <div className="is-flex is-align-items-center px-10 mb-15" onClick={() => router.back()}>
              <a className="is-hidden-mobile">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
              </a>
              <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                  <li><a  className="has-text-grey">Community Engineering Guides</a></li>
                  <li className="is-active has-text-weight-semibold"><a>{name}</a></li>
                </ul>
              </nav>
            </div>
            <div className="px-30 my-20">
              <div className="is-flex is-justify-content-space-between">
                <div>
                  <div className="is-flex is-flex-wrap-wrap">
                    <p className="mr-15 has-text-weight-semibold has-text-deep-black is-size-4">{title || ''}</p>
                    <div className="is-flex is-flex-wrap-wrap is-align-items-center">
                      {renderTags(tags || [])}
                    </div>
                  </div>
                  <div className="is-flex my-10 is-align-items-center">
                    <p className="is-underlined mr-15 has-text-deep-black">{isEmpty(author) ? 'user' : author}</p>
                  </div>
                </div>
                <div className="is-flex is-flex-direction-column is-hidden-mobile">
                  <p className="has-text-gray-700 has-text-weight-semibold">
                    Share this Community Guide
                  </p>
                  <div className="is-flex is-justify-content-flex-end mt-15">
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={faLinkedinIn} size="lg" color="#0081A7" />
                    </a>
                    <a href={`https://www.facebook.com/sharer.php?u=${url}`} target="_blank" rel="noreferrer" className="ml-20">
                      <FontAwesomeIcon icon={faFacebook} size="lg" color="#0081A7"  />
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${url}`} target="_blank" rel="noreferrer" className="ml-20">
                      <FontAwesomeIcon icon={faTwitter} size="lg" color="#0081A7"  />
                    </a>
                    <a href={`mailto:?body=${`Hello!%0dCheck%20this%20Engineering%20Guide%20from%20Sema%20Software!%0d${url}`}&subject=Engineering%20Guide%20from%20Sema%20Software`} className="ml-20">
                      <FontAwesomeIcon icon={faEnvelope} size="lg" color="#0081A7"  />
                    </a>
                  </div>
                </div>
              </div>
              <div className="is-flex my-10 is-align-items-center is-flex-wrap-wrap">
                <p className="is-size-5 has-text-deep-black is-size-7-mobile"><b>Source:</b> {source?.name || 'sema'}</p>
                <div className="is-divider-vertical is-hidden-mobile" />
                <p className="is-size-5 mr-15 has-text-deep-black is-size-7-mobile"><b>Collection:</b> {name}</p>
              </div>
              <div className="is-hidden-desktop mb-20">
                <p className="has-text-gray-700 has-text-weight-semibold mt-15">
                  Share this Community Guide
                </p>
                <div className="is-flex mt-5">
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faLinkedinIn} size="lg" color="#0081A7" />
                  </a>
                  <a href={`https://www.facebook.com/sharer.php?u=${url}`} target="_blank" rel="noreferrer" className="ml-20">
                    <FontAwesomeIcon icon={faFacebook} size="lg" color="#0081A7"  />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${url}`} target="_blank" rel="noreferrer" className="ml-20">
                    <FontAwesomeIcon icon={faTwitter} size="lg" color="#0081A7"  />
                  </a>
                  <a href={`mailto:?body=${`Hello!%0dCheck%20this%20Engineering%20Guide%20from%20Sema%20Software!%0d${url}`}&subject=Engineering%20Guide%20from%20Sema%20Software`} className="ml-20">
                    <FontAwesomeIcon icon={faEnvelope} size="lg" color="#0081A7"  />
                  </a>
                </div>
              </div>
              <div
                className={clsx('has-background-white has-border-10px p-25 is-size-6', styles['body-container'])}>
                {formatText(body || '')}
              </div>
              <div className="is-flex mt-25 is-align-items-center">
                <p className="is-size-6 has-text-deep-black">
                  <b className="mr-5">Related Suggested Comments Collection:</b>
                  <a href={`/comments/${_id}`}>
                    <span className="is-underlined has-text-deep-black">{name}</span>
                  </a>
                </p>
              </div>
            </div>
          </>
        ) : 'Not found' }
      </div>
    </div>
  );
};

export default withLayout(EngineeringGuidePage);
