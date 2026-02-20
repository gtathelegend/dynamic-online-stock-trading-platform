const express = require('express');

const marketController = require('../controllers/marketController');

const router = express.Router();

router.get('/trending', marketController.getTrendingStocks);

module.exports = router;