const express = require('express');
const router = express.Router();
const Emission = require('../models/emission');
const Mine = require('../models/mine');
const { auth, authorize } = require('../middleware/auth');

// Create emission record (restricted to analysts and environmental officers)
router.post('/', auth, authorize(['analyst', 'environmental_officer', 'admin']), async (req, res) => {
    console.log('POST / - Creating emission record:', req.body);
    try {
        const {
            mine_id,
            coal_output,
            electricity_usage,
            fuel_consumption,
            methane_leaks,
            stockpile_emissions,
            date
        } = req.body;

        // Validate required fields
        if (!mine_id || !coal_output || !electricity_usage || !fuel_consumption) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({ error: 'Required fields missing' });
        }

        // Verify mine exists
        const mine = await Mine.findById(mine_id);
        if (!mine) {
            console.log('Mine not found:', mine_id);
            return res.status(404).json({ error: 'Mine not found' });
        }

        const emission = await Emission.create({
            mine_id,
            coal_output: parseFloat(coal_output),
            electricity_usage: parseFloat(electricity_usage),
            fuel_consumption: parseFloat(fuel_consumption),
            methane_leaks: parseFloat(methane_leaks || 0),
            stockpile_emissions: parseFloat(stockpile_emissions || 0),
            date
        });

        console.log('Emission record created:', emission);
        res.status(201).json(emission);
    } catch (error) {
        console.error('Error creating emission record:', error);
        res.status(500).json({ error: 'Error creating emission record' });
    }
});

// Get emissions for a specific mine
router.get('/mine/:mineId', auth, async (req, res) => {
    console.log(`GET /mine/${req.params.mineId} - Fetching emissions for mine`);
    try {
        const emissions = await Emission.listByMineId(req.params.mineId);
        console.log('Emissions found:', emissions);
        res.json(emissions);
    } catch (error) {
        console.error('Error fetching emissions:', error);
        res.status(500).json({ error: 'Error fetching emissions' });
    }
});

// Get emission statistics
router.get('/stats', auth, async (req, res) => {
    console.log('GET /stats - Fetching emission statistics with query:', req.query);
    try {
        const { mine_id } = req.query;
        const stats = await Emission.getStatistics(mine_id);
        console.log('Emission statistics:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching emission statistics:', error);
        res.status(500).json({ error: 'Error fetching emission statistics' });
    }
});

// Get single emission record
router.get('/:id', auth, async (req, res) => {
    console.log(`GET /${req.params.id} - Fetching single emission record`);
    try {
        const emission = await Emission.findById(req.params.id);
        if (!emission) {
            console.log('Emission record not found:', req.params.id);
            return res.status(404).json({ error: 'Emission record not found' });
        }
        console.log('Emission record retrieved:', emission);
        res.json(emission);
    } catch (error) {
        console.error('Error fetching emission record:', error);
        res.status(500).json({ error: 'Error fetching emission record' });
    }
});

// Update emission record (restricted to analysts and environmental officers)
router.put('/:id', auth, authorize(['analyst', 'environmental_officer', 'admin']), async (req, res) => {
    console.log(`PUT /${req.params.id} - Updating emission record with:`, req.body);
    try {
        const {
            coal_output,
            electricity_usage,
            fuel_consumption,
            methane_leaks,
            stockpile_emissions,
            date
        } = req.body;

        if (!coal_output || !electricity_usage || !fuel_consumption) {
            console.log('Missing required fields for update:', req.body);
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const emission = await Emission.update(req.params.id, {
            coal_output: parseFloat(coal_output),
            electricity_usage: parseFloat(electricity_usage),
            fuel_consumption: parseFloat(fuel_consumption),
            methane_leaks: parseFloat(methane_leaks || 0),
            stockpile_emissions: parseFloat(stockpile_emissions || 0),
            date
        });

        console.log('Emission record updated:', emission);
        res.json(emission);
    } catch (error) {
        console.error('Error updating emission record:', error);
        if (error.message === 'Emission record not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error updating emission record' });
    }
});

// Calculate emissions without saving
router.post('/calculate', auth, async (req, res) => {
    console.log('POST /calculate - Calculating emissions with:', req.body);
    try {
        const {
            coal_output,
            electricity_usage,
            fuel_consumption,
            methane_leaks,
            stockpile_emissions
        } = req.body;

        if (!coal_output || !electricity_usage || !fuel_consumption) {
            console.log('Missing required fields for calculation:', req.body);
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const total_emissions = Emission.calculateTotalEmissions({
            coal_output: parseFloat(coal_output),
            electricity_usage: parseFloat(electricity_usage),
            fuel_consumption: parseFloat(fuel_consumption),
            methane_leaks: parseFloat(methane_leaks || 0),
            stockpile_emissions: parseFloat(stockpile_emissions || 0)
        });

        console.log('Calculated total emissions:', total_emissions);
        res.json({ total_emissions });
    } catch (error) {
        console.error('Error calculating emissions:', error);
        res.status(500).json({ error: 'Error calculating emissions' });
    }
});

// Delete emission record (restricted to analysts and environmental officers)
router.delete('/:id', auth, authorize(['analyst', 'environmental_officer', 'admin']), async (req, res) => {
    console.log(`DELETE /${req.params.id} - Deleting emission record`);
    try {
        await Emission.delete(req.params.id);
        console.log('Emission record deleted successfully:', req.params.id);
        res.json({ message: 'Emission record deleted successfully' });
    } catch (error) {
        console.error('Error deleting emission record:', error);
        if (error.message === 'Emission record not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error deleting emission record' });
    }
});

module.exports = router;
