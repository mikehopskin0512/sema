import React from 'react';

function GuideLink({ link, title }) {
  return (
    <a className="suggestion-guide-link" href={link} target="_blank" rel="noreferrer">
      <i className="fas fa-file-alt" />
      <span className="suggestion-guide-link-title">
        {title}
      </span>
    </a>
  );
}

export default GuideLink;
