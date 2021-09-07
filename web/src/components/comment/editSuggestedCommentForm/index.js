import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

const EditSuggestedCommentForm = ({ comment, onChange }) => {
  const { tagState } = useSelector((state) => ({
    tagState: state.tagsState,
  }));
  const { tags } = tagState;

  const tagOptions = useMemo(() => tags.map((item) => ({
    label: item.label,
    value: item._id,
  })), [tags]);

  return (
    <div className="mb-25 pb-20" style={{ borderBottom: '1px solid #dbdbdb' }}>
      <div className="columns mb-0">
        <div className="mr-10 mb-10 column">
          <label className="label">Title</label>
          <input
            className="input has-background-white"
            type="text"
            placeholder="Title"
            value={comment.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="mr-10 mb-10 column">
          <label className="label">Other Tags</label>
          <CreatableSelect
            isMulti
            onChange={(e) => onChange({ tags: e })}
            options={tagOptions}
            placeholder="Select Tags"
            value={comment.tags}
          />
        </div>
        <div className="mr-10 mb-10 column">
          <label className="label">Source</label>
          <input
            className="input has-background-white"
            type="text"
            placeholder="Source"
            value={comment.source.url}
            onChange={(e) => onChange({ source: { name: comment.source.name, url: e.target.value } })}
          />
        </div>
      </div>
      <div>
        <label className="label">Comment</label>
        <textarea
          className="textarea has-background-white mb-10"
          value={comment.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
        />
      </div>
    </div>
  );
};

EditSuggestedCommentForm.propTypes = {
  comment: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EditSuggestedCommentForm;
