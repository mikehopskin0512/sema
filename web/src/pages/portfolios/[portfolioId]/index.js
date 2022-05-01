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

const { fetchPortfolio } = portfoliosOperations;

const PublicPortfolio = () => {
  const router = useRouter();
  const {
    query: { portfolioId },
  } = router;
  const portfolioRef = useRef(null);
  const dispatch = useDispatch();
  const { token, portfolios, publicPortfolio, isLoading } = useSelector(
    (state) => ({
      token: state.authState.token,
      portfolios: state.portfoliosState.data.portfolios,
      publicPortfolio: state.portfoliosState.data.portfolio,
      isLoading: state.portfoliosState.isFetching
    }),
  );

  const [isPdfCreating, toggleIsPdfCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchPortfolio(portfolioId));
  }, [portfolioId, dispatch, token]);

  const portfolio = portfolios.find(({ _id }) => _id === portfolioId) || publicPortfolio;

  const savePdf = async () => {
    toggleIsPdfCreating(true);
    notify('Downloading the PDF has started', { type: ALERT_TYPES.SUCCESS, duration: 100000 });
    setTimeout(async () => {
      await savePdfDocument(portfolioRef);
      toggleIsPdfCreating(false);
    }, 0);
  }

  return (
    <div className="has-background-white hero">
      <Helmet {...PortfolioHelmet} />
      <div className="hero-body pb-300 mx-25" ref={portfolioRef}>
        {portfolio && (
          <PortfolioDashboard
            portfolio={portfolio}
            isIndividualView
            isLoading={isLoading}
            pdfView={isPdfCreating}
            savePdf={savePdf}
          />
        )}
      </div>
    </div>
  );
};

export default withLayout(PublicPortfolio);
