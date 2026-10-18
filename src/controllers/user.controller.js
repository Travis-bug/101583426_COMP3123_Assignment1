const authService = require('../services/auth.service');

// POST /api/v1/user/signup
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.signup({ username, email, password });
  res.status(201).json({ success: true, message: 'User created successfully', data: user });
};

// POST /api/v1/user/login
exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  const { token, user } = await authService.login({ username, email, password });
  res.status(200).json({ success: true, message: 'Login successful', data: { token, user } });
};
