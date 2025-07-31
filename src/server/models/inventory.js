var mongoose = require('mongoose');

var inventorySchema = new mongoose.Schema({
    itemName: String,
    description: String,
    quantity: Number,
    reservedQuantity: Number,
    tags: [String],
    expiryDate: Date,
    image: String,
    donor: { type: mongoose.Types.ObjectId, ref: "Donor" },
    reservation: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }]
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema)