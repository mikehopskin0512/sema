import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { PortfolioHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import PortfolioDashboard from '../../../components/portfolios/dashboard';
import { portfoliosOperations } from '../../../state/features/portfolios';
import { savePdfDocument } from '../../../utils/pdfHelpers';
import { notify } from '../../../components/toaster/index';
import { ALERT_TYPES } from '../../../utils/constants';
import ErrorPage from '../../../components/portfolios/errorPage';
import useAuthEffect from '../../../hooks/useAuthEffect';

const { fetchPortfolioByHandle } = portfoliosOperations;

const PublicPortfolio = () => {
  const router = useRouter();
  const {
    query: { portfolioId, handle },
  } = router;
  const portfolioRef = useRef(null);
  const dispatch = useDispatch();
  const { token, portfoliosState, publicPortfolio, isLoading } = useSelector(
    (state) => ({
      token: state.authState.token,
      portfoliosState: state.portfoliosState,
      publicPortfolio: state.portfoliosState.data.portfolio,
      isLoading: state.portfoliosState.isFetching
    }),
  );

  const portfolios = portfoliosState?.data.portfolios || []

  const [isPdfCreating, toggleIsPdfCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchPortfolioByHandle(handle, portfolioId, token));
  }, [handle, portfolioId, dispatch, token]);

  const portfolio = portfolios.find(({ _id }) => _id === portfolioId) || publicPortfolio;

  const savePdf = async () => {
    const errorAction = () => {
      toggleIsPdfCreating(false);
      notify('Sorry, this Portfolio is too big to save.',
        { type: ALERT_TYPES.ERROR, description: 'Please reduce the Portfolio to under 25 pages.' });
    };

    toggleIsPdfCreating(true);
    notify('Downloading the PDF has started', { type: ALERT_TYPES.SUCCESS, duration: 100000 });
    setTimeout(async () => {
      await savePdfDocument(portfolioRef, errorAction);
      toggleIsPdfCreating(false);
    }, 0);
  }

  return (
    <div className="has-background-white hero">
      <Helmet {...PortfolioHelmet} />
      <div className="hero-body pb-300 mx-25" ref={portfolioRef}>
        {!isLoading && portfoliosState?.errorData?.portfolio?.isPublic === false
          ? <ErrorPage />
          : portfolio && (
            <PortfolioDashboard
              portfolio={portfolio}
              isIndividualView
              isLoading={isLoading}
              pdfView={isPdfCreating}
              savePdf={savePdf}
            />
          )
        }
      </div>
    </div>
  );
};

export default withLayout(PublicPortfolio);
