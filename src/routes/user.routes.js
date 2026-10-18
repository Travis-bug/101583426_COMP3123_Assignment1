const { Router } = require('express');
const { signup, login } = require('../controllers/user.controller');
const { signupRules, loginRules } = require('../validators/user.validators');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.post('/signup', authLimiter, signupRules, validate, signup);
router.post('/login', authLimiter, loginRules, validate, login);

module.exports = router;
