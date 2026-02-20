const DEFAULT_TRENDING_SYMBOLS = [
  'AAPL',
  'MSFT',
  'NVDA',
  'AMZN',
  'GOOGL',
  'META',
  'TSLA',
  'NFLX',
  'AMD',
  'INTC'
];

module.exports = {
  DEFAULT_TRENDING_SYMBOLS,
  CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS) || 30
};