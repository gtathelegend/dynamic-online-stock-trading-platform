const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const connection = await mongoose.connect(mongoUri, {
    autoIndex: true,
    maxPoolSize: 10
  });

  console.log(`✅ MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;