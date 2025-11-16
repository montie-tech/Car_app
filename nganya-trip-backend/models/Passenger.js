const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    location: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('Passenger', PassengerSchema);
