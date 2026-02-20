const express = require('express');

const authController = require('../controllers/authController');
const { validateRegisterPayload, validateLoginPayload } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post('/register', validateRegisterPayload, authController.register);
router.post('/login', validateLoginPayload, authController.login);

module.exports = router;