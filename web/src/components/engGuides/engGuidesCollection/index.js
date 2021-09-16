import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  find, findIndex, flatten, isEmpty, uniqBy,
} from 'lodash';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import CommentFilter from '../../comment/commentFilter';
import EngGuideTable from '../engGuideTable';
import ActionGroup from '../actionGroup';
import GlobalSearch from "../../globalSearch";
import Helmet from '../../utils/Helmet';

import { engGuidesOperations } from '../../../state/features/engGuides';

// const NUM_PER_PAGE = 10;

const { getEngGuides } = engGuidesOperations;

const CollectionEngGuides = ({ collectionId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [engGuide, setEngGuide] = useState({
    name: '',
    _id: '',
    comments: [],
  });
  const [tagFilters, setTagFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [engGuideFilter, setEngGuideFilter] = useState([]);
  const { auth, engGuideState } = useSelector((state) => ({
    auth: state.authState,
    engGuideState: state.engGuidesState,
  }));

  const { token, user } = auth;
  const { engGuides, isFetching } = engGuideState;
  const [selectedGuides, setSelectedGuides] = useState([]);

  const onSearch = ({ search, tag, language }) => {
    const { comments = [] } = engGuide;
    const filtered = comments.filter((item) => {
      const isMatchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.source.name.toLowerCase().includes(search.toLowerCase());
      const tagIndex = findIndex(item.tags, { label: tag });
      const languageIndex = findIndex(item.tags, { label: language });
      let filterBool = true;
      if (!isEmpty(search)) {
        filterBool = filterBool && isMatchSearch;
      }
      if (!isEmpty(tag)) {
        filterBool = filterBool && tagIndex !== -1;
      }
      if (!isEmpty(language)) {
        filterBool = filterBool && languageIndex !== -1;
      }
      return filterBool;
    });
    setEngGuideFilter([...filtered]);
  };

  useEffect(() => {
    dispatch(getEngGuides());
  }, [dispatch, token]);

  useEffect(() => {
    const { comments = [] } = engGuide;
    setEngGuideFilter(comments);
    const commentTags = uniqBy(flatten(comments.map((item) => item.tags.map((tag) => tag))), 'label');
    const tags = [];
    const languages = [];
    commentTags.forEach((item) => {
      if (item.type === 'language') {
        languages.push(item);
      }
      if (item.type === 'guide') {
        tags.push(item);
      }
    });
    setTagFilters(tags);
    setLanguageFilters(languages);
  }, [engGuide]);

  useEffect(() => {
    const collection = find(engGuides, { collectionData: { _id: collectionId } });
    if (collection) {
      setEngGuide(collection.collectionData);
    }
  }, [collectionId, engGuides]);

  const redirectToAddPage = async () => {
    await router.push(`/guides/add?cid=${collectionId}`);
  };

  const handleSelectChange = (guideId, value) => {
    if (value) {
      setSelectedGuides([...selectedGuides, guideId]);
    } else {
      setSelectedGuides(selectedGuides.filter((item) => item !== guideId));
    }
  };

  const handleSelectAllChange = (value) => {
    setSelectedGuides(value ? engGuideFilter.map((g) => g._id) : []);
  };

  const archiveGuides = useMemo(() => engGuideFilter.filter((item) => selectedGuides
    .indexOf(item._id) !== -1 && !item.isActive), [selectedGuides, engGuideFilter]);

  const unarchiveGuides = useMemo(() => engGuideFilter.filter((item) => selectedGuides
    .indexOf(item._id) !== -1 && item.isActive), [selectedGuides, engGuideFilter]);

  // TODO we will replace this logic with role based access control
  // intentionally used useMemo here
  const isEditable = useMemo(() => user.isSemaAdmin, [user]);

  if (isFetching && !engGuide) {
    return (
      <div>
        Loading
      </div>
    );
  }
  return (
    <div className="has-background-gray-9 hero">
      <Helmet title="Engineering Guide" />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-10 mb-15">
          <a href="/guides" className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/guides" className="has-text-grey">Community Engineering Guides</a></li>
              <li className="is-active has-text-weight-semibold"><a href={`/engineering-guidelines/${collectionId}`}>{engGuide.name}</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex is-flex-wrap-wrap p-10 is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            {engGuide.name}
          </p>
          <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
            {engGuide.comments.length} suggested comments
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <GlobalSearch />
          </div>
        </div>
        {
          isEditable && selectedGuides.length ? (
            <ActionGroup
              selectedGuides={selectedGuides}
              handleSelectAllChange={handleSelectAllChange}
              archiveGuides={archiveGuides}
              unarchiveGuides={unarchiveGuides}
              collectionId={collectionId}
            />
          ) : (
            <CommentFilter onSearch={onSearch} tags={tagFilters} languages={languageFilters} />
          )
        }
        <EngGuideTable
          data={engGuideFilter}
          selectedGuides={selectedGuides}
          handleSelectChange={handleSelectChange}
          handleSelectAllChange={handleSelectAllChange}
          collectionId={collectionId}
        />
      </div>
    </div>
  );
};

CollectionEngGuides.propTypes = {
  collectionId: PropTypes.string.isRequired,
};

export default CollectionEngGuides;
