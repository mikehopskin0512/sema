import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import withLayout from '../../components/layout';
import Helmet from '../../components/utils/Helmet';
import { commentsOperations } from '../../state/features/comments';
import EngGuideForm from '../../components/engGuides/engGuideForm';
import { tagsOperations } from '../../state/features/tags';
import { engGuidesOperations } from '../../state/features/engGuides';
import { makeTagsList } from '../../utils';

const { fetchTagList } = tagsOperations;
const { bulkUpdateEngGuides, getEngGuides } = engGuidesOperations;

const { getCollectionById } = commentsOperations;

const EditEngGuidesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cid: collectionId, guides } = router.query;
  const { auth, engGuidesState, collectionState } = useSelector((state) => ({
    auth: state.authState,
    engGuidesState: state.engGuidesState,
    collectionState: state.commentsState,
  }));

  const { token } = auth;
  const [engGuides, setEngGuides] = useState([]);
  const { collection } = collectionState;

  useEffect(() => {
    const ids = guides.split(',');
    dispatch(getEngGuides(token, { guides: ids }));
  }, [dispatch, token, guides]);

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  useEffect(() => {
    let data = [];
    engGuidesState.engGuides.forEach((item) => {
      data = [...data, ...item.collectionData.comments.map((comment) => ({
        ...comment,
        collections: comment.collections.map((c) => c._id),
        tags: comment.tags.filter((t) => t.type !== 'language').map((t) => ({ value: t.id, label: t.label })),
        languages: comment.tags.filter((t) => t.type === 'language').map((t) => ({ value: t._id, label: t.label })),
      }))];
    });

    setEngGuides(data);
  }, [engGuidesState]);

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

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
    await dispatch(bulkUpdateEngGuides({ engGuides: data }, token));
    await router.push(`/guides?cid=${collection._id}`);
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet title="Engineering Guide" />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href={`/guides?cid=${collection._id}`} className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/guides" className="has-text-grey">Community Engineering Guides</a></li>
              <li className="has-text-weight-semibold"><a className="has-text-grey" href={`/guides?cid=${collection._id}`}>{collection.name}</a></li>
              <li className="is-active has-text-weight-semibold"><a>Edit Guides</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
              Edit Community Engineering Guides
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
                key={item._id}
                engGuide={item}
                onChange={(e) => onChange(e, index)}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default withLayout(EditEngGuidesPage);
