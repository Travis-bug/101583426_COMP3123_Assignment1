const { body, param, query } = require('express-validator');

// Fields the client may never set; owner and timestamps are server-controlled.
const FORBIDDEN_FIELDS = ['user', '_id', 'created_at', 'updated_at'];

const forbiddenFields = body().custom((value) => {
  const found = FORBIDDEN_FIELDS.filter((f) => value && Object.hasOwn(value, f));
  if (found.length) throw new Error(`${found.join(', ')} cannot be set by the client`);
  return true;
});

// Builds the field chains; `optional` makes each one skippable for PUT.
const fieldRules = (optional) => {
  const start = (chain) => (optional ? chain.optional() : chain.exists({ values: 'falsy' }).withMessage('is required').bail());
  const text = (name, max) =>
    start(body(name))
      .isString().withMessage(`${name} must be a string`).bail()
      .trim()
      .isLength({ min: 1, max }).withMessage(`${name} must be 1 to ${max} characters`);

  return [
    text('first_name', 50),
    text('last_name', 50),
    start(body('email'))
      .isString().withMessage('email must be a string').bail()
      .trim()
      .isEmail().withMessage('a valid email is required')
      .toLowerCase(),
    text('position', 50),
    start(body('salary'))
      .isFloat({ gt: 0 }).withMessage('salary must be a number greater than 0')
      .toFloat(),
    start(body('date_of_joining'))
      .isISO8601().withMessage('date_of_joining must be a valid ISO 8601 date')
      .toDate(),
    text('department', 100),
  ];
};

const createRules = [forbiddenFields, ...fieldRules(false)];

const updateRules = [
  body().custom((value) => {
    if (!value || Object.keys(value).length === 0) throw new Error('request body cannot be empty');
    return true;
  }),
  forbiddenFields,
  ...fieldRules(true),
];

const idParamRules = [param('eid').isMongoId().withMessage('eid must be a valid id')];

const idQueryRules = [
  query('eid').exists().withMessage('eid is required').bail().isMongoId().withMessage('eid must be a valid id'),
];

module.exports = { createRules, updateRules, idParamRules, idQueryRules };
