const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    vehicle: { type: String, default: "-" },
    route: { type: String, default: "-" },
    capacity: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isOnline: { type: Boolean, default: false }
});

module.exports = mongoose.model('Driver', DriverSchema);
