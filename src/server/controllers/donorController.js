const express = require("express");
var Donor = require("../models/donor");
const mongoose = require("mongoose");

function getAllDonors(req, res) {
  Donor.find({})
    .then((donors) => {
      res.status(200).send(donors);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Error");
    });
}

function getDonor(req, res) {
  const donorId = req.params.donor;
  if (donorId instanceof mongoose.Types.ObjectId) {
    Donor.findOne({ _id: donorId })
      .then((donor) => {
        res.status(200).send(donor);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send("Error");
      });
  } else {
    Donor.findOne({ Auth0Id: donorId })
      .then((donor) => {
        res.status(200).send(donor);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send("Error");
      });
  }
}

function createDonor(req, res) {
  donorBody = req.body;

  let donor = new Donor(donorBody);
  donor
    .save()
    .then(() => {
      res.status(200).send("Created Donor");
    })
    .catch((error) => {
      console.log("Error creating donor");
      res.status(500).send("Error");
    });
}

module.exports = {
  getAllDonors,
  getDonor,
  createDonor,
};
