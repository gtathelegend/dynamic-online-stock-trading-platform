const axios = require('axios');

const AppError = require('../utils/appError');
const cache = require('../utils/cache');
const { DEFAULT_TRENDING_SYMBOLS, CACHE_TTL_SECONDS } = require('../config/constants');

const stockClient = axios.create({
  baseURL: process.env.STOCK_API_BASE_URL,
  timeout: 10000
});

const normalizeSymbol = (symbol) => symbol.toUpperCase().trim();

const mapProviderError = (error) => {
  if (error.response?.status === 429) {
    return new AppError('Stock provider rate limit exceeded. Please retry shortly.', 429);
  }

  if (error.response?.status === 401 || error.response?.status === 403) {
    return new AppError('Stock provider authentication failed. Check API key.', 502);
  }

  if (error.code === 'ECONNABORTED') {
    return new AppError('Stock provider timed out. Please try again.', 504);
  }

  return new AppError('Failed to fetch stock data from provider', 502);
};

const requestProvider = async (endpoint, params) => {
  try {
    const response = await stockClient.get(endpoint, {
      params: {
        ...params,
        token: process.env.STOCK_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    throw mapProviderError(error);
  }
};

const getLivePrice = async (symbol) => {
  const normalized = normalizeSymbol(symbol);
  return cache.getOrSet(`quote:${normalized}`, CACHE_TTL_SECONDS, async () => {
    const data = await requestProvider('/quote', { symbol: normalized });

    if (typeof data.c !== 'number') {
      throw new AppError(`No live price available for symbol ${normalized}`, 404);
    }

    return {
      symbol: normalized,
      currentPrice: data.c,
      change: data.d,
      percentChange: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t
    };
  });
};

const getCompanyProfile = async (symbol) => {
  const normalized = normalizeSymbol(symbol);
  return cache.getOrSet(`profile:${normalized}`, 3600, async () => {
    const data = await requestProvider('/stock/profile2', { symbol: normalized });

    if (!data || !data.ticker) {
      throw new AppError(`Company profile not found for symbol ${normalized}`, 404);
    }

    return {
      symbol: data.ticker,
      name: data.name,
      country: data.country,
      currency: data.currency,
      exchange: data.exchange,
      ipo: data.ipo,
      marketCapitalization: data.marketCapitalization,
      logo: data.logo,
      weburl: data.weburl,
      finnhubIndustry: data.finnhubIndustry
    };
  });
};

const getHistoricalData = async (symbol, options = {}) => {
  const normalized = normalizeSymbol(symbol);
  const now = Math.floor(Date.now() / 1000);
  const to = Number(options.to) || now;
  const from = Number(options.from) || to - 60 * 60 * 24 * 30;
  const resolution = options.resolution || 'D';

  if (from >= to) {
    throw new AppError('Query param "from" must be less than "to"', 400);
  }

  return cache.getOrSet(`history:${normalized}:${from}:${to}:${resolution}`, 300, async () => {
    const data = await requestProvider('/stock/candle', {
      symbol: normalized,
      resolution,
      from,
      to
    });

    if (!data || data.s !== 'ok') {
      throw new AppError(`Historical data not available for symbol ${normalized}`, 404);
    }

    const candles = data.t.map((time, index) => ({
      time,
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      close: data.c[index],
      volume: data.v[index]
    }));

    return {
      symbol: normalized,
      resolution,
      from,
      to,
      candles
    };
  });
};

const getTrendingStocks = async () => {
  return cache.getOrSet('market:trending', 60, async () => {
    const quotes = await Promise.all(
      DEFAULT_TRENDING_SYMBOLS.map(async (symbol) => {
        try {
          const quote = await getLivePrice(symbol);
          return quote;
        } catch (error) {
          return null;
        }
      })
    );

    const filtered = quotes.filter(Boolean);
    const ranked = filtered.sort((a, b) => Math.abs(b.percentChange || 0) - Math.abs(a.percentChange || 0));

    return {
      source: 'Computed from top liquid symbols by intraday percentage move',
      updatedAt: new Date().toISOString(),
      items: ranked.slice(0, 5)
    };
  });
};

module.exports = {
  getLivePrice,
  getCompanyProfile,
  getHistoricalData,
  getTrendingStocks
};