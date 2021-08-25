import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './emptyRepo.module.scss';
import { content } from './content';

const EmptyRepo = () => {
  const [title1] = useState('No Smart Repos Yet!');
  const [subtitle1] = useState('Make some code reviews on Github with the Sema Plugin installed and your Repos will appear here.');

  const formatSubtitle = (str) => {
    const arr = str.split(' ');
    let formatted = arr.slice(0, 4).join(' ');
    const rest = arr.slice(4, arr.length).join(' ');
    formatted = `<strong>${formatted}</strong>`;
    return `${formatted} ${rest}`;
  };

  return (
    <div className="hero">
      <div className="hero-body m-50 p-50">
        <div className="tile is-ancestor mb-50">
          <div className="is-parent is-full-width">
            <div className="tile is-child py-30 box has-text-centered">
              <h1 className="has-text-weight-semibold is-size-3 mt-15">{title1}</h1>
              <h2 className={clsx('is-size-5 pb-20', styles.subtitle)}>{subtitle1}</h2>
              <a href="https://github.com">
                <button type="button" className="button is-primary mb-20 has-text-weight-semibold is-size-5">Review codes on Github</button>
              </a>
              <div className="columns">
                {
                  content.map((d, i) => {
                    const { img, title, subtitle } = d;
                    const sub = formatSubtitle(subtitle);
                    return (
                      <React.Fragment key={i}>
                        <div className={clsx('column p-25 mb-25 is-hidden-mobile')}>
                          <div className={clsx(styles.tile, 'tile is-child colored-shadow box is-flex is-flex-direction-column is-justify-content-center')}>
                            <div className={clsx(styles.img, 'is-flex is-justify-content-center is-align-items-center mb-25')}>
                              <img src={img} alt="gif" className="is-full-width" />
                            </div>
                            <h1 className="title has-text-primary has-text-left is-size-4">{title}</h1>
                            <h2 className="subtitle has-text-left is-size-5" dangerouslySetInnerHTML={{ __html: sub }} />
                          </div>
                        </div>
                        <div className={clsx('column p-2 mb-10 is-hidden-desktop')}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyRepo;
