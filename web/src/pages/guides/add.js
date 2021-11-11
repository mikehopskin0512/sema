import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import withLayout from '../../components/layout';
import Helmet from '../../components/utils/Helmet';
import { commentsOperations } from '../../state/features/comments';
import EngGuideForm from '../../components/engGuides/engGuideForm';
import { tagsOperations } from '../../state/features/tags';
import { engGuidesOperations } from '../../state/features/engGuides';
import { makeTagsList } from '../../utils';
import { PATHS } from '../../utils/constants';

const { fetchTagList } = tagsOperations;
const { bulkCreateEngGuides } = engGuidesOperations;

const { getCollectionById } = commentsOperations;

const initialValue = {
  title: '',
  body: '',
  slug: '',
  tags: [],
  languages: [],
  source: {
    name: '',
    url: '',
  },
  collections: [],
};

const AddEngGuidesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cid: collectionId } = router.query;
  const { auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));

  const { collection } = collectionState;
  const { token } = auth;

  const [engGuides, setEngGuides] = useState([initialValue]);

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

  const addEngGuide = () => {
    setEngGuides([...engGuides, initialValue]);
  };

  const onChange = (value, index) => {
    setEngGuides(engGuides.map((guide, i) => i === index ? ({
      ...guide,
      ...value,
    }) : guide));
  };

  const onCancel = async () => {
    await router.back();
  };

  const onSave = async () => {
    const data = engGuides.map((item) => {
      const languages = makeTagsList(item.languages, 'language');
      const otherTags = makeTagsList(item.tags);

      return ({
        ...item,
        tags: {
          newTags: languages.newTags.concat(otherTags.newTags),
          existingTags: languages.existingTags.concat(otherTags.existingTags),
        },
      });
    });

    await dispatch(bulkCreateEngGuides({ engGuides: data }, token));
    await router.push(`${PATHS.GUIDES}?cid=${collection._id}`);
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet title="Engineering Guide" />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href={`${PATHS.GUIDES}?cid=${collection._id}`} className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href={PATHS.GUIDES} className="has-text-grey">Community Engineering Guides</a></li>
              <li className="has-text-weight-semibold"><a className="has-text-grey" href={`${PATHS.GUIDES}?cid=${collection._id}`}>{collection.name}</a></li>
              <li className="is-active has-text-weight-semibold"><a>Add Guides</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
              Add Community Engineering Guides
            </p>
          </div>
          <div className="is-flex">
            <button
              className="button is-small is-outlined is-primary border-radius-4px mr-10"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={onSave}
            >
              <FontAwesomeIcon icon={faCheck} className="mr-10" />
              Save
            </button>
          </div>
        </div>
        <div className="px-10">
          {
            engGuides.map((item, index) => (
              <EngGuideForm
                key={`form-${index}`}
                engGuide={item}
                onChange={(e) => onChange(e, index)}
              />
            ))
          }
          <button
            className="button is-small is-outlined is-primary border-radius-4px"
            type="button"
            onClick={addEngGuide}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-10" />
            Add another Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default withLayout(AddEngGuidesPage);
