import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useSelector } from 'react-redux';

const EditSuggestedCommentForm = ({ comment, onChange, collection }) => {
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
        </div>
      </div>
      <div className="columns mb-0">
        <div className="mb-10 column">
          <label className="label has-text-deep-black">Source</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.source}
            onChange={(e) => onChange({ source: e.target.value })}
          />
        </div>
        <div className="mb-10 column">
          <label className="label has-text-deep-black">Author</label>
          <input
            className="input has-background-white"
            type="text"
            value={comment.author}
            onChange={(e) => onChange({ author: e.target.value })}
          />
        </div>
      </div>
      <div className="mb-10">
        <label className="label has-text-deep-black">Comment</label>
        <textarea
          className="textarea has-background-white"
          value={comment.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
        />
        {/* <p className="has-text-danger m-0">Comment is required.</p> */}
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
        <p className="is-size-8 is-italic">Separate links with comma (e.g. https://semasoftware.com, https://app.semasoftware.com)</p>
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
