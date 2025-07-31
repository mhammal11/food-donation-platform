const express = require('express');
const router = express.Router();

var controller = require('../controllers/charityController');

router.get('/', controller.getAllCharities);  // Complete

router.get('/:charity', controller.getCharity); // Complete

router.post('/charity', controller.createCharity); // Complete

module.exports = router;