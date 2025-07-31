const express = require('express');
const router = express.Router();

var controller = require('../controllers/inventoryController');

router.get('/', controller.getAllInventory);  // complete

router.get('/search', controller.searchInventory);

router.get('/:donor', controller.getDonorInventory); // complete

router.post('/:donor', controller.postInventory); // complete

router.put('/:donor/:inventory', controller.editInventory);

router.delete('/:donor/:inventory', controller.removeInventory);

module.exports = router;