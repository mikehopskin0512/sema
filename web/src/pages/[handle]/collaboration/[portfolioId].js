import React, { useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolioByHandle } from '../../../state/features/portfolios/actions';
import Loader from '../../../components/Loader';
import { PATHS } from '../../../utils/constants';

const CollaborationPublicPage = () => {
  const { query, push } = useRouter();
  const dispatch = useDispatch();
  const {
    data: portfoliosStateData,
    isFetching,
  } = useSelector((state) => state.portfoliosState);
  const {
    handle,
    portfolioId,
  } = query;
  const { portfolio } = portfoliosStateData;

  useEffect(() => {
    dispatch(fetchPortfolioByHandle(handle, portfolioId));
  }, []);

  const onStartButtonClick = async () => {
    await push(`${PATHS.LOGIN}?isFastForwardOnboarding=true`)
  };

  const title = useMemo(() => `${portfolio?.firstName}'s Repo Colleagues for ${portfolio?.title}`, [query, portfolio]);

  return (
    <div className={styles['collaboration-page-wrapper']}>
      {isFetching && (
        <div className='is-flex is-align-items-center is-justify-content-center' style={{ height: '50vh' }}>
          <Loader customText='Loading' />
        </div>
      )}

      {!isFetching && (
        <>
          <div className={styles['collaboration-page-header']}>
            <p className={styles['collaboration-page-title']}>{title}</p>
            <img className={styles['collaboration-page-logo']} alt='Sema logo' src='/img/logo-full.png' />
          </div>
          <div className={styles['collaboration-page-logo-content']}>
            <div className={styles['collaboration-page-fake-graph']} />
            <span className={styles['collaboration-page-title']}>Let’s create your GitHub Social Circle.</span>
            <button className='button is-primary my-25' onClick={onStartButtonClick}>Get Started!</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CollaborationPublicPage;
