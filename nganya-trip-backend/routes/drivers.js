// routes/drivers.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const io = require('../socket'); // assume socket instance exported from socket.js

// ------------------- REGISTER DRIVER -------------------
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) return res.json({ success: false, message: 'Fill all fields' });

        let exists = await Driver.findOne({ phone });
        if (exists) return res.json({ success: false, message: 'Phone already registered' });

        const driver = new Driver({ name, phone, password, status: 'pending', isOnline: false });
        await driver.save();

        res.json({ success: true, driver });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Registration failed' });
    }
});

// ------------------- SUBMIT APPLICATION -------------------
router.post('/application', async (req, res) => {
    try {
        const { driverId, vehicle, route, capacity } = req.body;
        if (!driverId || !vehicle || !route || !capacity)
            return res.json({ success: false, message: 'Fill all fields' });

        const driver = await Driver.findById(driverId);
        if (!driver) return res.json({ success: false, message: 'Driver not found' });

        driver.vehicle = vehicle;
        driver.route = route;
        driver.capacity = capacity;
        driver.status = 'pending'; // waiting admin approval
        await driver.save();

        // Optional: emit to admin that a new driver applied
        io.getIO().emit('newDriverApplication', { driverId: driver._id, name: driver.name });

        res.json({ success: true, message: 'Application sent to admin for approval' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Application failed' });
    }
});

// ------------------- LOGIN -------------------
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) return res.json({ success: false, message: 'Fill all fields' });

        const driver = await Driver.findOne({ phone, password });
        if (!driver) return res.json({ success: false, message: 'Incorrect credentials' });
        if (driver.status !== 'approved') return res.json({ success: false, message: 'Account not approved yet' });

        res.json({ success: true, driver });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Login failed' });
    }
});

// ------------------- TOGGLE ONLINE/OFFLINE -------------------
router.post('/toggleOnline', async (req, res) => {
    try {
        const { driverId, isOnline } = req.body;
        const driver = await Driver.findById(driverId);
        if (!driver) return res.json({ success: false, message: 'Driver not found' });

        driver.isOnline = isOnline;
        await driver.save();

        // Notify passengers of driver online status if needed
        io.getIO().emit('driversOnlineList', await Driver.find({ isOnline: true, status: 'approved' }));

        res.json({ success: true, driver });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to toggle online status' });
    }
});

// ------------------- ACCEPT BOOKING -------------------
router.post('/bookings/accept', async (req, res) => {
    try {
        const { driverId, bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.json({ success: false, message: 'Booking not found' });

        if (booking.driverId.toString() !== driverId)
            return res.json({ success: false, message: 'Not your booking' });

        booking.status = 'accepted';
        await booking.save();

        // Reduce driver capacity
        const driver = await Driver.findById(driverId);
        if (driver.capacity > 0) driver.capacity -= 1;
        await driver.save();

        // Emit booking accepted to passenger
        io.getIO().to(booking.passengerId.toString()).emit('tripAccepted', {
            driver: { name: driver.name, vehicle: driver.vehicle },
            dropoffStage: booking.dropoff
        });

        res.json({ success: true, booking });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Failed to accept booking' });
    }
});

module.exports = router;
