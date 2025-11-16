const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending','accepted','rejected','completed'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
