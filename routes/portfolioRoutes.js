const express = require('express');

const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validatePortfolioPayload } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', validatePortfolioPayload, portfolioController.addToPortfolio);
router.get('/', portfolioController.getPortfolio);

module.exports = router;