const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after express-validator chains; turns failures into a 400 with per-field errors.
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  throw new ApiError(400, 'Validation failed', errors);
};
