const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const stockApiService = require('../services/stockApiService');

exports.addToPortfolio = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { symbol, quantity, averagePrice } = req.body;

  const normalizedSymbol = symbol.toUpperCase();
  const profile = await stockApiService.getCompanyProfile(normalizedSymbol);

  if (!profile || !profile.symbol) {
    throw new AppError('Invalid stock symbol', 400);
  }

  const stockRecord = await Stock.findOneAndUpdate(
    { symbol: normalizedSymbol },
    {
      symbol: normalizedSymbol,
      name: profile.name || normalizedSymbol,
      exchange: profile.exchange || 'N/A',
      currency: profile.currency || 'USD',
      type: profile.finnhubIndustry || 'Equity'
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  let portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) {
    portfolio = await Portfolio.create({ user: userId, holdings: [] });
  }

  const existingHolding = portfolio.holdings.find((item) => item.symbol === normalizedSymbol);

  if (existingHolding) {
    const newQuantity = existingHolding.quantity + quantity;
    const totalCost = existingHolding.averagePrice * existingHolding.quantity + averagePrice * quantity;

    existingHolding.quantity = Number(newQuantity.toFixed(4));
    existingHolding.averagePrice = Number((totalCost / newQuantity).toFixed(4));
    existingHolding.stock = stockRecord._id;
  } else {
    portfolio.holdings.push({
      stock: stockRecord._id,
      symbol: normalizedSymbol,
      quantity,
      averagePrice
    });
  }

  await portfolio.save();

  res.status(201).json({
    success: true,
    message: 'Stock added to portfolio',
    data: portfolio
  });
});

exports.getPortfolio = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const portfolio = await Portfolio.findOne({ user: userId })
    .populate('holdings.stock', 'symbol name exchange currency')
    .lean();

  if (!portfolio) {
    throw new AppError('Portfolio not found for current user', 404);
  }

  const summary = portfolio.holdings.reduce(
    (acc, holding) => {
      acc.totalQuantity += holding.quantity;
      acc.totalInvested += holding.quantity * holding.averagePrice;
      return acc;
    },
    { totalQuantity: 0, totalInvested: 0 }
  );

  res.status(200).json({
    success: true,
    data: {
      ...portfolio,
      summary: {
        totalQuantity: Number(summary.totalQuantity.toFixed(4)),
        totalInvested: Number(summary.totalInvested.toFixed(2))
      }
    }
  });
});