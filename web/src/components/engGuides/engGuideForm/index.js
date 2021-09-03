import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

const EngGuideForm = ({ engGuide, onChange }) => {
  const { tagState, authState } = useSelector((state) => ({
    tagState: state.tagsState,
    authState: state.authState,
  }));
  const { user: { collections } } = authState;

  const { tags } = tagState;

  const tagOptions = useMemo(() => {
    const options = [];
    tags.forEach((item) => {
      const { type, _id, label } = item;
      if (type === 'guide' || type === 'custom') {
        options.push({
          label,
          value: _id,
        });
      }
    });

    return options;
  }, [tags]);

  const languageOptions = useMemo(() => {
    const languages = [];
    tags.forEach((item) => {
      const { type, _id, label } = item;
      if (type === 'language') {
        languages.push({
          label,
          value: _id,
        });
      }
    });

    return languages;
  }, [tags]);
  const collectionOptions = useMemo(() => collections.map((item) => ({
    label: item.collectionData.name,
    value: item.collectionData._id,
  })), [collections]);

  return (
    <div className="mb-25 pb-20" style={{ borderBottom: '1px solid #EEE' }}>
      <div className="columns mb-0">
        <div className="mr-10 mb-10 column">
          <label className="label">Document Name</label>
          <input
            className="input has-background-white"
            type="text"
            placeholder="Document Name"
            value={engGuide.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="mr-10 mb-10 column">
          <label className="label">Snippet</label>
          <input
            className="input has-background-white"
            type="text"
            placeholder="Snippet"
            value={engGuide.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
          />
        </div>
        <div className="mr-10 mb-10 column">
          <label className="label">Collection</label>
          <Select
            placeholder="Select Collection"
            onChange={(e) => onChange({ collections: [e.value] })}
            options={collectionOptions}
            value={collectionOptions.find((item) => item.value === engGuide.collections[0])}
          />
        </div>
        <div className="mr-10 mb-10 column">
          <label className="label">Languages</label>
          <CreatableSelect
            isMulti
            onChange={(languages) => onChange({ languages })}
            options={languageOptions}
            placeholder="Select Languages"
            value={engGuide.languages}
          />
        </div>
        <div className="mr-10 mb-10 column">
          <label className="label">Other tags</label>
          <CreatableSelect
            isMulti
            onChange={(tags) => onChange({ tags })}
            options={tagOptions}
            placeholder="Select Other Tags"
            value={engGuide.tags}
          />
        </div>
        <div className="mb-10 column">
          <label className="label">Source</label>
          <input
            className="input has-background-white"
            type="text"
            placeholder="Source"
            value={engGuide.source.url}
            onChange={(e) => onChange({ source: { name: engGuide.source.name, url: e.target.value } })}
          />
        </div>

      </div>
      <div>
        <label className="label">Body</label>
        <textarea
          className="textarea has-background-white mb-10"
          value={engGuide.body}
          onChange={(e) => onChange({ body: e.target.value })}
        />
      </div>
    </div>
  );
};

EngGuideForm.propTypes = {
  engGuide: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EngGuideForm;
