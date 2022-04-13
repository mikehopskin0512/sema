export const updatePortfolioFieldById = (portfolios, portfolioId, field, value) => {
  const portfolio = portfolios.find(({ _id }) => _id === portfolioId);
  portfolio[field] = value;
  return portfolios;
};

export const updatePortfolioType = (state, portfolioId, type) => {
  return {
    ...state,
    data: {
      ...state.data,
      portfolios: updatePortfolioFieldById(
        [...state.data.portfolios],
        portfolioId,
        'type',
        type,
      ),
    },
    isFetching: false,
  };
};
