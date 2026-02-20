require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');

const printEndpoints = (port) => {
  const baseUrl = `http://localhost:${port}`;
  console.log('🔗 Available API endpoints:');
  console.log(`   GET  ${baseUrl}/health`);
  console.log(`   GET  ${baseUrl}/auth/login (usage help)`);
  console.log(`   GET  ${baseUrl}/auth/register (usage help)`);
  console.log(`   POST ${baseUrl}/auth/login`);
  console.log(`   POST ${baseUrl}/auth/register`);
  console.log(`   POST ${baseUrl}/api/auth/register`);
  console.log(`   POST ${baseUrl}/api/auth/login`);
  console.log(`   GET  ${baseUrl}/api/stocks/all?exchange=US&limit=100`);
  console.log(`   GET  ${baseUrl}/api/stock/all?exchange=US&limit=100`);
  console.log(`   GET  ${baseUrl}/api/stocks/:symbol`);
  console.log(`   GET  ${baseUrl}/api/stocks/:symbol/profile`);
  console.log(`   GET  ${baseUrl}/api/stocks/:symbol/history?from=<unix>&to=<unix>&resolution=D`);
  console.log(`   GET  ${baseUrl}/api/market/trending`);
  console.log(`   POST ${baseUrl}/api/portfolio (Bearer token required)`);
  console.log(`   GET  ${baseUrl}/api/portfolio (Bearer token required)`);
};

const startServer = async () => {
  validateEnv();
  await connectDB();

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`📈 Stock API base URL: ${process.env.STOCK_API_BASE_URL}`);
    printEndpoints(port);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});