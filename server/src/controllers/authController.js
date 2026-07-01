const authService = require('../services/authService');
const passwordService = require('../services/passwordService');
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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const resetToken = await passwordService.forgotPassword(email);
    sendSuccess(res, { resetToken }, 'Password reset token generated');
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    await passwordService.resetPassword(token, password);
    sendSuccess(res, null, 'Password reset successful');
  } catch (err) { next(err); }
}

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
