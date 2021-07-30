import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

import { tagsOperations } from '../../../state/features/tags';

const { fetchTagList } = tagsOperations;

const SelectTags = ({ modalRef, setTags }) => {
  const dispatch = useDispatch();

  const { auth, tagState } = useSelector((state) => ({
    auth: state.authState,
    tagState: state.tagsState,
  }));
  const [tagOptions, setTagOptions] = useState([]);

  const { token } = auth;
  const { tags } = tagState;

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

  useEffect(() => {
    const guides = [];
    const languages = [];
    const custom = [];
    tags.forEach((item) => {
      const { type, _id, label } = item;
      if (type === 'guide') {
        guides.push({
          label,
          value: _id,
        });
      }
      if (type === 'language') {
        languages.push({
          label,
          value: _id,
        });
      }
      if (type === 'custom') {
        custom.push({
          label,
          value: _id,
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
  }, [tags]);

  const onChangeTags = (newValue) => {
    const existingTags = [];
    const newTags = [];
    if (newValue) {
      newValue.forEach((item) => {
        const { __isNew__, label, value } = item;
        if (__isNew__) {
          const isTagAlreadyExists = find(tags, ((tag) => tag.label.toLowerCase() === label.toLowerCase()));
          if (isTagAlreadyExists) {
            existingTags.push(isTagAlreadyExists._id);
            return;
          }
          newTags.push({
            label,
            isActive: true,
            type: 'custom',
          });
          return;
        }
        existingTags.push(value);
      });
    }
    setTags({ existingTags, newTags });
  };

  if (typeof window !== 'undefined') {
    return (
      <CreatableSelect
        isMulti
        onChange={onChangeTags}
        options={tagOptions}
        placeholder="Select tags"
        menuPortalTarget={modalRef.current}
      />
    );
  }
  return null;
};

SelectTags.propTypes = {
  modalRef: PropTypes.object.isRequired,
  setTags: PropTypes.func.isRequired,
};

export default SelectTags;
