import React from 'react';
import GuideLink from './GuideLink';
import { getCollectionUrl } from '../../helpers';

function SuggestionComment({
  title,
  sourceName,
  comment,
  engGuides,
}) {
  return (
    <>
      <div className="suggestion-title">
        <span className="suggestion-name">{title}</span>
        {' '}
        <span className="suggestion-source">{sourceName}</span>
      </div>
      <div className="suggestion-content-truncated-container">
        <div
          className="suggestion-content-truncated"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: comment }}
        />
        {engGuides?.map(({ engGuide, slug, name }) => (
          <GuideLink
            key={engGuide}
            title={name}
            link={getCollectionUrl(engGuide, slug)}
          />
        ))}
      </div>
    </>
  );
}

export default SuggestionComment;
