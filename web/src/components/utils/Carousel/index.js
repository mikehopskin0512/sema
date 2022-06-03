import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faTag, faCommentAlt, faUserTie, faUsers } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from 'react-transition-group';
import styles from './carousel.module.scss';
import carouselData from './data';

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [screens] = useState(['Summaries', 'Tags', 'Snippets', 'Developer Insights', 'Social Graph']);
  const buttonProps = (index) => ({
    onClick: () => setCurrent(index),
    className: clsx('is-uppercase is-size-5 has-text-weight-semibold tab mx-25', current === index ? clsx('has-text-primary', styles['is-active']) : clsx('is-ghost has-text-black', styles['is-inactive'])),
  });
  const buttonPropsMobile = (index) => ({
    onClick: () => setCurrent(index),
    className: clsx('is-uppercase is-size-4 has-text-weight-semibold tab mx-10 is-flex is-flex-direction-column', current === index ? clsx('has-text-primary', styles['is-active']) : clsx('is-ghost has-text-black', styles['is-inactive'])),
  });

  useEffect(() => {
    const loop = setInterval(() => setCurrent(current !== 4 ? current + 1 : 0), 5000);
    return () => clearInterval(loop);
  });

  return (
    <>
      <div className="tabs is-centered">
        <ul className="is-hidden-mobile">
          <li>
            <a {...buttonProps(0)}>
              Summaries
            </a>
          </li>
          <li>
            <a {...buttonProps(1)}>
              Tags
            </a>
          </li>
          <li>
            <a {...buttonProps(2)}>
              Snippets
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
        <ul className="is-hidden-desktop">
          <li>
            <a {...buttonPropsMobile(0)}>
              <FontAwesomeIcon icon={faTrophy} />
            </a>
          </li>
          <li>
            <a {...buttonPropsMobile(1)}>
              <FontAwesomeIcon icon={faTag} />
            </a>
          </li>
          <li>
            <a {...buttonPropsMobile(2)}>
              <FontAwesomeIcon icon={faCommentAlt} />
            </a>
          </li>
          <li>
            <a {...buttonPropsMobile(3)}>
              <FontAwesomeIcon icon={faUserTie} />
            </a>
          </li>
          <li>
            <a {...buttonPropsMobile(4)}>
              <FontAwesomeIcon icon={faUsers} />
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
      </div>
    </>
  );
};

const TileAncestor = ({ children, active, className }) => (
  <>
    {/* <div className={clsx('tile is-ancestor mt-50', active ? 'slid active' : 'slid')}> */}
    {/* Desktop View */}
    <div className={`tile is-ancestor mt-50 slide is-hidden-touch ${active ? 'active' : ''}`}>
      {children}
    </div>
    {/* Mobile View */}
    <div className={`mt-50 slide is-hidden-desktop ${active ? 'active' : ''}`}>
      {children}
    </div>
  </>
);

const Reactions = ({ current }) => (
  <>
    <TileAncestor active={current === 0}>
      {/* Desktop View */}
      <div className="tile is-horizontal is-12 is-hidden-touch">
        <div className="tile is-1" />
        <div className="tile is-4 is-parent is-vertical mt-70 pl-70">
          <p className="title">Summaries</p>
          <p className="subtitle">Provide a simple, clear summary of the review -- if you want to.</p>
        </div>
        <div className="tile is-7">
          <img src={carouselData[0]} alt="summaries" />
        </div>
      </div>
      {/* Mobile View */}
      <div className="is-hidden-desktop is-flex is-flex-direction-column px-50">
        <p className="is-size-5-mobile has-text-weight-semibold">Summaries</p>
        <p className="is-size-6-mobile">Provide a simple, clear summary of the review -- if you want to.</p>
        <figure className="image is-4by3 mt-20">
          <img src={carouselData[0]} alt="summaries" className={styles['mobile-img']} />
        </figure>
      </div>
    </TileAncestor>
  </>
);

