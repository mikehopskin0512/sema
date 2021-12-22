import { CheckOnlineIcon } from '../../../components/Icons';
import InputField from '../../../components/inputs/InputField';
import SelectField from '../../../components/inputs/selectField';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { addTags, makeTagsList, parseRelatedLinks } from '../../../utils';
import schema from './schema';

const SnippetForm = ({ comment, collection, onSubmit, onCancel, isNewSnippet = false }) => {
  const { tagState: { tags } } = useSelector((state) => ({
    tagState: state.tagsState,
  }));
  const { control, formState: { errors }, reset, handleSubmit  } = useForm({
    resolver: yupResolver(schema),
  })
  const languagesOptions = useMemo(() => addTags(tags, ['language']), [tags]);
  const guidesOptions = useMemo(() => addTags(tags, ['guide', 'other']), [tags]);

  useEffect(() => {
    reset(comment)
  }, [comment])
  const mapCommentsToSubmit = () => {
    const comments = [{
      ...data,
      source: {
        name: data.sourceName,
        url: data.sourceLink,
      },
      tags: makeTagsList([...data.languages, ...data.guides]),
      relatedLinks: data.relatedLinks ? parseRelatedLinks(data.relatedLinks.toString()) : '',
    }];
    onSubmit(comments);
  }

  return (
    <form onSubmit={handleSubmit(mapCommentsToSubmit)}>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            {isNewSnippet ? 'Create New Snippet' : 'Edit Snippet'}
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
            type="submit"
          >
            <CheckOnlineIcon size="small" />
            <span className="ml-8">
              {isNewSnippet ? 'Save New Snippet' : 'Save Snippet'}
            </span>
          </button>
        </div>
      </div>
      <div className="px-10 mb-25">
        <div className="columns mb-0">
          <div className="mb-10 column">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputField
                  title="Title"
                  {...field}
                  error={errors?.title?.message}
                />
              )}
            />
          </div>
          <div className="mb-10 column">
            <InputField
              title="Snippet Collection"
              value={collection?.name || ''}
              disabled
            />
          </div>
        </div>
        <div className="mb-20">
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <InputField
                isMultiLine
                title="Body"
                {...field}
                error={errors?.comment?.message}
              />
            )}
          />
        </div>
        <div className="columns mb-0">
          <div className="mb-10 column">
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <SelectField
                  title="Languages"
                  isMulti
                  options={languagesOptions}
                  placeholder=""
                  {...field}
                  error={errors?.languages?.message}
                />
              )}
            />
          </div>
          <div className="mb-10 column">
            <Controller
              name="guides"
              control={control}
              render={({ field }) => (
                <SelectField
                  title="Labels"
                  isMulti
                  options={guidesOptions}
                  placeholder=""
                  {...field}
                  error={errors?.guides?.message}
                />
              )}
            />
          </div>
        </div>
        <div className="columns mb-0">
          <div className="mb-10 column">
            <Controller
              name="sourceName"
              control={control}
              render={({ field }) => (
                <InputField
                  title="Source Name"
                  {...field}
                  error={errors?.sourceName?.message}
                />
              )}
            />
          </div>
          <div className="mb-10 column">
            <Controller
              name="sourceLink"
              control={control}
              render={({ field }) => (
                <InputField
                  title="Source Link"
                  {...field}
                  error={errors?.sourceLink?.message}
                />
              )}
            />
          </div>
        </div>
        <div className="mb-20">
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <InputField
                title="Author Name"
                {...field}
                error={errors?.author?.message}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
};

SnippetForm.propTypes = {
  isNewSnippet: PropTypes.bool,
  comment: PropTypes.any.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
};

export default SnippetForm;
