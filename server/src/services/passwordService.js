const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('No account with that email address', 404);

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();

  return resetToken;
}

async function resetPassword(token, newPassword) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError('Invalid or expired reset token', 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null;
  await user.save();
}

module.exports = { forgotPassword, resetPassword };
