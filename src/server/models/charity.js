var mongoose = require("mongoose");

var charitySchema = new mongoose.Schema(
  {
    Auth0Id: String,
    name: String,
    charitableNumber: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    contactEmail: String,
    contactNumber: String,
    websiteUrl: String,
    openingTime: Date,
    closingTime: Date,
    reservations: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Charity", charitySchema);
