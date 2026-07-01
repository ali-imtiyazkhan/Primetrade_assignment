const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), userController.list);

router.patch(
  '/:id/role',
  authenticate,
  authorize('admin'),
  [body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin')],
  validate,
  userController.updateRole
);

module.exports = router;
