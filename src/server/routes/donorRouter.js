const express = require('express');
const router = express.Router();

var controller = require('../controllers/donorController');

router.get('/', controller.getAllDonors);  //complete

router.get('/:donor', controller.getDonor); // complete

router.post('/donor', controller.createDonor); // complete

module.exports = router;