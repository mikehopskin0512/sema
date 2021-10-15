import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useSelector } from 'react-redux';

const EditSuggestedCommentForm = ({ comment, onChange, collection, errors = {} }) => {
  const [initialFormState, setInitialFormState] = useState(true);
  const { tagState } = useSelector((state) => ({
    tagState: state.tagsState,
  }));
  const { tags } = tagState;

  const languagesOptions = useMemo(() => tags.filter((item) => item.type === 'language').map((item) => ({
    label: item.label,
    value: item._id,
  })), [tags]);

  const guidesOptions = useMemo(() => tags.filter((item) => item.type === 'guide' || item.type === 'other').map((item) => ({
    label: item.label,
    value: item._id,
  })), [tags]);

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
