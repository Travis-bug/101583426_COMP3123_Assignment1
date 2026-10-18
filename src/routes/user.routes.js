const { Router } = require('express');
const { signup, login } = require('../controllers/user.controller');
const { signupRules, loginRules } = require('../validators/user.validators');
const validate = require('../middleware/validate');

const router = Router();

router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);

module.exports = router;
