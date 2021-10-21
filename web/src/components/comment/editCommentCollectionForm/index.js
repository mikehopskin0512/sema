import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import { tagsOperations } from '../../../state/features/tags';

const { fetchTagList } = tagsOperations;

const EditCommentCollectionForm = ({ register, formState, setValue, watch }) => {
  const dispatch = useDispatch();

  const [tagOptions, setTagOptions] = useState([]);

  const { authState, tagState } = useSelector(
    (state) => ({
      tagState: state.tagsState,
      authState: state.authState,
    }),
  );

  const { token } = authState;
  const { errors } = formState;

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
          type,
          label,
          value: _id,
          tag: _id,
        });
      }
      if (type === 'language') {
        languages.push({
          type,
          label,
          value: _id,
          tag: _id,
        });
      }
      if (type === 'custom') {
        custom.push({
          type,
          label,
          value: _id,
          tag: _id,
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

  const onSelectTags = (e) => {
    if (e) {
      const tags = e.map(({ type, label, tag, value }) => ({
        tag,
        type,
        label,
        value
      }));
      setValue('tags', tags);
    }
  }

  const onRemove = (data) => {
    const tags = [...watch('tags')];
    const filtered = tags.filter((tag) => tag.tag !== data.tag);
    setValue('tags', filtered);
  }

  const MultiValueRemove = ({ innerProps, ...props }) => (
    <components.MultiValueRemove {...props} innerProps={{ ...innerProps, onClick: () => onRemove(props.data) }} />
  );

  const ClearIndicator = ({ innerProps, ...props }) => (
    <components.ClearIndicator {...props} innerProps={{ ...innerProps, onClick: () => setValue('tags', []) }} />
  );

  return(
    <div className="p-10">
      <div className="mb-25">
        <label className="label has-text-deep-black">Collection Title *</label>
        <input
          className="input has-background-white"
          type="text"
          {...register(
            'name',
            {
              required: 'Title is required',
            },
          )}
        />
        {errors.name && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.name.message}</p>)}
      </div>
      <div className="mb-25">
        <label className="label has-text-deep-black">Tags/Language/Framework/Version *</label>
        <Select
          {...register(
            'tags',
            {
              required: 'At least one tag is required'
            }
          )}
          isMulti
          options={tagOptions}
          placeholder=""
          onChange={onSelectTags}
          value={watch('tags')}
          components={{
            MultiValueRemove,
            ClearIndicator
          }}
        />
        <p className="is-size-7 is-italic">These tags automatically add to new Comment in this Collection</p>
        {errors.tags && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.tags.message}</p>)}
      </div>
      <div className="mb-25">
        <label className="label has-text-deep-black">Description</label>
        <textarea
          className="textarea has-background-white"
          {...register('description')}
        ></textarea>
      </div>
    </div>
  )
};

export default EditCommentCollectionForm;