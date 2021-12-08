import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import styles from './editCommentCollectionForm.module.scss';
import { tagsOperations } from '../../../state/features/tags';
import useAuthEffect from '../../../hooks/useAuthEffect';
import CustomCheckbox from '../../customCheckbox';
import usePermission from '../../../hooks/usePermission';
import { SEMA_CORPORATE_TEAM_ID } from "../../../utils/constants";

const { fetchTagList } = tagsOperations;

const EditCommentCollectionForm = ({ register, formState, setValue, watch, cid = null }) => {
  const dispatch = useDispatch();

  const [tagOptions, setTagOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);

  const { authState, tagState } = useSelector(
    (state) => ({
      tagState: state.tagsState,
      authState: state.authState,
    }),
  );
  const { checkTeam } = usePermission();

  const { token } = authState;
  const { errors } = formState;

  useAuthEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

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
    setLanguageOptions([...languages]);
    setTagOptions([...guides, ...custom]);
  }, [tagState.tags]);

  const onSelectTags = (e, type) => {
    if (e) {
      const tags = e.map(({ type, label, tag, value }) => ({
        tag,
        type,
        label,
        value
      }));
      setValue(type, tags);
    }
  }

  const onRemove = (data, type) => {
    const tags = [...watch(type)];
    const filtered = tags.filter((tag) => tag.tag !== data.tag);
    setValue(type, filtered);
  }

  const MultiValueRemove = ({ innerProps, type, ...props }) => (
    <components.MultiValueRemove {...props} innerProps={{ ...innerProps, onClick: () => onRemove(props.data, type) }} />
  );

  const ClearIndicator = ({ innerProps, type, ...props }) => (
    <components.ClearIndicator {...props} innerProps={{ ...innerProps, onClick: () => setValue(type, []) }} />
  );

  return (
    <div className="p-10">
      <div className="mb-25">
        <label className="label has-text-black-950">Snippet Collection Title</label>
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
      <div className="mb-25 is-flex">
        <div className={clsx(styles['three-in-a-row'], "is-flex-grow-1")}>
          <label className="label has-text-black-950">Language Labels</label>
          <Select
            {...register(
              'languages',
              {
                required: 'At least one tag is required'
              }
            )}
            isMulti
            options={languageOptions}
            placeholder=""
            onChange={(e) => onSelectTags(e, 'languages')}
            value={watch('languages')}
            components={{
              MultiValueRemove: (p) => MultiValueRemove({ type: 'languages', ...p }),
              ClearIndicator: (p) => ClearIndicator({ type: 'languages', ...p }),
            }}
          />
          <p className="is-size-7 is-italic">These tags automatically add to new Comment in this Collection</p>
          {errors.languages && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.languages.message}</p>)}
        </div>
        <div style={{ width: 10 }} />
        <div className={clsx(styles['three-in-a-row'], "is-flex-grow-1")}>
          <label className="label has-text-deep-black">Other Labels</label>
          <Select
            {...register(
              'others',
              {
                required: 'At least one tag is required'
              }
            )}
            isMulti
            options={tagOptions}
            placeholder=""
            onChange={(e) => onSelectTags(e, 'others')}
            value={watch('others')}
            components={{
              MultiValueRemove: (p) => MultiValueRemove({ type: 'others', ...p }),
              ClearIndicator: (p) => ClearIndicator({ type: 'others', ...p }),
            }}
          />
          {errors.others && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.others.message}</p>)}
        </div>
        <div style={{ width: 10 }} />
        <div className={clsx(styles['three-in-a-row'], "is-flex-grow-1")}>
          <label className="label has-text-deep-black">Author</label>
          <input
            className="input has-background-white"
            type="text"
            {...register(
              'author',
              {
                required: 'Author is required',
              },
            )}
          />
          {errors.author && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.author.message}</p>)}
        </div>
      </div>
      <div className="mb-25 is-flex">
        <div className="is-flex-grow-1">
          <label className="label has-text-deep-black">Source Name</label>
          <input
            className="input has-background-white"
            type="text"
            {...register(
              'sourceName',
              {
                required: 'Source name is required',
              },
            )}
          />
          {errors.sourceName && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.sourceName.message}</p>)}
        </div>
        <div style={{ width: 10 }} />
        <div className="is-flex-grow-1">
          <label className="label has-text-deep-black">Source Link</label>
          <input
            className="input has-background-white"
            type="text"
            {...register(
              'sourceLink',
              {
                required: 'Source link is required',
                pattern: {
                  value: /https?:\/\//g,
                  message: "Invalid URL"
                }
              },
            )}
          />
          {errors.sourceLink && (<p className="has-text-danger is-size-8 is-italized mt-5">{errors.sourceLink.message}</p>)}
        </div>
      </div>
      <div className="mb-25">
        <label className="label has-text-black-950">Description</label>
        <textarea
          className="textarea has-background-white"
          {...register('description')}
        ></textarea>
      </div>
      {
        !cid && checkTeam(SEMA_CORPORATE_TEAM_ID) && (
          <div>
            <CustomCheckbox
              label="Populate this collection to all users"
              checked={watch('isPopulate')}
              {...register('isPopulate')}
              onChange={(e) => setValue('isPopulate', e.target.checked)}
            />
          </div>
        )
      }
    </div>
  );
};

export default EditCommentCollectionForm;
