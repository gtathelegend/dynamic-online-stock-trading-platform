const asyncHandler = require('../utils/asyncHandler');
const stockApiService = require('../services/stockApiService');

exports.getAllStocks = asyncHandler(async (req, res) => {
  const { exchange, mic, limit } = req.query;
  const data = await stockApiService.getAllStocks({ exchange, mic, limit });

  res.status(200).json({
    success: true,
    data
  });
});

exports.getLivePrice = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const data = await stockApiService.getLivePrice(symbol);

  res.status(200).json({
    success: true,
    data
  });
});

exports.getCompanyProfile = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const data = await stockApiService.getCompanyProfile(symbol);

  res.status(200).json({
    success: true,
    data
  });
});

exports.getHistory = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const { from, to, resolution } = req.query;
  const data = await stockApiService.getHistoricalData(symbol, { from, to, resolution });

  res.status(200).json({
    success: true,
    data
  });
});