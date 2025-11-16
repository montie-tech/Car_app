const express = require('express');
const Driver = require('../models/Driver');
const router = express.Router();

// List pending drivers
router.get('/drivers/pending', async (req,res) => {
    const drivers = await Driver.find({ status:'pending' });
    res.json(drivers);
});

// Approve driver
router.post('/drivers/:id/approve', async (req,res) => {
    const driver = await Driver.findById(req.params.id);
    driver.status = 'approved';
    await driver.save();
    res.json({ success:true });
});

// Reject driver
router.post('/drivers/:id/reject', async (req,res) => {
    const driver = await Driver.findById(req.params.id);
    driver.status = 'rejected';
    await driver.save();
    res.json({ success:true });
});

module.exports = router;
