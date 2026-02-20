const AppError = require('../utils/appError');

const isValidSymbol = (symbol) => /^[A-Za-z.]{1,10}$/.test(symbol);

const validateSymbolParam = (req, res, next) => {
  const { symbol } = req.params;
  if (!symbol || !isValidSymbol(symbol)) {
    return next(new AppError('Invalid stock symbol format', 400));
  }

  req.params.symbol = symbol.toUpperCase();
  return next();
};

const validateHistoryQuery = (req, res, next) => {
  const { from, to, resolution } = req.query;

  if (from && Number.isNaN(Number(from))) {
    return next(new AppError('Query param "from" must be a unix timestamp', 400));
  }

  if (to && Number.isNaN(Number(to))) {
    return next(new AppError('Query param "to" must be a unix timestamp', 400));
  }

  if (resolution && !['1', '5', '15', '30', '60', 'D', 'W', 'M'].includes(resolution)) {
    return next(new AppError('Invalid resolution. Use 1,5,15,30,60,D,W,M', 400));
  }

  return next();
};

const validatePortfolioPayload = (req, res, next) => {
  const { symbol, quantity, averagePrice } = req.body;

  if (!symbol || !isValidSymbol(symbol)) {
    return next(new AppError('Valid symbol is required', 400));
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return next(new AppError('Quantity must be a positive number', 400));
  }

  if (!Number.isFinite(averagePrice) || averagePrice <= 0) {
    return next(new AppError('Average price must be a positive number', 400));
  }

  req.body.symbol = symbol.toUpperCase();
  req.body.quantity = Number(quantity);
  req.body.averagePrice = Number(averagePrice);
  return next();
};

const validateRegisterPayload = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return next(new AppError('Name must be at least 2 characters long', 400));
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  return next();
};

const validateLoginPayload = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  return next();
};

module.exports = {
  validateSymbolParam,
  validateHistoryQuery,
  validatePortfolioPayload,
  validateRegisterPayload,
  validateLoginPayload
};