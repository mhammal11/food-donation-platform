const express = require('express');
var Donor = require('../models/donor')
var Charity = require('../models/charity')
var Inventory = require('../models/inventory')
var Reservation = require('../models/reservation')
const mongoose = require('mongoose');
const reservation = require('../models/reservation');

function getAllReservations(req, res) {
    Reservation.find({}).then(reservations => {
        res.status(200).send(reservations)
    }).catch(error => {
        console.log(error)
        res.status(404).send("Error")
    })
}

async function getDonorReservations(req, res) {
    donorId = req.params.donor
    
    try {
        let reservations = await Reservation.find({ 'reservations.donor': donorId })

        // Remove other donors from a charity's reservation list and create deep copy
        let formattedReservations = JSON.parse(JSON.stringify(cleanDonorReservations(reservations, donorId)));

        for (let i = 0; i < formattedReservations.length; i++) {
            let charityId = formattedReservations[i].charity
            let charity = await Charity.findOne({ _id: charityId })

            if (charity) {
                let charityName = charity.name

                formattedReservations[i].charityName = charityName
            }
        }

        res.status(200).send(formattedReservations)
    } catch (error) {
        console.log("Error finding reservation", error)
        res.status(404).send("Error")
    }
}

function getCharityReservations(req, res) {
    charityId = req.params.charity

    Charity.findOne({ _id: charityId }).then(charity => {
        reservationIds = charity.reservations

        Reservation.find({ _id: { $in: reservationIds } }).then(reservations => {
            res.status(200).send(reservations)
        }).catch(error => {
            console.log("Error finding reservation", error)
            res.status(404).send("Error")
        })
    }).catch(error => {
        console.log("Error finding charity: ", error)
        res.status(404).send("Error")
    })
}

async function postReservations(req, res) {
    charityId = req.params.charity
    reservationBody = req.body

    formattedReservation = {charity: charityId, reservations: reservationBody}

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let reservation = new Reservation(formattedReservation)

        let charity = await Charity.findOne({ _id: charityId })

        if (!charity) {
            res.status(500).send({ error: "Can't find requested charity" })
        }

        for (const res of reservation.reservations) {
            for (const item of res.reservedInventory) {
                let inventoryId = item.inventory
                let reservedQuantity = item.reservedQuantity

                let inventoryItem = await Inventory.findOne({ _id: inventoryId })

                let newReservedQuantity = inventoryItem.reservedQuantity + reservedQuantity
                inventoryItem.reservedQuantity = newReservedQuantity
                inventoryItem.save()
            }
        }

        await reservation.save()
        charity.reservations.push(reservation._id)
        await charity.save()

        await session.commitTransaction

        console.log("Created reservation")
        res.status(200).send({})
    } catch (error) {
        console.log("Error Creating Reservation:", error)
        await session.abortTransaction()
        res.status(500).send({ error: "Error" })
    } finally {
        await session.endSession()
    }
}

// Restructures the JSON object for returning donor reservations
function cleanDonorReservations(reservations, donorId) {
    for (let i = 0; i < reservations.length; i++) {
        cleanedReservations = []

        for (let j = 0; j < reservations[i].reservations.length; j++) {
            if (reservations[i].reservations[j].donor == donorId) {
                cleanedReservations.push(reservations[i].reservations[j])
            }
        }

        reservations[i].reservations = cleanedReservations
    }

    return reservations
}

// Add error handling
async function cancelReservation(req, res) { 
    let reservationId = req.params.reservation
    let reservation = await Reservation.findOne({ _id: reservationId })

    let resItems = []

    for (const res of reservation.reservations) {
        for (const item of res.reservedInventory) {
            resItems.push({inventory: item.inventory, reservedQuantity: item.reservedQuantity})
        }
    }

    for (item of resItems) {
        let inventory = await Inventory.findOne({ _id: item.inventory })

        inventory.reservedQuantity = inventory.reservedQuantity - item.reservedQuantity
        inventory.save()
    }

    let charityId = reservation.charity
    let charity = await Charity.findOne({ _id: charityId })
    charity.reservations = charity.reservations.filter((res) => res != reservationId)
    charity.save()

    await Reservation.deleteOne({ _id: reservationId })

    res.status(200).send({})
}

// Add error handling
async function cancelIndividualReservation(req, res) {
    reservationId = req.params.reservation
    reservationObjectId = req.params.reservationObject

    let resItems = []

    let reservation = await Reservation.findOne({ _id: reservationId })

    for (const res of reservation.reservations) {
        if (res._id == reservationObjectId) {
            for (const item of res.reservedInventory) {
                resItems.push({ inventory: item.inventory, reservedQuantity: item.reservedQuantity })
            }
        }
    }

    for (item of resItems) {
        let inventory = await Inventory.findOne({ _id: item.inventory })

        inventory.reservedQuantity = inventory.reservedQuantity - item.reservedQuantity
        inventory.save()
    }

    reservation.reservations = reservation.reservations.filter((res) => res._id != reservationObjectId)
    await reservation.save()

    res.status(200).send(reservation)
}

module.exports = {
    getAllReservations,
    getDonorReservations,
    getCharityReservations,
    cancelReservation,
    cancelIndividualReservation,
    postReservations
}