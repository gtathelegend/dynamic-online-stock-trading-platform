# Dynamic Online Stock Trading Platform (Backend)

Production-ready Node.js + Express backend for stock market data, analytics-ready endpoints, and user portfolio management.

## Features

- MVC architecture with clean separation (`controllers`, `services`, `models`, `routes`, `middlewares`, `utils`)
- JWT authentication (`/api/auth/register`, `/api/auth/login`)
- External stock API integration (Finnhub-compatible)
- Real-time quote, company profile, historical candles, trending stocks
- Protected portfolio endpoints with MongoDB persistence
- In-memory cache (Redis-ready design via service abstraction)
- Centralized validation and error handling

## Folder Structure

```text
.
├── app.js
├── server.js
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
└── utils/
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   copy .env.example .env
   ```

3. Update `.env` values (especially `MONGO_URI`, `JWT_SECRET`, `STOCK_API_KEY`).

4. Start server:

   ```bash
   npm run dev
   ```

## Core API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Stocks

- `GET /api/stocks/:symbol`
- `GET /api/stocks/:symbol/profile`
- `GET /api/stocks/:symbol/history`

### Market

- `GET /api/market/trending`

### Portfolio (JWT required)

- `POST /api/portfolio`
- `GET /api/portfolio`

## Sample JSON Responses

### `GET /api/stocks/AAPL`

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "currentPrice": 217.2,
    "change": 2.1,
    "percentChange": 0.98,
    "high": 219.1,
    "low": 214.8,
    "open": 215.0,
    "previousClose": 215.1,
    "timestamp": 1761015000
  }
}
```

### `GET /api/market/trending`

```json
{
  "success": true,
  "data": {
    "source": "Computed from top liquid symbols by intraday percentage move",
    "updatedAt": "2026-02-20T10:30:00.000Z",
    "items": [
      {
        "symbol": "NVDA",
        "currentPrice": 845.2,
        "percentChange": 3.4
      }
    ]
  }
}
```

### `GET /api/portfolio`

```json
{
  "success": true,
  "data": {
    "user": "65f2fded3f1ee536b3f8731a",
    "holdings": [
      {
        "symbol": "AAPL",
        "quantity": 10,
        "averagePrice": 192.5
      }
    ],
    "summary": {
      "totalQuantity": 10,
      "totalInvested": 1925
    }
  }
}
```

## Notes

- All portfolio routes require `Authorization: Bearer <token>`
- Historical endpoint supports optional query params: `from`, `to`, `resolution`
- Provider errors and rate limits are normalized into clean API errors# dynamic online stock trading platform

