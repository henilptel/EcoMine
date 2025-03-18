const express = require('express');
const router = express.Router();
const Mine = require('../models/mine');
const { auth, authorize } = require('../middleware/auth');

// Create mine (restricted to admin and environmental officers)
router.post('/', auth, authorize(['admin', 'environmental_officer']), async (req, res) => {
    try {
        const { name, location, area_size, operational_status } = req.body;
        console.log('Create mine request body:', req.body);

        if (!name || !location || !area_size || !operational_status) {
            console.log('Validation error: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Log parsed values for debugging
        const parsedAreaSize = parseFloat(area_size);
        console.log('Parsed area_size:', parsedAreaSize);
        console.log('Operational status provided:', operational_status);

        const mine = await Mine.create({
            name,
            location,
            area_size: parsedAreaSize,
            operational_status
        });

        console.log('Mine created successfully:', mine);
        res.status(201).json(mine);
    } catch (error) {
        console.error('Error creating mine:', error);
        res.status(500).json({ error: 'Error creating mine' });
    }
});

// Get all mines
router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching all mines');
        const mines = await Mine.list();
        res.json(mines);
    } catch (error) {
        console.error('Error fetching mines:', error);
        res.status(500).json({ error: 'Error fetching mines' });
    }
});

// Get single mine
router.get('/:id', auth, async (req, res) => {
    try {
        console.log('Fetching mine with ID:', req.params.id);
        const mine = await Mine.findById(req.params.id);
        if (!mine) {
            console.log('Mine not found with ID:', req.params.id);
            return res.status(404).json({ error: 'Mine not found' });
        }
        res.json(mine);
    } catch (error) {
        console.error('Error fetching mine:', error);
        res.status(500).json({ error: 'Error fetching mine' });
    }
});

// Update mine (restricted to admin and environmental officers)
router.put('/:id', auth, authorize(['admin', 'environmental_officer']), async (req, res) => {
    try {
        const { name, location, area_size, operational_status } = req.body;
        console.log('Update mine request body:', req.body);

        if (!name || !location || !area_size || !operational_status) {
            console.log('Validation error: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }

        const mine = await Mine.update(req.params.id, {
            name,
            location,
            area_size: parseFloat(area_size),
            operational_status
        });

        console.log('Mine updated successfully:', mine);
        res.json(mine);
    } catch (error) {
        if (error.message === 'Mine not found') {
            console.log('Mine not found with ID:', req.params.id);
            return res.status(404).json({ error: error.message });
        }
        console.error('Error updating mine:', error);
        res.status(500).json({ error: 'Error updating mine' });
    }
});

// Delete mine (admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        console.log('Deleting mine with ID:', req.params.id);
        await Mine.delete(req.params.id);
        console.log('Mine deleted successfully with ID:', req.params.id);
        res.json({ message: 'Mine deleted successfully' });
    } catch (error) {
        if (error.message === 'Mine not found') {
            console.log('Mine not found with ID:', req.params.id);
            return res.status(404).json({ error: error.message });
        }
        console.error('Error deleting mine:', error);
        res.status(500).json({ error: 'Error deleting mine' });
    }
});

module.exports = router;
