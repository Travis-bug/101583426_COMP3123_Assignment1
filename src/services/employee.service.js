const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const list = (userId) => Employee.find({ user: userId });

async function create(userId, data) {
  let employee;
  try {
    // Owner always comes from the token, never the body.
    employee = await Employee.create({ ...data, user: userId });
  } catch (err) {
    throw duplicateToConflict(err);
  }
  logger.info(`Employee created: user=${userId} eid=${employee._id}`);
  return employee;
}

// 404 if the id does not exist, 403 if it belongs to someone else.
async function getOwned(userId, eid) {
  const employee = await Employee.findById(eid);
  if (!employee) throw new ApiError(404, 'Employee not found');
  if (employee.user.toString() !== userId) {
    logger.warn(`Access denied: user=${userId} tried eid=${eid}`);
    throw new ApiError(403, 'You do not have access to this employee');
  }
  return employee;
}

async function update(userId, eid, data) {
  await getOwned(userId, eid);
  let employee;
  try {
    // Both id and owner are in the filter so ownership is enforced in the query itself.
    employee = await Employee.findOneAndUpdate({ _id: eid, user: userId }, data, {
      runValidators: true,
      returnDocument: 'after',
    });
  } catch (err) {
    throw duplicateToConflict(err);
  }
  if (!employee) throw new ApiError(404, 'Employee not found');
  logger.info(`Employee updated: user=${userId} eid=${eid}`);
  return employee;
}

async function remove(userId, eid) {
  await getOwned(userId, eid);
  const result = await Employee.deleteOne({ _id: eid, user: userId });
  if (result.deletedCount === 0) throw new ApiError(404, 'Employee not found');
  logger.info(`Employee deleted: user=${userId} eid=${eid}`);
}

function duplicateToConflict(err) {
  if (err.code === 11000) {
    return new ApiError(409, 'An employee with this email already exists');
  }
  return err;
}

module.exports = { list, create, getOwned, update, remove };
