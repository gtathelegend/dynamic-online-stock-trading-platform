const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'STOCK_API_KEY'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!process.env.STOCK_API_BASE_URL) {
    process.env.STOCK_API_BASE_URL = 'https://finnhub.io/api/v1';
  }

  if (!process.env.JWT_EXPIRES_IN) {
    process.env.JWT_EXPIRES_IN = '1d';
  }
};

module.exports = { validateEnv };