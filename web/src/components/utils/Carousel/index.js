import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './carousel.module.scss';
import carouselData from './data';

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const renderImage = () => {
    switch (current) {
      case 0:
        return <Reactions />;
      case 1:
        return <Tags />;
      case 2:
        return <SuggestedComments />;
      case 3:
        return <DeveloperInsights />;
      case 4:
        return <SocialGraph />;
      default:
    }
  };

  return (
    <>
      <div className="tile is-ancestor">
        <div className="tile is-2">
          <button onClick={() => setCurrent(0)} type="button" className={clsx('button is-medium is-light', current === 0 && 'is-text')}>
            Reactions
          </button>
        </div>
        <div className="tile is-2">
          <button onClick={() => setCurrent(1)} type="button" className={clsx('button is-medium is-light', current === 1 && 'is-text')}>
            Tags
          </button>
        </div>
        <div className="tile is-3">
          <button onClick={() => setCurrent(2)} type="button" className={clsx('button is-medium is-light', current === 2 && 'is-text')}>
            Suggested Comments
          </button>
        </div>
        <div className="tile is-3">
          <button onClick={() => setCurrent(3)} type="button" className={clsx('button is-medium is-light', current === 3 && 'is-text')}>
            Developer Insights
          </button>
        </div>
        <div className="tile is-3">
          <button onClick={() => setCurrent(4)} type="button" className={clsx('button is-medium is-light', current === 4 && 'is-text')}>
            Social Graph
          </button>
        </div>
      </div>
      <div className={clsx(styles.slider)}>
        {/* <Tags /> */}
        {renderImage()}
      </div>
    </>
  );
};

const TileAncestor = ({ children }) => (
  <>
    <div className={clsx('tile is-ancestor mt-50')}>
      {children}
    </div>
  </>
);

const Reactions = () => (
  <>
    <TileAncestor>
      <div className="tile is-1" />
      <div className="tile is-4 is-parent is-vertical mt-70 pl-70">
        <p className="title">Reactions</p>
        <p className="subtitle">Provide a simple, clear summary of the review -- if you want to.</p>
      </div>
      <div className="tile is-7">
        <img src={carouselData[0]} alt="reactions" className="" />
      </div>
    </TileAncestor>
  </>
);

const Tags = () => (
  <>
    <TileAncestor>
      <div className="tile is-1" />
      <div className="tile is-7">
        <img src={carouselData[1]} alt="tags" className="" />
      </div>
      <div className="tile is-4 is-parent is-vertical mt-70">
        <p className="title">Add Tags</p>
        <p className="subtitle">Describe the code in positive or constructive coding characteristics -- so the team can learn and grow, and great code can be tagged for future training.</p>
      </div>
    </TileAncestor>
  </>
);

const SuggestedComments = () => (
  <>
    <TileAncestor>
      <div className="tile is-1" />
      <div className="tile is-5 is-parent is-vertical mt-70 mr-20">
        <p className="title">Suggested Comments</p>
        <p className="subtitle">Use pre-written comments from some of the world’s best sources of coding knowledge -- to save time and improve clarity. </p>
      </div>
      <div className="tile is-6">
        <img src={carouselData[2]} alt="suggested-comments" className="" />
      </div>
    </TileAncestor>
  </>
);

const DeveloperInsights = () => (
  <>
    <TileAncestor>
      <div className="tile is-1" />
      <div className="tile is-6">
        <img src={carouselData[3]} alt="developer-insights" className="" />
      </div>
      <div className="tile is-4 is-parent is-vertical mt-50">
        <p className="title">Developer Insights</p>
        <p className="subtitle">Each Engineer develops a lasting, shared record of their contributions and skill development in their Sema Profile</p>
      </div>
    </TileAncestor>
  </>
);

const SocialGraph = () => (
  <>
    <TileAncestor>
      <div className="tile is-1" />
      <div className="tile is-4 is-parent is-vertical">
        <p className="title mt-70">Social Graph</p>
        <p className="subtitle">The Sema Review Graph drives skill discovery, continuous professional development, and greater social cohesion.</p>
      </div>
      <div className="tile is-7">
        <img src={carouselData[4]} alt="social-graph" className="" />
      </div>
    </TileAncestor>
  </>
);

export default Carousel;
