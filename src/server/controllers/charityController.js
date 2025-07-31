const express = require("express");
var Charity = require("../models/charity");
const mongoose = require("mongoose");

function getAllCharities(req, res) {
  Charity.find({})
    .then((charities) => {
      res.status(200).send(charities);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Error");
    });
}

function getCharity(req, res) {
  const charityId = req.params.charity;
  if (charityId instanceof mongoose.Types.ObjectId) {
    Charity.findOne({ _id: charityId })
      .then((charity) => {
        res.status(200).json(charity);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send("Error");
      });
  } else {
    Charity.findOne({ Auth0Id: charityId })
      .then((charity) => {
        res.status(200).json(charity);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send("Error");
      });
  }
}

function createCharity(req, res) {
  charityBody = req.body;

  let charity = new Charity(charityBody);
  charity
    .save()
    .then(() => {
      res.status(200).json(charity);
    })
    .catch((error) => {
      console.log("Error creating charity");
      res.status(500).send("Error");
    });
}

module.exports = {
  getAllCharities,
  getCharity,
  createCharity,
};
