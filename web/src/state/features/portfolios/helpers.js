export const updatePortfolioFieldById = (portfolios, portfolioId, field, value) => {
  const portfolio = portfolios.find(({ _id }) => _id === portfolioId);
  portfolio[field] = value;
  return portfolios;
};
