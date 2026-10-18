const { Router } = require('express');

const router = Router();

// Mounted at /api/v1. User and employee routers are added in later steps:
// router.use('/user', require('./user.routes'));
// router.use('/emp', require('./employee.routes'));

module.exports = router;
