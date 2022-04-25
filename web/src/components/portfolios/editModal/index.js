import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { InputField } from 'adonis';
import { useDispatch } from 'react-redux';
import { updatePortfolioOverview } from '../../../state/features/portfolios/actions';
import Toaster from '../../toaster';
import styles from './editModal.module.scss';
import { SEMA_FAQ_SLUGS, SEMA_FAQ_URL } from '../../../utils/constants';

const EditPortfolio = ({ isModalActive, toggleModalActive, profileOverview, portfolioId }) => {
  const [overview, setOverview] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setOverview(profileOverview);
  }, [profileOverview]);

  const onSubmit = async () => {
    dispatch(updatePortfolioOverview(portfolioId, overview));
    toggleModalActive(false);
  };

  return (
    <>
      <div className={clsx('modal', isModalActive && 'is-active')}>
        <div className="modal-background" />
        <div className={clsx('modal-card', styles.modal)}>
          <header className="modal-card-head has-background-white">
            <p className="modal-card-title has-text-weight-semibold">Edit Overview</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => toggleModalActive(false)}
            />
          </header>
          <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
            <div className="p-30">
              <div className="has-text-weight-semibold is-size-6">Overview</div>
              <InputField
                isMultiLine
                className="mt-10 has-fixed-size"
                placeholder="Add your personal overview"
                rows="5"
                value={overview}
                onChange={(v) => setOverview(v)}
              />
              {/* TODO: Will be added after markdown implementation */}
              <div className="is-flex is-align-items-center is-justify-content-space-between mt-20">
                <div>
                  {/* You can use markdown to format your personal overview.
                  <a href={`${SEMA_FAQ_URL}#${SEMA_FAQ_SLUGS.MARKDOWN}`}>
                    <span className="ml-20 has-text-primary">
                      Learn More
                    </span>
                  </a> */}
                </div>
                <div>
                  <button type="button" className="button" onClick={() => toggleModalActive(false)}>Cancel</button>
                  <button type="button" className="button is-primary ml-10" onClick={() => onSubmit({ overview })}>Save changes</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

EditPortfolio.propTypes = {
  isModalActive: PropTypes.bool.isRequired,
  toggleModalActive: PropTypes.func.isRequired,
  profileOverview: PropTypes.string.isRequired,
  portfolioId: PropTypes.string.isRequired,
};

export default EditPortfolio;
