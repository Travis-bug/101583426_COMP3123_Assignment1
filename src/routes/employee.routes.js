const { Router } = require('express');
const controller = require('../controllers/employee.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createRules,
  updateRules,
  idParamRules,
  idQueryRules,
} = require('../validators/employee.validators');

const router = Router();

// Every employee route requires a valid JWT.
router.use(auth);

router.get('/employees', controller.list);
router.post('/employees', createRules, validate, controller.create);
router.get('/employees/:eid', idParamRules, validate, controller.getOne);
router.put('/employees/:eid', idParamRules, updateRules, validate, controller.update);
router.delete('/employees', idQueryRules, validate, controller.remove);

module.exports = router;
