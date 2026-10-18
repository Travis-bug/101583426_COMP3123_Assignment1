const { Router } = require('express');

const router = Router();

// Mounted at /api/v1.
router.use('/user', require('./user.routes'));
router.use('/emp', require('./employee.routes'));

module.exports = router;
