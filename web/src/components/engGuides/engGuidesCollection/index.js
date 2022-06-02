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
import GlobalSearch from "../../globalSearch";
import Helmet from '../../utils/Helmet';
import Loader from '../../Loader';

import { engGuidesOperations } from '../../../state/features/engGuides';
import usePermission from '../../../hooks/usePermission';
import { PATHS, SEMA_CORPORATE_ORGANIZATION_ID } from '../../../utils/constants';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { black950 } from '../../../../styles/_colors.module.scss';

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
  const { engGuides } = engGuideState;
  const [selectedGuides, setSelectedGuides] = useState([]);
  const { checkAccess } = usePermission();

  const onSearch = ({ search, tag, language }) => {
    const { comments = [] } = engGuide;
    const filtered = comments.filter((item) => {
      const isMatchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.source.name?.toLowerCase().includes(search.toLowerCase());
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

  useAuthEffect(() => {
    dispatch(getEngGuides());
  }, []);

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
    await router.push(`${PATHS.GUIDES}/add?cid=${collectionId}`);
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

  const isEditable = useMemo(() => checkAccess(SEMA_CORPORATE_ORGANIZATION_ID, 'canEditSnippets'), [checkAccess]);

  if (engGuideState.isFetching && auth.isFetching && !engGuide) {
    return (
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
        <Loader/>
      </div>
    );
  }
  return (
    <div className="has-background-gray-200 hero">
      <Helmet title="Engineering Guide" />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-10 mb-15">
          <a href={PATHS.GUIDES} className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color={black950} />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href={PATHS.GUIDES} className="has-text-grey">Community Engineering Guides</a></li>
              <li className="is-active has-text-weight-semibold"><a href={`/engineering-guidelines/${collectionId}`}>{engGuide.name}</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex is-flex-wrap-wrap p-10 is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            {engGuide.name}
          </p>
          <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
            {engGuide.comments.length} snippets
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <GlobalSearch />
          </div>
          {isEditable && (
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={redirectToAddPage}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-10" />
              Add new Guide(s)
            </button>
          )}
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
        { auth.isFetching || engGuideState.isFetching ? (
          <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '30vh' }}>
            <Loader/>
          </div>
        ) : (
          <EngGuideTable
            data={engGuideFilter}
            selectedGuides={selectedGuides}
            handleSelectChange={handleSelectChange}
            handleSelectAllChange={handleSelectAllChange}
            collectionId={collectionId}
          />
        ) }
      </div>
    </div>
  );
};

CollectionEngGuides.propTypes = {
  collectionId: PropTypes.string.isRequired,
};

export default CollectionEngGuides;
