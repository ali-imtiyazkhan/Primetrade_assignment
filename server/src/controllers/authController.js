const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, result, 'Token refreshed');
  } catch (err) { next(err); }
}

async function logout(req, res, next) {
  try {
    await authService.logoutUser(req.user._id);
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
}

async function me(req, res) {
  sendSuccess(res, { user: req.user });
}

module.exports = { register, login, refresh, logout, me };
