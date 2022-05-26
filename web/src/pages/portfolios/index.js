import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PageTabs from '../../components/pageTabs';
import { ListIcon, Trophy2Icon } from '../../components/Icons';
import withLayout from '../../components/layout';
import useAuthEffect from '../../hooks/useAuthEffect';
import { portfoliosOperations } from '../../state/features/portfolios';
import { fetchUserSnapshots } from '../../state/features/snapshots/actions';
import { PATHS } from '../../utils/constants';
import PortfolioList from './components/portfolioList';
import SnapshotList from './components/snapshotList';
import { gray400, gray200 } from '../../../styles/_colors.module.scss';

const { fetchPortfoliosOfUser } = portfoliosOperations;

const Portfolios = () => {
  const dispatch = useDispatch();
  const { authState, portfoliosState } = useSelector((state) => state);
  const { data: { portfolios } } = portfoliosState;
  const { user: userData, token } = authState;
  const { _id: userId = '', handle } = userData;
  const router = useRouter();
  const { query: { tab } } = router;

  useAuthEffect(() => {
    dispatch(fetchPortfoliosOfUser(userId, token));
    dispatch(fetchUserSnapshots(userId, token));
  }, [userId]);

  useAuthEffect(() => {
    if (tab === 'snapshots') {
      return;
    }
    if (portfolios.length > 1) {
      router.push(PATHS.PORTFOLIO.PORTFOLIOS);
    }
  }, [portfolios]);

  useEffect(() => {
    dispatch(fetchPortfoliosOfUser(userId, token));
  }, []);

  const tabs = [
    {
      label: 'Portfolio Library',
      path: PATHS.PORTFOLIO.PORTFOLIOS,
      id: 'portfolios',
      icon: <Trophy2Icon size="small" />,
    },
    {
      label: 'Snapshot Library',
      path: PATHS.PORTFOLIO.SNAPSHOTS,
      id: 'snapshots',
      icon: <ListIcon size="small" />,
    },
  ];

  return (
    <>
      <div
        className="has-background-white"
        style={{
          boxShadow: `inset 0px -1px 0px ${gray400}`,
          borderTop: `1px solid ${gray200}`,
        }}
      >
        <div className="container pt-32">
          <Helmet title="Portfolio Manager" />
          <h1 className="title mb-12">Portfolio Manager</h1>
          <p className="mb-24">Create and edit portfolios, curate Snapshots, and manage privacy settings.</p>
          <PageTabs tabs={tabs} />
        </div>
      </div>
      <div className="container">
        <div className="has-background-white-50">
          <div className="hero-body pt-0 pb-100 px-0">
            {tab === tabs[0].id && <PortfolioList />}
            {tab === tabs[1].id && <SnapshotList />}
          </div>
        </div>
      </div>
    </>
  );
};

export default withLayout(Portfolios);
