const express = require('express');

const authController = require('../controllers/authController');
const { validateRegisterPayload, validateLoginPayload } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.get('/register', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Use POST /auth/register or POST /api/auth/register with JSON body: { name, email, password }'
	});
});

router.get('/login', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Use POST /auth/login or POST /api/auth/login with JSON body: { email, password }'
	});
});

router.post('/register', validateRegisterPayload, authController.register);
router.post('/login', validateLoginPayload, authController.login);

module.exports = router;