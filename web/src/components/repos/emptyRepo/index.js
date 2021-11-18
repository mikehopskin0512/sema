import React, { useState } from 'react';
import Lottie from 'react-lottie-player';
import clsx from 'clsx';
import { PlayIcon } from '../../Icons';
import styles from './emptyRepo.module.scss';
import { content } from './content';

const EmptyRepo = () => {
  const [hovered, setHovered] = useState(null);
  const [title1] = useState('No Smart Repos Yet!');
  const [subtitle1] = useState('Make some code reviews on GitHub with the Sema Plugin installed and your Repos will appear here.');

  const formatSubtitle = (str) => {
    const arr = str.split(' ');
    let formatted = arr.slice(0, 4).join(' ');
    const rest = arr.slice(4, arr.length).join(' ');
    formatted = `<strong>${formatted}</strong>`;
    return `${formatted} ${rest}`;
  };

  const onHover = (item) => {
    setHovered(item);
  };

  const onRemoveHover = () => {
    setHovered(null);
  };

  return (
    <div className="hero content-container">
      <div className={clsx('hero-body', styles.container)}>
        <div className="tile is-ancestor mb-50">
          <div className="is-parent is-full-width">
            <div className="tile is-child py-30 px-40 box has-text-centered">
              <h1 className="has-text-weight-semibold is-size-3 mt-15">{title1}</h1>
              <h2 className={clsx('is-size-5 pb-20 px-230', styles.subtitle)}>{subtitle1}</h2>
              <div className={clsx('columns')}>
                {
                  content.map((d, i) => {
                    const { img, title, subtitle, animationData } = d;
                    const sub = formatSubtitle(subtitle);
                    return (
                      <React.Fragment key={i}>
                        <div className={clsx('column p-25 mb-25', styles['desktop-view'])}>
                          <div className={clsx(styles.tile, 'tile is-child colored-shadow box is-flex is-flex-direction-column is-justify-content-flex-start')}>
                            <div
                              className={clsx(styles['img-container'], 'is-flex is-justify-content-start is-align-items-start mb-25')}
                              onMouseEnter={() => onHover(title)}
                              onMouseLeave={() => onRemoveHover()}
                            >
                              { hovered === title ? (
                                <Lottie
                                  play={hovered === title}
                                  loop
                                  animationData={animationData}
                                  style={{ marginBottom: 10 }}
                                />
                              ) : (
                                <>
                                  <div className={clsx(styles['button-play'])}>
                                    <PlayIcon size="large" />
                                  </div>
                                  <img src={img} className={styles.img} alt={title} />
                                </>
                              ) }
                            </div>
                            <span className="title has-text-primary has-text-left is-size-5">{title}</span>
                            <span className="subtitle has-text-left is-size-6" dangerouslySetInnerHTML={{ __html: sub }} />
                          </div>
                        </div>
                        <div className={clsx('column p-2 mb-10', styles['mobile-view'])}>
                          <div className={clsx(styles.tile, 'tile is-child colored-shadow box is-flex is-flex-direction-column is-align-items-center')}>
                            <div className={clsx(styles.img, 'is-flex is-justify-content-center is-align-items-center mt-25')}>
                              <img src={img} alt="gif" />
                            </div>
                            <h1 className="title has-text-primary has-text-left is-size-4 mt-30">{title}</h1>
                            <h2 className="subtitle has-text-left is-size-5" dangerouslySetInnerHTML={{ __html: sub }} />
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                }
              </div>
              <a href="https://github.com" rel="noopener noreferrer" target="_blank">
                <button type="button" className="button is-primary mb-20 has-text-weight-semibold is-size-5">Review some code on GitHub</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyRepo;
