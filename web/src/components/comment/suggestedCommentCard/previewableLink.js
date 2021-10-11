import React, {useState} from 'react';
import clsx from 'clsx';
import { shortenUrl } from "../../../utils";
import styles from "./suggestedCommentCard.module.scss";

const PreviewableLink = ({ source, sourceMetadata = null }) => {
  const [isThumbnailOpen, setThumbnailOpen] = useState();
  
  return (
    <div className={clsx('has-background-white border-radius-1px position-relative px-5 py-2', styles.container)} onMouseOver={() => setThumbnailOpen(true)} onMouseLeave={() => setThumbnailOpen(false)}>
      {sourceMetadata && !!sourceMetadata.title ? (
        <a href={source.url} target='_blank' tabIndex={0} role='button'>
          <span className='is-flex is-align-items-center'>
            <span className='is-flex is-align-items-center mr-5'>
              <img src={sourceMetadata.icon} className={clsx('mr-2', styles['preview-link-icon'])} alt='preview-favicon'/>
            </span>
            <span>
              {sourceMetadata.title}
            </span>
          </span>
        </a>
      ) : (
        <a href={source.url} target='_blank'>
          <span className="is-underlined has-text-deep-black">{shortenUrl(source.url)}</span>
        </a>
      )}
  
      {isThumbnailOpen && sourceMetadata?.thumbnail && (
        <div className={clsx('has-background-white is-absolute p-5', styles.container)}>
          <img src={sourceMetadata.thumbnail} style={{ width: 480 }}/>
        </div>
      )}
    </div>
  );
}

export default PreviewableLink;