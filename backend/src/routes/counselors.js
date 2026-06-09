const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { listCounselors, createCounselor } = require('../controllers/counselorsController');

const router = express.Router();

router.get('/', listCounselors);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('valid email is required'),
    body('phone').optional({ nullable: true }).isString(),
    body('sheet_url').optional({ nullable: true }).isURL().withMessage('sheet_url must be a valid URL'),
    body('active').optional().isBoolean(),
  ],
  validate,
  createCounselor,
);

module.exports = router;
