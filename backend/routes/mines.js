const express = require('express');
const router = express.Router();
const Mine = require('../models/mine');
const { auth, authorize } = require('../middleware/auth');

// Create mine (restricted to admin and environmental officers)
router.post('/', auth, authorize(['admin', 'environmental_officer']), async (req, res) => {
    try {
        const { name, location, area_size, operational_status } = req.body;

        if (!name || !location || !area_size || !operational_status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const mine = await Mine.create({
            name,
            location,
            area_size: parseFloat(area_size),
            operational_status
        });

        res.status(201).json(mine);
    } catch (error) {
        res.status(500).json({ error: 'Error creating mine' });
    }
});

// Get all mines
router.get('/', auth, async (req, res) => {
    try {
        const mines = await Mine.list();
        res.json(mines);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching mines' });
    }
});

// Get single mine
router.get('/:id', auth, async (req, res) => {
    try {
        const mine = await Mine.findById(req.params.id);
        if (!mine) {
            return res.status(404).json({ error: 'Mine not found' });
        }
        res.json(mine);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching mine' });
    }
});

// Update mine (restricted to admin and environmental officers)
router.put('/:id', auth, authorize(['admin', 'environmental_officer']), async (req, res) => {
    try {
        const { name, location, area_size, operational_status } = req.body;

        if (!name || !location || !area_size || !operational_status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const mine = await Mine.update(req.params.id, {
            name,
            location,
            area_size: parseFloat(area_size),
            operational_status
        });

        res.json(mine);
    } catch (error) {
        if (error.message === 'Mine not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error updating mine' });
    }
});

// Delete mine (admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        await Mine.delete(req.params.id);
        res.json({ message: 'Mine deleted successfully' });
    } catch (error) {
        if (error.message === 'Mine not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error deleting mine' });
    }
});

module.exports = router;
