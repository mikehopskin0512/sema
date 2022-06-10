import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import { Controller } from 'react-hook-form';
import styles from './editCommentCollectionForm.module.scss';
import { tagsOperations } from '../../../../state/features/tags';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import usePermission from '../../../../hooks/usePermission';
import { InputField } from 'adonis';
import { red50, red500 } from '../../../../../styles/_colors.module.scss'

const { fetchTagList } = tagsOperations;

const EditCommentCollectionForm = ({ errors, cid = null, control }) => {
  const dispatch = useDispatch();
  const [tagOptions, setTagOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const { authState, tagState } = useSelector(
    (state) => ({
      tagState: state.tagsState,
      authState: state.authState,
    }),
  );
  const { token } = authState;
  const { checkOrganization } = usePermission();

  useAuthEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

  useEffect(() => {
    const guides = [];
    const languages = [];
    const custom = [];
    tagState.tags.forEach(({ type, _id, label }) => {
      const tag = {
        type,
        label,
        value: _id,
        tag: _id,
      }
      if (type === 'guide') {
        guides.push(tag);
      }
      if (type === 'language') {
        languages.push(tag);
      }
      if (type === 'custom') {
        custom.push(tag);
      }
    });
    setLanguageOptions([...languages]);
    setTagOptions([...guides, ...custom]);
  }, [tagState.tags]);

  const onRemove = (data, tags, onChange) => {
    const filtered = tags.filter((tag) => tag.tag !== data.tag);
    onChange(filtered);
  }
  // TODO: will be extracted to adonis
  const MultiValueRemove = ({ innerProps, onChange, selectedTags, ...props }) => (
    <components.MultiValueRemove {...props} innerProps={{ ...innerProps, onClick: () => onRemove(props.data, selectedTags, onChange) }} />
  );
  // TODO: will be extracted to adonis
  const ClearIndicator = ({ innerProps, type, onChange, ...props }) => (
    <components.ClearIndicator {...props} innerProps={{ ...innerProps, onClick: () => onChange([]) }} />
  );
  // TODO: will be extracted to adonis
  const customStyles = (isError) => ({
    control: (provided) => ({
      ...provided,
      background: isError ? red50 : provided.background,
      borderColor: isError ? red500 : provided.borderColor,
    })
  })

  return (
    <div className="p-10">
      <div className="mb-25">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputField
              isRequired
              title="Snippet Collection Title"
              error={errors.name?.message}
              {...field}
            />
          )}
        />
      </div>
      <div className="mb-25 is-flex">
        <div className={clsx(styles["three-in-a-row"], "is-flex-grow-1")}>
          <Controller
            name="languages"
            control={control}
            render={({ field }) => (
              <>
                <label className="label mb-4 has-text-black-950">Language Labels</label>
                <Select
                  isMulti
                  styles={customStyles(errors.languages)}
                  options={languageOptions}
                  placeholder=""
                  { ...field }
                  components={{
                    MultiValueRemove: (p) =>
                      MultiValueRemove({ onChange: field.onChange, selectedTags: field.value, ...p }),
                    ClearIndicator: (p) =>
                      ClearIndicator({ type: "languages", onChange: field.onChange, ...p }),
                  }}
                />
                <p className="is-size-7 is-italic">
                  These tags automatically add to new Comment in this Collection
                </p>
                {errors.languages && (
                  <p className="has-text-danger is-size-8 is-italized mt-5">
                    {errors.languages.message}
                  </p>
                )}
              </>
            )}
          />

        </div>
        <div style={{ width: 10 }} />
        <div className={clsx(styles["three-in-a-row"], "is-flex-grow-1")}>
          <Controller
            name="others"
            control={control}
            render={({ field }) => (
              <>
                <label className="label mb-4 has-text-deep-black">Other Labels</label>
                <Select
                  isMulti
                  styles={customStyles(errors.others)}
                  options={tagOptions}
                  {...field}
                  placeholder=""
                  components={{
                    MultiValueRemove: (p) =>
                      MultiValueRemove({ onChange: field.onChange, selectedTags: field.value, ...p }),
                    ClearIndicator: (p) => ClearIndicator({ type: "others", onChange: field.onChange, ...p }),
                  }}
                />
                {errors.others && (
                  <p className="has-text-danger is-size-8 is-italized mt-5">
                    {errors.others.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div style={{ width: 10 }} />
        <div className={clsx(styles["three-in-a-row"], "is-flex-grow-1")}>
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <InputField
                title="Author"
                isRequired
                error={errors.author?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <div className="mb-25 is-flex">
        <div className="is-flex-grow-1">
          <Controller
            name="sourceName"
            control={control}
            render={({ field }) => (
              <InputField
                isRequired
                title="Source Name"
                error={errors.sourceName?.message}
                {...field}
              />
            )}
          />
        </div>
        <div style={{ width: 10 }} />
        <div className="is-flex-grow-1">
          <Controller
            name="sourceLink"
            control={control}
            render={({ field }) => (
              <InputField
                isRequired
                title="Source Link"
                error={errors.sourceLink?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <div className="mb-25">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputField
              title="Description"
              isMultiLine
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
};

export default EditCommentCollectionForm;
