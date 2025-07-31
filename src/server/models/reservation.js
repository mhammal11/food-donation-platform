var mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
    charity: { type: mongoose.Types.ObjectId, ref: "Charity" },
    contactName: String,
    contactEmail: String,
    reservations: [{ 
        donor: { type: mongoose.Types.ObjectId, ref: "Donor" },
        donorName: String,
        reservationDateTime: Date,
        reservedInventory: [{
            inventory: { type: mongoose.Types.ObjectId, ref: "Inventory" },
            itemName: String,
            reservedQuantity: Number,
        }],
    }],
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema)