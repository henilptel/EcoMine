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
            area_size FLOAT NOT NULL,
            operational_status TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Emissions table
        db.run(`CREATE TABLE IF NOT EXISTS emissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER NOT NULL,
            date TIMESTAMP NOT NULL,
            coal_output FLOAT NOT NULL,
            electricity_usage FLOAT NOT NULL,
            fuel_consumption FLOAT NOT NULL,
            methane_leaks FLOAT DEFAULT 0,
            stockpile_emissions FLOAT DEFAULT 0,
            total_emissions FLOAT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mine_id) REFERENCES mines(id) ON DELETE CASCADE
        )`);

        // Forest data table
        db.run(`CREATE TABLE IF NOT EXISTS forest_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER NOT NULL,
            forest_area FLOAT NOT NULL,
            tree_species TEXT NOT NULL,
            trees_count INTEGER NOT NULL,
            planting_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            estimated_co2_absorption FLOAT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mine_id) REFERENCES mines(id) ON DELETE CASCADE
        )`);

        // Neutrality strategies table
        db.run(`CREATE TABLE IF NOT EXISTS neutrality_strategies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER NOT NULL,
            strategy_type TEXT NOT NULL,
            description TEXT NOT NULL,
            estimated_impact FLOAT NOT NULL,
            implementation_cost FLOAT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mine_id) REFERENCES mines(id) ON DELETE CASCADE
        )`);

        // Mining operations table
        db.run(`CREATE TABLE IF NOT EXISTS mining_operations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mine_id INTEGER NOT NULL,
            date TIMESTAMP NOT NULL,
            excavation_material_volume FLOAT NOT NULL,
            excavation_equipment_hours FLOAT NOT NULL,
            excavation_fuel_consumption FLOAT NOT NULL,
            transport_distance FLOAT NOT NULL,
            transport_vehicle_types TEXT NOT NULL,
            transport_fuel_consumption FLOAT NOT NULL,
            equipment_type TEXT NOT NULL,
            equipment_operating_hours FLOAT NOT NULL,
            equipment_energy_consumption FLOAT NOT NULL,
            energy_electricity FLOAT NOT NULL,
            energy_diesel FLOAT NOT NULL,
            energy_other FLOAT,
            waste_overburden FLOAT NOT NULL,
            waste_rock FLOAT NOT NULL,
            waste_treatment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mine_id) REFERENCES mines(id) ON DELETE CASCADE
        )`);
    });
}

module.exports = db;
