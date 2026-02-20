const asyncHandler = require('../utils/asyncHandler');
const stockApiService = require('../services/stockApiService');

exports.getTrendingStocks = asyncHandler(async (req, res) => {
  const data = await stockApiService.getTrendingStocks();

  res.status(200).json({
    success: true,
    data
  });
});