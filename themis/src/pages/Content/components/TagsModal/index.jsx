/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';

import {
  POSITIVE, NEGATIVE, TOGGLE_OP, SEGMENT_EVENTS,
} from '../../constants';

import { segmentTrack } from '../../modules/segment';
import { getActiveThemeClass } from '../../../../../utils/theme';

function TagsModal({ allTags, toggleTagSelection }) {
  const { user: { _id: userId } } = useSelector((state) => state);
  const Tag = ({ tag, type }) => {
    const isSelected = tag.selected === type;
    const toggleTag = () => {
      toggleTagSelection({
        tag: tag[type],
        isSelected,
        op: TOGGLE_OP,
      });
      // eslint-disable-next-line object-curly-newline
      segmentTrack(SEGMENT_EVENTS.CLICKED_ADD_TAGS, userId, {
        change_tag: true, tag: tag[type], tag_type: type, clicked_faq: false,
      });
    };
    return (
      <div
        className={`
          sema-tag 
          sema-is-rounded 
          ${isSelected ? 'tag-selected' : ''}
          ${isSelected ? 'sema-is-dark' : 'sema-is-light'}
        `}
        style={{ cursor: 'pointer' }}
        onClick={toggleTag}
      >
        {tag[type]}
      </div>
    );
  };

  return (
    <div className={`tags-modal ${getActiveThemeClass()}`}>
      <div className="tags-modal--column sema-is-align-items-flex-end">
        {allTags.map((tag) => <Tag tag={tag} type={POSITIVE} key={tag[POSITIVE]} />)}
      </div>
      <div className="tags-modal--column">
        {allTags.map((tag) => <div className="tags-modal--separator" key={`separator-${tag[POSITIVE]}`} />)}
      </div>
      <div className="tags-modal--column">
        {allTags.map((tag) => <Tag tag={tag} type={NEGATIVE} key={tag[NEGATIVE]} />)}
      </div>
    </div>
  );
}

export default TagsModal;
