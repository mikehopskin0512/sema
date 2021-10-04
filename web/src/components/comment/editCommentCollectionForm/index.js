import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { tagsOperations } from '../../../state/features/tags';

const { fetchTagList } = tagsOperations;

const EditCommentCollectionForm = ({ token }) => {
  const dispatch = useDispatch();
  const [tagOptions, setTagOptions] = useState([]);

  const { tagState } = useSelector(
    (state) => ({
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
  )
};

export default EditCommentCollectionForm;