const { matchedData } = require('express-validator');
const employeeService = require('../services/employee.service');

// GET /api/v1/emp/employees
exports.list = async (req, res) => {
  const employees = await employeeService.list(req.user.id);
  res.status(200).json({ success: true, message: 'Employees retrieved successfully', data: employees });
};

// POST /api/v1/emp/employees
exports.create = async (req, res) => {
  const employee = await employeeService.create(req.user.id, matchedData(req, { locations: ['body'] }));
  res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
};

// GET /api/v1/emp/employees/:eid
exports.getOne = async (req, res) => {
  const employee = await employeeService.getOwned(req.user.id, req.params.eid);
  res.status(200).json({ success: true, message: 'Employee retrieved successfully', data: employee });
};

// PUT /api/v1/emp/employees/:eid
exports.update = async (req, res) => {
  const employee = await employeeService.update(req.user.id, req.params.eid, matchedData(req, { locations: ['body'] }));
  res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
};

// DELETE /api/v1/emp/employees?eid=xxx
exports.remove = async (req, res) => {
  await employeeService.remove(req.user.id, req.query.eid);
  res.status(204).end();
};
