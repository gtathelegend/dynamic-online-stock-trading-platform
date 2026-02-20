const express = require('express');

const stockController = require('../controllers/stockController');
const { validateSymbolParam, validateHistoryQuery } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.get('/:symbol', validateSymbolParam, stockController.getLivePrice);
router.get('/:symbol/profile', validateSymbolParam, stockController.getCompanyProfile);
router.get('/:symbol/history', validateSymbolParam, validateHistoryQuery, stockController.getHistory);

module.exports = router;