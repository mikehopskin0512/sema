import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './carousel.module.scss';
import carouselData from './data';

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [screens] = useState(['Reactions', 'Tags', 'Suggested Comments', 'Developer Insights', 'Social Graph']);
  const buttonProps = (index) => ({
    onClick: () => setCurrent(index),
    className: clsx('is-uppercase is-size-5 has-text-weight-semibold tab mx-25',current === index ? clsx('has-text-primary', styles['is-active']) : clsx('is-ghost has-text-black', styles['is-inactive'])),
  });

  useEffect(() => {
    const loop = setInterval(() => setCurrent(current !== 4 ? current + 1 : 0), 5000);
    return () => clearInterval(loop);
  });

  return (
    <>
      <div className="tabs is-centered">
        <ul>
          <li>
            <a {...buttonProps(0)}>
              Reactions
            </a>
          </li>
          <li>
            <a {...buttonProps(1)}>
              Tags
            </a>
          </li>
          <li>
            <a {...buttonProps(2)}>
              Suggested Comments
            </a>
          </li>
          <li>
            <a {...buttonProps(3)}>
              Developer Insights
            </a>
          </li>
          <li>
            <a {...buttonProps(4)}>
              Social Graph
            </a>
          </li>
        </ul>
      </div>
      <div className={clsx(styles.slider)}>
        <Reactions current={current} />
        <Tags current={current} />
        <SuggestedComments current={current} />
        <DeveloperInsights current={current} />
        <SocialGraph current={current} />
        {/* {renderImage()} */}
      </div>
    </>
  );
};

const TileAncestor = ({ children, active }) => (
  <>
    {/* <div className={clsx('tile is-ancestor mt-50', active ? 'slid active' : 'slid')}> */}
    <div className={`tile is-ancestor mt-50 ${active ? 'slide active' : 'slide'}`}>
      {children}
    </div>

  </>
);

const Reactions = ({ current }) => (
  <>
    <TileAncestor active={current === 0}>
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

const Tags = ({ current }) => (
  <>
    <TileAncestor active={current == 1}>
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

const SuggestedComments = ({ current }) => (
  <>
    <TileAncestor active={current === 2}>
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

const DeveloperInsights = ({ current }) => (
  <>
    <TileAncestor active={current === 3}>
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

const SocialGraph = ({ current }) => (
  <>
    <TileAncestor active={current === 4}>
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
