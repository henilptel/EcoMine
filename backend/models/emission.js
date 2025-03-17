const db = require('../config/database');

// Emission factors based on IPCC guidelines
const EMISSION_FACTORS = {
    COAL_PRODUCTION: 0.8,      // tCO2e/ton
    ELECTRICITY: 0.82,         // kgCO2e/kWh
    DIESEL_FUEL: 2.68,         // kgCO2e/liter
    METHANE_GWP: 28           // Global Warming Potential
};

class Emission {
    static calculateTotalEmissions({
        coal_output,
        electricity_usage,
        fuel_consumption,
        methane_leaks,
        stockpile_emissions
    }) {
        const coalEmissions = coal_output * EMISSION_FACTORS.COAL_PRODUCTION;
        const electricityEmissions = (electricity_usage * EMISSION_FACTORS.ELECTRICITY) / 1000; // Convert to tons
        const fuelEmissions = (fuel_consumption * EMISSION_FACTORS.DIESEL_FUEL) / 1000; // Convert to tons
        const methaneEmissions = methane_leaks * EMISSION_FACTORS.METHANE_GWP;
        
        return (
            coalEmissions +
            electricityEmissions +
            fuelEmissions +
            methaneEmissions +
            stockpile_emissions
        );
    }

    static async create({
        mine_id,
        coal_output,
        electricity_usage,
        fuel_consumption,
        methane_leaks,
        stockpile_emissions,
        date = new Date().toISOString()
    }) {
        return new Promise((resolve, reject) => {
            const total_emissions = this.calculateTotalEmissions({
                coal_output,
                electricity_usage,
                fuel_consumption,
                methane_leaks,
                stockpile_emissions
            });

            const sql = `
                INSERT INTO emissions (
                    mine_id, date, coal_output, electricity_usage,
                    fuel_consumption, methane_leaks, stockpile_emissions,
                    total_emissions
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(
                sql,
                [
                    mine_id,
                    date,
                    coal_output,
                    electricity_usage,
                    fuel_consumption,
                    methane_leaks,
                    stockpile_emissions,
                    total_emissions
                ],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        id: this.lastID,
                        mine_id,
                        date,
                        coal_output,
                        electricity_usage,
                        fuel_consumption,
                        methane_leaks,
                        stockpile_emissions,
                        total_emissions
                    });
                }
            );
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM emissions WHERE id = ?`;
            
            db.get(sql, [id], (err, emission) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(emission);
            });
        });
    }

    static async listByMineId(mine_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM emissions WHERE mine_id = ? ORDER BY date DESC`;
            
            db.all(sql, [mine_id], (err, emissions) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(emissions);
            });
        });
    }

    static async getStatistics(mine_id = null) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT 
                    COUNT(*) as total_records,
                    SUM(total_emissions) as total_emissions,
                    AVG(total_emissions) as average_emissions,
                    MIN(total_emissions) as min_emissions,
                    MAX(total_emissions) as max_emissions
                FROM emissions
            `;
            
            const params = [];
            if (mine_id) {
                sql += ` WHERE mine_id = ?`;
                params.push(mine_id);
            }

            db.get(sql, params, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(stats);
            });
        });
    }

    static async update(id, {
        coal_output,
        electricity_usage,
        fuel_consumption,
        methane_leaks,
        stockpile_emissions,
        date
    }) {
        return new Promise((resolve, reject) => {
            const total_emissions = this.calculateTotalEmissions({
                coal_output,
                electricity_usage,
                fuel_consumption,
                methane_leaks,
                stockpile_emissions
            });

            const sql = `
                UPDATE emissions 
                SET coal_output = ?, 
                    electricity_usage = ?,
                    fuel_consumption = ?,
                    methane_leaks = ?,
                    stockpile_emissions = ?,
                    total_emissions = ?,
                    date = ?
                WHERE id = ?
            `;
            
            db.run(
                sql,
                [
                    coal_output,
                    electricity_usage,
                    fuel_consumption,
                    methane_leaks,
                    stockpile_emissions,
                    total_emissions,
                    date,
                    id
                ],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (this.changes === 0) {
                        reject(new Error('Emission record not found'));
                        return;
                    }
                    resolve({
                        id,
                        coal_output,
                        electricity_usage,
                        fuel_consumption,
                        methane_leaks,
                        stockpile_emissions,
                        total_emissions,
                        date
                    });
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM emissions WHERE id = ?`;
            
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('Emission record not found'));
                    return;
                }
                resolve({ id });
            });
        });
    }
}

module.exports = Emission;
