import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useSelector } from 'react-redux';

const EditSuggestedCommentForm = ({ comment, onChange, collection, errors = {} }) => {
  const { tagState } = useSelector((state) => ({
    tagState: state.tagsState,
  }));
  const { tags } = tagState;

  const addTags = (tags, types) => tags
    .filter((tag) => types.some((type) => type === tag.type))
    .map(({ tag, _id, label }) => ({ value: tag || _id, label }))

  const languagesOptions = useMemo(() => addTags(tags, ['language']), [tags]);
  const guidesOptions = useMemo(() => addTags(tags, ['guide', 'other']), [tags]);

  useEffect(() => {
    const { tags } = collection
    const isDefaultTagsExist = !!tags?.length
    if (isDefaultTagsExist) {
      onChange({
        guides: addTags(tags, ['guide', 'other']),
        languages: addTags(tags, ['language']),
      })
    }
  }, [collection])

  return (
    <div>
      <div className="columns mb-0">
        <div className="mb-10 column">
          <label className="label has-text-black-950">Title</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          { errors.title && <p className="has-text-danger is-size-7 is-italic">{errors.title.message}</p> }
        </div>
        <div className="mb-10 column">
          <label className="label has-text-black-950">Snippet Collection</label>
          <input
            className="input has-background-white"
            type="text"
            disabled
            value={collection?.name || ''}
          />
        </div>
      </div>
      <div className="mb-20">
        <label className="label has-text-deep-black">Body</label>
        <textarea
          className="textarea has-background-white"
          value={comment.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
        />
        { errors.comment && <p className="has-text-danger is-size-7 is-italic">{errors.comment.message}</p> }
      </div>
      <div className="columns mb-0">
        <div className="mb-10 column">
          <label className="label has-text-black-950">Languages</label>
          <Select
            isMulti
            options={languagesOptions}
            placeholder=""
            onChange={(e) => onChange({ languages: e })}
            value={comment.languages}
          />
          { errors.languages && <p className="has-text-danger is-size-7 is-italic">{errors.languages.message}</p> }
        </div>
        <div className="mb-10 column">
          <label className="label has-text-black-950">Labels</label>
          <Select
            isMulti
            options={guidesOptions}
            placeholder=""
            onChange={(e) => onChange({ guides: e })}
            value={comment.guides}
          />
          { errors.guides && <p className="has-text-danger is-size-7 is-italic">{errors.guides.message}</p> }
        </div>
      </div>
      <div className="columns mb-0">
        <div className="mb-10 column">
          <label className="label has-text-black-950">Source Name</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.sourceName}
            onChange={(e) => onChange({ sourceName: e.target.value })}
          />
          { errors.sourceName && errors.sourceName && <p className="has-text-danger is-size-7 is-italic">{errors.sourceName.message}</p> }
        </div>
        <div className="mb-10 column">
          <label className="label has-text-black-950">Source Link</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.sourceLink}
            onChange={(e) => onChange({ sourceLink: e.target.value })}
          />
          { errors.sourceLink && <p className="has-text-danger is-size-7 is-italic">{errors.sourceLink.message}</p> }
        </div>
      </div>
      <div className="mb-20">
        <label className="label has-text-black-950">Author Name</label>
        <input
          className="input has-background-white"
          type="text"
          value={comment.author}
          onChange={(e) => onChange({ author: e.target.value })}
        />
        { errors.author && <p className="has-text-danger is-size-7 is-italic">{errors.author.message}</p> }
      </div>
    </div>
  );
};

EditSuggestedCommentForm.propTypes = {
  comment: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
};

export default EditSuggestedCommentForm;
