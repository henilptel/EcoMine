const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { auth, authorize } = require('../middleware/auth');

// User registration
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await User.create({ username, password, role });
        const token = User.generateAuthToken(user);
        
        res.status(201).json({ user, token });
    } catch (error) {
        if (error.message === 'Username already exists') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error creating user' });
        }
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByCredentials(username, password);
        const token = User.generateAuthToken(user);
        
        res.json({ 
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }, 
            token 
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid login credentials' });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// List all users (admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.list();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Update user role (admin only)
router.patch('/:id/role', auth, authorize(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }
        
        const user = await User.updateRole(req.params.id, role);
        res.json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error updating user role' });
        }
    }
});

// Delete user (admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error deleting user' });
        }
    }
});

module.exports = router;
