const User = require('../models/User');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

async function list(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    sendSuccess(res, { users });
  } catch (err) { next(err); }
}

async function updateRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      throw new AppError('Role must be user or admin', 400);
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) throw new AppError('User not found', 404);

    sendSuccess(res, { user }, 'Role updated');
  } catch (err) { next(err); }
}

module.exports = { list, updateRole };
