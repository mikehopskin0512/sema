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
          <label className="label has-text-deep-black">Title</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          { errors.title && <p className="has-text-danger is-size-7 is-italic">{errors.title.message}</p> }
        </div>
        <div className="mb-10 column">
          <label className="label has-text-deep-black">Comment Collections</label>
          <input
            className="input has-background-white"
            type="text"
            disabled
            value={collection?.name || ''}
          />
        </div>
      </div>
      <div className="columns mb-0">
        <div className="mb-10 column">
          <label className="label has-text-deep-black">Language Labels</label>
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
          <label className="label has-text-deep-black">Other Labels</label>
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
          <label className="label has-text-deep-black">Source</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.source.url}
            onChange={(e) => onChange({ source: { name: comment.source.name, url: e.target.value } })}
          />
          { errors.source && <p className="has-text-danger is-size-7 is-italic">{errors.source.message}</p> }
        </div>
        <div className="mb-10 column">
          <label className="label has-text-deep-black">Author</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.author}
            onChange={(e) => onChange({ author: e.target.value })}
          />
          { errors.author && <p className="has-text-danger is-size-7 is-italic">{errors.author.message}</p> }
        </div>
      </div>
      <div className="mb-10">
        <label className="label has-text-deep-black">Body</label>
        <textarea
          className="textarea has-background-white"
          value={comment.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
        />
        { errors.comment && <p className="has-text-danger is-size-7 is-italic">{errors.comment.message}</p> }
      </div>
      <div className="mb-10">
        <label className="label has-text-deep-black">Link to Original Article</label>
        <input
          className="input has-background-white"
          type="text"
          value={comment.link}
          onChange={(e) => onChange({ link: e.target.value })}
        />
      </div>
      <div className="mb-10">
        <label className="label has-text-deep-black">Related links</label>
        <input
          className="input has-background-white"
          type="text"
          value={comment.relatedLinks}
          onChange={(e) => onChange({ relatedLinks: e.target.value })}
        />
        {/* <p className="is-size-8 is-italic">Separate links with comma (e.g. https://semasoftware.com, https://app.semasoftware.com)</p> */}
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
