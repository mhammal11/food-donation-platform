const express = require('express');
var Donor = require('../models/donor')
var Inventory = require('../models/inventory')
var Reservation = require('../models/reservation')

function getAllInventory(req, res) {
    Inventory.find({}).then(inventories => {
        res.status(200).send(inventories)
    }).catch(error => {
        console.log(error)
        res.status(404).send("Error")
    })
}

function getDonorInventory(req, res) {
    donorId = req.params.donor

    Donor.findOne({ _id: donorId }).then(donor => {
        inventoryIds = donor.inventory

        Inventory.find({ _id: { $in: inventoryIds } }).then(inventory => {
            res.status(200).send(inventory)
        }).catch(error => {
            console.log("Error finding inventory", error)
            res.status(404).send("Error")
        })
    }).catch(error => {
        console.log("Error finding donor: ", error)
        res.status(404).send("Error")
    })
}

function postInventory(req, res) {
    donorId = req.params.donor
    inventoryBody = req.body
    inventoryBody.donor = donorId
    inventoryBody.reservedQuantity = 0

    let inventory = new Inventory(inventoryBody)

    Donor.findOne({ _id: donorId }).then(donor => {
        inventory.save().then(() => {
            donor.inventory.push(inventory._id)
            donor.save().then(() => {
                res.status(200).send(inventory)
            }).catch(error => {
                console.log("Error updating donor: ", error)
                res.status(500).send("Error")
            })
        }).catch(error => {
            console.log("Error created inventory: ", error)
            res.status(500).send("Error")
        })
    })
}

function editInventory(req, res) {
    donorId = req.params.donor
    inventoryId = req.params.inventory

    inventoryBody = req.body
    inventoryBody.donor = donorId

    console.log(donorId, inventoryId, inventoryBody)

    Inventory.findOneAndUpdate({ _id: inventoryId, donor: donorId }, inventoryBody, { new: true }).then(updatedInventory => {
        res.status(200).send(updatedInventory)
    })
    .catch(error => {
        console.log("Error updating inventory:", error)
        res.status(500).send("Error")
    })
}

function removeInventory(req, res) {
    donorId = req.params.donor
    inventoryId = req.params.inventory

    Inventory.deleteOne({ _id: inventoryId, donor: donorId }).then(() => {
      res.status(200).send({})
    }).catch(error => {
        console.log("Error deleting inventory: ", error)
        res.status(500).send({ error: "Error" })
    })
}

async function searchInventory(req, res) {
    let searchFound = []

    try {
        let donors = await Donor.find({})

        for (const donor of donors) {
            let donorData = {id: donor._id, donorName: donor.name, distance: 5, items: []}
            let items = await Inventory.find({ donor: donor._id })
            for (const item of items) {
                let itemData = {}

                if (item.reservedQuantity !== null && item.reservedQuantity !== undefined && item.quantity !== null && item.quantity !== undefined) {
                    itemData.quantity = item.quantity - item.reservedQuantity
                } else {
                  itemData.quantity = 6
                }
                itemData.donorId = donor._id
                itemData.id = item._id
                itemData.itemName = item.itemName
                itemData.reservedQuantity = 0 // Calculate somehow?
                itemData.tag = "test"
                donorData.items.push(itemData)
            }
            searchFound.push(donorData)
        }

        res.status(200).send(searchFound)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error")
    }
}

module.exports = {
    getAllInventory,
    getDonorInventory,
    postInventory,
    editInventory,
    removeInventory,
    searchInventory
}