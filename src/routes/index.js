const { Router } = require('express');

const router = Router();

// Mounted at /api/v1. The employee router is added in a later step:
router.use('/user', require('./user.routes'));
// router.use('/emp', require('./employee.routes'));

module.exports = router;