const Tags = ({ current }) => (
  <>
    <TileAncestor active={current == 1}>
      {/* Desktop View */}
      <div className="tile is-horizontal is-12 is-hidden-touch">
        <div className="tile is-1" />
        <div className="tile is-7">
          <img src={carouselData[1]} alt="tags" className="" />
        </div>
        <div className="tile is-4 is-parent is-vertical mt-70">
          <p className="title">Add Tags</p>
          <p className="subtitle">Describe the code in positive or constructive coding characteristics -- so the organization can learn and grow, and great code can be tagged for future training.</p>
        </div>
      </div>
      {/* Mobile View */}
      <div className="is-hidden-desktop is-flex is-flex-direction-column px-50">
        <p className="is-size-5-mobile has-text-weight-semibold">Add Tags</p>
        <p className="is-size-6-mobile">Describe the code in positive or constructive coding characteristics -- so the organization can learn and grow, and great code can be tagged for future training.</p>
        <figure className="image is-4by3 mt-20">
          <img src={carouselData[1]} alt="tags" className={styles['mobile-img']} />
        </figure>
      </div>
    </TileAncestor>
  </>
);

const SuggestedComments = ({ current }) => (
  <>
    <TileAncestor active={current === 2}>
      {/* Desktop View */}
      <div className="tile is-horizontal is-12 is-hidden-mobile">
        <div className="tile is-1" />
        <div className="tile is-5 is-parent is-vertical mt-70 pr-20">
          <p className="title">Snippets</p>
          <p className="subtitle">Use pre-written comments from some of the world’s best sources of coding knowledge -- to save time and improve clarity. </p>
        </div>
        <div className="tile is-6">
          <img src={carouselData[2]} alt="snippets" className="" />
        </div>
      </div>
      {/* Mobile View */}
      <div className="is-hidden-desktop is-flex is-flex-direction-column px-50">
        <p className="is-size-5-mobile has-text-weight-semibold">Snippets</p>
        <p className="is-size-6-mobile">Use pre-written comments from some of the world’s best sources of coding knowledge -- to save time and improve clarity.</p>
        <figure className="image is-4by3 mt-20">
          <img src={carouselData[2]} alt="snippets" className={styles['mobile-img']} />
        </figure>
      </div>
    </TileAncestor>
  </>
);

const DeveloperInsights = ({ current }) => (
  <>
    <TileAncestor active={current === 3}>
      {/* Desktop View */}
      <div className="tile is-horizontal is-12 is-hidden-mobile">
        <div className="tile is-1" />
        <div className="tile is-6">
          <img src={carouselData[3]} alt="developer-insights" className="" />
        </div>
        <div className="tile is-4 is-parent is-vertical mt-50">
          <p className="title">Developer Insights</p>
          <p className="subtitle">Each Engineer develops a lasting, shared record of their contributions and skill development in their Sema Profile</p>
        </div>
      </div>
      {/* Mobile View */}
      <div className="is-hidden-desktop is-flex is-flex-direction-column px-50">
        <p className="is-size-5-mobile has-text-weight-semibold">Developer Insights</p>
        <p className="is-size-6-mobile">Each Engineer develops a lasting, shared record of their contributions and skill development in their Sema Profile</p>
        <figure className="image is-5by4 mt-20">
          <img src={carouselData[3]} alt="developer-insights" className={styles['mobile-img']} />
        </figure>
      </div>
    </TileAncestor>
  </>
);

const SocialGraph = ({ current }) => (
  <>
    <TileAncestor active={current === 4}>
      {/* Desktop View */}
      <div className="tile is-horizontal is-12 is-hidden-mobile">
        <div className="tile is-1" />
        <div className="tile is-4 is-parent is-vertical">
          <p className="title mt-70">Social Graph</p>
          <p className="subtitle">The Sema Review Graph drives skill discovery, continuous professional development, and greater social cohesion.</p>
        </div>
        <div className="tile is-7">
          <img src={carouselData[4]} alt="social-graph" className="" />
        </div>
      </div>
      {/* Mobile View */}
      <div className="is-hidden-desktop is-flex is-flex-direction-column px-50">
        <p className="is-size-5-mobile has-text-weight-semibold">Social Graph</p>
        <p className="is-size-6-mobile">The Sema Review Graph drives skill discovery, continuous professional development, and greater social cohesion.</p>
        <figure className="image is-5by4 mt-20">
          <img src={carouselData[4]} alt="social-graph" className={styles['mobile-img']} />
        </figure>
      </div>
    </TileAncestor>
  </>
);

export default Carousel;
