import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { flatten, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import styles from '../../engineering.module.scss';

import Helmet from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';

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
  const { auth, engGuideState } = useSelector((state) => ({
    auth: state.authState,
    engGuideState: state.engGuidesState,
  }));

  const { token } = auth;
  const { engGuideId } = router.query;
  const { engGuides } = engGuideState;

  useEffect(() => {
    dispatch(getEngGuides(token));
  }, [dispatch, token]);

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
      <div className="hero-body pb-300">
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
              { engGuideData.data && (
                <>
                  <div className="is-flex is-flex-wrap-wrap">
                    <p className="mr-15 has-text-weight-semibold has-text-deep-black is-size-4">{engGuideData.data.title || ''}</p>
                    <div className="is-flex is-flex-wrap-wrap is-align-items-center">
                      {renderTags(engGuideData.data.tags || [])}
                    </div>
                  </div>
                  <div className="is-flex my-10 is-align-items-center">
                    <p className="is-underlined mr-15 has-text-deep-black">{isEmpty(engGuideData.data.author) ? 'user' : engGuideData.data.author}</p>
                    {/* <p className="is-size-7 has-text-grey">Jan 10, 2021</p> */}
                  </div>
                  <div className="is-flex my-10 is-align-items-center is-flex-wrap-wrap">
                    <p className="is-size-5 has-text-deep-black is-size-7-mobile"><b>Source:</b> {engGuideData.data.source.name || 'sema'}</p>
                    <div className="is-divider-vertical" />
                    <p className="is-size-5 mr-15 has-text-deep-black is-size-7-mobile"><b>Collection:</b> {engGuideData.name}</p>
                  </div>
                  <div
                    className={clsx('has-background-white has-border-10px p-25 is-size-6', styles['body-container'])}>
                    {formatText(engGuideData.data.body || '')}
                  </div>
                  <div className="is-flex mt-25 is-align-items-center">
                    <p className="is-size-6 has-text-deep-black">
                      <b className="mr-5">Related Suggested Comments Collection:</b>
                      <a href={`/collections/${engGuideData._id}`}>
                        <span className="is-underlined has-text-deep-black">{engGuideData.name}</span>
                      </a>
                    </p>
                  </div>
                </>
              ) }
            </div>
          </>
        ) : 'Not found' }
      </div>
    </div>
  );
};

export default withLayout(EngineeringGuidePage);
