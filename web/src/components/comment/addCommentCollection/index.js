import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';
import { tagsOperations } from '../../../state/features/tags';
import { makeTagsList } from '../../../utils';

const { bulkCreateSuggestedComments } = suggestCommentsOperations;
const { fetchTagList } = tagsOperations;

const initialValues = {
  title: '',
  source: {
    name: '',
    url: '',
  },
  tags: [],
  comment: '',
};

const AddCommentCollection = ({ token }) => {
  const dispatch = useDispatch();
  const [tagOptions, setTagOptions] = useState([]);

  const { auth, suggestedComment, tagState } = useSelector(
    (state) => ({
      auth: state.authState,
      suggestedComment: state.suggestCommentsState,
      tagState: state.tagsState,
    }),
  );

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

  useEffect(() => {
    const guides = [];
    const languages = [];
    const custom = [];
    tagState.tags.forEach((item) => {
      const { type, _id, label } = item;
      if (type === 'guide') {
        guides.push({
          label,
          value: _id,
        });
      }
      if (type === 'language') {
        languages.push({
          label,
          value: _id,
        });
      }
      if (type === 'custom') {
        custom.push({
          label,
          value: _id,
        });
      }
    });
    setTagOptions([
      {
        label: 'Guides',
        options: guides,
      },
      {
        label: 'Languages',
        options: languages,
      },
      {
        label: 'Custom',
        options: custom,
      },
    ]);
  }, [tagState.tags]);

  return(
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Add a Comment Collection
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
          >
            Cancel
          </button>
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      <div className="p-10">
        <div className="mb-25">
          <label className="label has-text-deep-black">Collection Title *</label>
          <input
            className="input has-background-white"
            type="text"
          />
        </div>
        <div className="mb-25">
          <label className="label has-text-deep-black">Tags/Language/Framework/Version *</label>
          <CreatableSelect
            isMulti
            options={tagOptions}
            placeholder=""
          />
          <p className="is-size-7 is-italic">These tags automatically add to new Comment in this Collection</p>
        </div>
        <div className="mb-25">
          <label className="label has-text-deep-black">Collection Title *</label>
          <textarea className="textarea has-background-white"></textarea>
        </div>
      </div>
    </>
  )
}

export default AddCommentCollection;