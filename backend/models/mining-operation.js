const db = require('../config/database');

class MiningOperation {
    static async create({
        mine_id,
        date,
        excavation_data,
        transportation_data,
        equipment_data,
        energy_consumption,
        waste_management
    }) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO mining_operations (
                    mine_id,
                    date,
                    excavation_material_volume,
                    excavation_equipment_hours,
                    excavation_fuel_consumption,
                    transport_distance,
                    transport_vehicle_types,
                    transport_fuel_consumption,
                    equipment_type,
                    equipment_operating_hours,
                    equipment_energy_consumption,
                    energy_electricity,
                    energy_diesel,
                    energy_other,
                    waste_overburden,
                    waste_rock,
                    waste_treatment
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                mine_id,
                date,
                excavation_data.materialVolume,
                excavation_data.equipmentHours,
                excavation_data.fuelConsumption,
                transportation_data.distance,
                transportation_data.vehicleTypes,
                transportation_data.fuelConsumption,
                equipment_data.type,
                equipment_data.operatingHours,
                equipment_data.energyConsumption,
                energy_consumption.electricity,
                energy_consumption.diesel,
                energy_consumption.other,
                waste_management.overburden,
                waste_management.wasteRock,
                waste_management.treatment
            ];

            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    id: this.lastID,
                    mine_id,
                    date
                });
            });
        });
    }

    static async findByMineId(mine_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM mining_operations WHERE mine_id = ? ORDER BY date DESC`;
            
            db.all(sql, [mine_id], (err, operations) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(operations);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM mining_operations WHERE id = ?`;
            
            db.get(sql, [id], (err, operation) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(operation);
            });
        });
    }

    static async update(id, {
        excavation_data,
        transportation_data,
        equipment_data,
        energy_consumption,
        waste_management
    }) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE mining_operations 
                SET excavation_material_volume = ?,
                    excavation_equipment_hours = ?,
                    excavation_fuel_consumption = ?,
                    transport_distance = ?,
                    transport_vehicle_types = ?,
                    transport_fuel_consumption = ?,
                    equipment_type = ?,
                    equipment_operating_hours = ?,
                    equipment_energy_consumption = ?,
                    energy_electricity = ?,
                    energy_diesel = ?,
                    energy_other = ?,
                    waste_overburden = ?,
                    waste_rock = ?,
                    waste_treatment = ?
                WHERE id = ?
            `;
            
            const params = [
                excavation_data.materialVolume,
                excavation_data.equipmentHours,
                excavation_data.fuelConsumption,
                transportation_data.distance,
                transportation_data.vehicleTypes,
                transportation_data.fuelConsumption,
                equipment_data.type,
                equipment_data.operatingHours,
                equipment_data.energyConsumption,
                energy_consumption.electricity,
                energy_consumption.diesel,
                energy_consumption.other,
                waste_management.overburden,
                waste_management.wasteRock,
                waste_management.treatment,
                id
            ];

            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('Mining operation not found'));
                    return;
                }
                resolve({ id });
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM mining_operations WHERE id = ?`;
            
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('Mining operation not found'));
                    return;
                }
                resolve({ id });
            });
        });
    }
}

module.exports = MiningOperation;
