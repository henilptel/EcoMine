const express = require('express');
const cors = require('cors');
require('./config/database'); // Initialize database
const userRoutes = require('./routes/users');
const mineRoutes = require('./routes/mines');
const emissionRoutes = require('./routes/emissions');
const miningOperationRoutes = require('./routes/mining-operations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/mines', mineRoutes);
app.use('/api/emissions', emissionRoutes);
app.use('/api/mining-operations', miningOperationRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
