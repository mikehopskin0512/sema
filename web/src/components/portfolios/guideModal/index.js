import clsx from 'clsx';
import React from 'react';
import styles from './guideModal.module.scss';
import { modalDetails } from './data';

const Number = ({ value }) => (
  <span className={clsx(styles.number, 'has-text-weight-semibold')}>
    {value}
  </span>
);

const PortfolioGuideModal = ({ isActive, onClose }) => (
  <>
    <div className={clsx('modal', isActive && 'is-active')}>
      <div className="modal-background" />
      <div className={clsx('modal-card px-10', styles.modalContent)}>
        <header className={clsx('modal-card-head', styles.header)}>
          <p className="modal-card-title has-text-weight-semibold">How to Add Snapshot to Your Portfolio</p>
          <button className="delete" aria-label="close" type="button" onClick={onClose} />
        </header>
        <section className="modal-card-body">
          {modalDetails.map((d, index) => {
            const body = (
              <div className="is-flex">
                <Number value={index + 1} />
                <div className='is-flex is-flex-direction-column'>
                  {d.title && <div className='has-text-weight-bold'>{d.title}</div> }
                  <span className="has-text-weight-semibold">
                    {d.content}
                  </span>
                </div>
              </div>
            );
            const img = <img src={d.img} alt={d.alt} width={d.width} height={d.height} />;
            const leftContent = index === 1 ? body : img;
            const rightContent = index === 1 ? img : body;
            return (
              <div className={clsx(styles.container)}>
                <div className="columns mx-20 is-align-items-center">
                  <div className={`column is-flex is-justify-content-flex-start ${d.leftColumn} `}>
                    {leftContent}
                  </div>
                  <div className={`column is-flex is-justify-content-flex-end ${d.rightColumn}`}>
                    {rightContent}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  </>
);

export default PortfolioGuideModal;
