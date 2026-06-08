const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { allocateLead, getLeadAllocationHistory } = require('../controllers/allocationsController');

const router = express.Router();

router.post(
  '/',
  [
    body('lead_id').isInt({ min: 1 }).withMessage('lead_id is required'),
    body('counselor_id').isInt({ min: 1 }).withMessage('counselor_id is required'),
    body('allocated_by').trim().notEmpty().withMessage('allocated_by is required'),
  ],
  validate,
  allocateLead,
);

router.get('/lead/:id', [param('id').isInt({ min: 1 })], validate, getLeadAllocationHistory);

module.exports = router;
