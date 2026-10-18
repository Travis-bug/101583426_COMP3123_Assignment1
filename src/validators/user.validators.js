const { body } = require('express-validator');

const signupRules = [
  body('username')
    .isString().withMessage('username is required').bail()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('username must be 3 to 30 characters'),
  body('email')
    .isString().withMessage('email is required').bail()
    .trim()
    .isEmail().withMessage('a valid email is required')
    .toLowerCase(),
  body('password')
    .isString().withMessage('password is required').bail()
    .isLength({ min: 8, max: 72 }).withMessage('password must be 8 to 72 characters')
    .matches(/[A-Za-z]/).withMessage('password must contain a letter')
    .matches(/\d/).withMessage('password must contain a number'),
];

// Login needs a password plus a username or an email.
const loginRules = [
  body('password').isString().notEmpty().withMessage('password is required'),
  body('username').optional().isString().withMessage('username must be a string').trim(),
  body('email').optional().isString().withMessage('email must be a string').trim().toLowerCase(),
  body().custom((value) => {
    if (!value || (!value.username && !value.email)) {
      throw new Error('username or email is required');
    }
    return true;
  }),
];

module.exports = { signupRules, loginRules };
