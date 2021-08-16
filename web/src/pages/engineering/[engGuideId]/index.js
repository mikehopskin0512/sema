import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  find, findIndex, flatten, isEmpty, uniqBy,
} from 'lodash';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

import CommentFilter from '../../../components/comment/commentFilter';
import EngGuideTable from '../../../components/engGuides/engGuideTable';
import withLayout from '../../../components/layout';
import Helmet from '../../../components/utils/Helmet';

import { engGuidesOperations } from '../../../state/features/engGuides';
import ActionGroup from '../../../components/engGuides/actionGroup';

const { getEngGuides } = engGuidesOperations;

const CollectionEngGuides = () => {
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

  const { engGuideId } = router.query;
  const { token } = auth;
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
    dispatch(getEngGuides(token));
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
    const collection = find(engGuides, { collectionData: { _id: engGuideId } });
    if (collection) {
      setEngGuide(collection.collectionData);
    }
  }, [engGuideId, engGuides]);

  const redirectToAddPage = async () => {
    await router.push(`/engineering/${engGuideId}/add`);
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
          <a href="/collections" className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/engineering" className="has-text-grey">Community Engineering Guides</a></li>
              <li className="is-active has-text-weight-semibold"><a href={`/engineering-guidelines/${engGuideId}`}>{engGuide.name}</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap p-10 is-align-items-center">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
              {engGuide.name}
            </p>
            <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
              {engGuide.comments.length} suggested comments
            </span>
          </div>
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
            onClick={redirectToAddPage}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-10" />
            Add new Guide(s)
          </button>
        </div>
        {
          selectedGuides.length ? (
            <ActionGroup
              selectedGuides={selectedGuides}
              handleSelectAllChange={handleSelectAllChange}
              archiveGuides={archiveGuides}
              unarchiveGuides={unarchiveGuides}
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
        />
      </div>
    </div>
  );
};

export default withLayout(CollectionEngGuides);
