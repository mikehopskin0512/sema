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
    <>
      <div className="tile is-ancestor mt-120 m-90 ">
        <div className="is-parent is-full-width">

          <div className="tile is-child box p-50 pt-70 has-text-centered">
            <h1 className="title">{title1}</h1>
            <h2 className={clsx('subtitle pb-20', styles.subtitle)}>{subtitle1}</h2>
            <div className="columns">
              {
                content.map((d) => {
                  const { img, title, subtitle } = d;
                  const sub = formatSubtitle(subtitle);
                  return (
                    <div className={clsx('column p-25 mb-25')}>
                      <div className={clsx(styles.tile, 'tile is-child colored-shadow box')}>
                        <div className={clsx(styles.img, 'is-flex is-justify-content-center is-align-items-center mb-25')}>
                          <img src={img} alt="gif" className="is-full-width" />
                        </div>
                        <h1 className="title has-text-primary has-text-left is-size-4">{title}</h1>
                        <h2 className="subtitle has-text-left is-size-5" dangerouslySetInnerHTML={{ __html: sub }} />
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <button type="button" className="button is-primary">Go to Github</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default EmptyRepo;
