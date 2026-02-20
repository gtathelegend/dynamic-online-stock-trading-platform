require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');

const startServer = async () => {
  validateEnv();
  await connectDB();

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`📈 Stock API base URL: ${process.env.STOCK_API_BASE_URL}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});