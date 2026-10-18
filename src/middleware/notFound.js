const ApiError = require('../utils/ApiError');

// Any request that matched no route ends up here.
module.exports = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
