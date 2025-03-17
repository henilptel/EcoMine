const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(
    path.join(__dirname, '../database/carbon_neutrality.db'),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return;
        }
        console.log('Connected to SQLite database');
        initDatabase();
    }
);

// Initialize database tables
function initDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Mines table
        db.run(`CREATE TABLE IF NOT EXISTS mines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            area_size FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Emissions table
        db.run(`CREATE TABLE IF NOT EXISTS emissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER,
            coal_output FLOAT,
            electricity_usage FLOAT,
            fuel_consumption FLOAT,
            methane_leaks FLOAT,
            stockpile_emissions FLOAT,
            total_emissions FLOAT,
            recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mine_id) REFERENCES mines(id)
        )`);

        // Forest data table
        db.run(`CREATE TABLE IF NOT EXISTS forest_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER,
            forest_area FLOAT,
            tree_species TEXT,
            trees_count INTEGER,
            planting_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            estimated_co2_absorption FLOAT,
            FOREIGN KEY(mine_id) REFERENCES mines(id)
        )`);

        // Neutrality strategies table
        db.run(`CREATE TABLE IF NOT EXISTS neutrality_strategies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER,
            strategy_type TEXT,
            description TEXT,
            estimated_impact FLOAT,
            implementation_cost FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mine_id) REFERENCES mines(id)
        )`);
    });
}

module.exports = db;
