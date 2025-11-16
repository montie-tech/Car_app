const express = require('express');
const bcrypt = require('bcryptjs');
const Passenger = require('../models/Passenger');
const Booking = require('../models/Booking');
const router = express.Router();

// ==================== REGISTER ====================
router.post('/register', async (req,res) => {
    const { name,email,phone,password } = req.body;
    if(!name || !email || !phone || !password)
        return res.status(400).json({ success:false, message:'All fields required' });

    const existing = await Passenger.findOne({ email });
    if(existing) return res.json({ success:false, message:'Email exists' });

    const hashed = await bcrypt.hash(password, 10);
    const passenger = new Passenger({ name,email,phone,password:hashed });
    await passenger.save();
    res.json({ success:true, passengerId: passenger._id, passenger });
});

// ==================== LOGIN ====================
router.post('/login', async (req,res) => {
    const { email,password } = req.body;
    const passenger = await Passenger.findOne({ email });
    if(!passenger) return res.json({ success:false, message:'Passenger not found' });

    const valid = await bcrypt.compare(password, passenger.password);
    if(!valid) return res.json({ success:false, message:'Wrong password' });

    // return passengerId for frontend socket
    res.json({ success:true, passengerId: passenger._id, passenger });
});

// ==================== REQUEST RIDE ====================
router.post('/bookings/request', async (req,res) => {
    const { passengerId, driverId, pickup, dropoff } = req.body;
    if(!passengerId || !driverId || !pickup || !dropoff)
        return res.status(400).json({ success:false, message:'All fields required' });

    const booking = new Booking({
        passenger: passengerId,
        driver: driverId,
        pickupStage: pickup,
        dropoffStage: dropoff,
        status:'pending'
    });
    await booking.save();

    const io = req.app.get('io');
    io.to(driverId).emit('tripRequest', booking); // notify driver

    res.json({ success:true, booking });
});

module.exports = router;
