const express = require('express');
const router = express.Router();
const MiningOperation = require('../models/mining-operation');
const Mine = require('../models/mine');
const { auth, authorize } = require('../middleware/auth');

// Create mining operation record (restricted to analysts and environmental officers)
router.post('/', auth, authorize(['analyst', 'environmental_officer']), async (req, res) => {
    try {
        const {
            mine_id,
            date,
            excavationData,
            transportationData,
            equipmentData,
            energyConsumption,
            wasteManagement
        } = req.body;

        // Validate required fields
        if (!mine_id || !date) {
            return res.status(400).json({ error: 'Mine ID and date are required' });
        }

        // Verify mine exists
        const mine = await Mine.findById(mine_id);
        if (!mine) {
            return res.status(404).json({ error: 'Mine not found' });
        }

        const operation = await MiningOperation.create({
            mine_id,
            date,
            excavation_data: excavationData,
            transportation_data: transportationData,
            equipment_data: equipmentData,
            energy_consumption: energyConsumption,
            waste_management: wasteManagement
        });

        res.status(201).json(operation);
    } catch (error) {
        console.error('Error creating mining operation record:', error);
        res.status(500).json({ error: 'Error creating mining operation record' });
    }
});

// Get operations for a specific mine
router.get('/mine/:mineId', auth, async (req, res) => {
    try {
        const operations = await MiningOperation.findByMineId(req.params.mineId);
        res.json(operations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching mining operations' });
    }
});

// Get single operation record
router.get('/:id', auth, async (req, res) => {
    try {
        const operation = await MiningOperation.findById(req.params.id);
        if (!operation) {
            return res.status(404).json({ error: 'Mining operation record not found' });
        }
        res.json(operation);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching mining operation record' });
    }
});

// Update operation record (restricted to analysts and environmental officers)
router.put('/:id', auth, authorize(['analyst', 'environmental_officer']), async (req, res) => {
    try {
        const {
            excavationData,
            transportationData,
            equipmentData,
            energyConsumption,
            wasteManagement
        } = req.body;

        const operation = await MiningOperation.update(req.params.id, {
            excavation_data: excavationData,
            transportation_data: transportationData,
            equipment_data: equipmentData,
            energy_consumption: energyConsumption,
            waste_management: wasteManagement
        });

        res.json(operation);
    } catch (error) {
        if (error.message === 'Mining operation not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error updating mining operation record' });
    }
});

// Delete operation record (restricted to analysts and environmental officers)
router.delete('/:id', auth, authorize(['analyst', 'environmental_officer']), async (req, res) => {
    try {
        await MiningOperation.delete(req.params.id);
        res.json({ message: 'Mining operation record deleted successfully' });
    } catch (error) {
        if (error.message === 'Mining operation not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error deleting mining operation record' });
    }
});

module.exports = router;
