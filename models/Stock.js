const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    exchange: {
      type: String,
      default: 'N/A'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    type: {
      type: String,
      default: 'Equity'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Stock', stockSchema);