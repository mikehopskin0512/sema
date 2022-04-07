import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './deleteModal.module.scss';

import { CloseIcon } from '../../Icons';

const DeleteModal = ({
  isModalActive,
  toggleModalActive,
  onSubmit,
  type = 'snapshot',
  bodyContent,
  bodyPaddings,
  headerClass,
  additionalWrapperClass,
  titleClass,
  crossClass,
}) => (
  <>
    <div className={clsx("modal", isModalActive && "is-active")}>
      <div className='modal-background' />
      <div className={clsx("modal-card", styles.modal, additionalWrapperClass)}>
        <header
          className={clsx(
            "modal-card-head has-background-white is-align-items-flex-start",
            !headerClass && styles["modal-head"],
            headerClass
          )}
        >
          <div className='is-full-width'>
            <p
              className={clsx(
                "modal-card-title has-text-weight-semibold",
                titleClass
              )}
            >
              {`Do you want to delete this ${type === 'snapshot' ? 'Snapshot' : 'portfolio'}?`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleModalActive(false)}
            className={clsx(
              "button is-ghost has-text-black-900",
              crossClass,
              styles["close-btn"]
            )}
          >
            <CloseIcon size='medium' />
          </button>
          {/* <div onClick={() => toggleModalActive(false)} className="is-clickable" style={{ position: 'absolute', top: 20, right: 30 }}>
          </div>
          <button
            type="button"
            className="mt-5 delete"
            aria-label="close"
            onClick={() => toggleModalActive(false)}
          /> */}
        </header>
        <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
          <div className={bodyPaddings ?? "p-30"}>
            {bodyContent ?? null}
            <div className='is-flex is-align-items-center is-justify-content-space-between mt-20'>
              <div />
              <div>
                <button
                  type="button"
                  className="button"
                  onClick={() => toggleModalActive(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button is-error ml-10"
                  onClick={onSubmit}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </>
);

DeleteModal.propTypes = {
  isModalActive: PropTypes.bool.isRequired,
  toggleModalActive: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default DeleteModal;
