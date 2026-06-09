const express = require('express');
const { param } = require('express-validator');
const validate = require('../middleware/validate');
const { getLeadActivity } = require('../controllers/activityController');

const router = express.Router();

router.get('/lead/:id', [param('id').isInt({ min: 1 })], validate, getLeadActivity);

module.exports = router;
