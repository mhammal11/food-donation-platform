var mongoose = require("mongoose");

var donorSchema = new mongoose.Schema(
  {
    Auth0Id: String,
    name: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    contactEmail: String,
    contactNumber: String,
    websiteUrl: String,
    openingTime: Date,
    closingTime: Date,
    // pickupAvailabiltyStart: Date,
    // pickupAvailabiltyEnd: Date,
    inventory: [{ type: mongoose.Types.ObjectId, ref: "Inventory" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
