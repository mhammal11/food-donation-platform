const express = require('express');
const router = express.Router();

var controller = require('../controllers/reservationController');

router.get('/', controller.getAllReservations);  // Complete

router.get('/donor/:donor', controller.getDonorReservations); // Complete

router.get('/charity/:charity', controller.getCharityReservations); // Complete

router.post('/:charity', controller.postReservations); // Complete

router.delete('/:reservation', controller.cancelReservation); // Complete

router.delete('/:reservation/:reservationObject', controller.cancelIndividualReservation); // Complete

module.exports = router;