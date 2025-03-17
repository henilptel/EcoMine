const db = require('../config/database');

class Mine {
    static async create({ name, location, area_size, operational_status }) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO mines (name, location, area_size, operational_status)
                VALUES (?, ?, ?, ?)
            `;
            
            db.run(sql, [name, location, area_size, operational_status], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    id: this.lastID,
                    name,
                    location,
                    area_size,
                    operational_status
                });
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM mines WHERE id = ?`;
            
            db.get(sql, [id], (err, mine) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(mine);
            });
        });
    }

    static async list() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM mines ORDER BY created_at DESC`;
            
            db.all(sql, [], (err, mines) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(mines);
            });
        });
    }

    static async update(id, { name, location, area_size, operational_status }) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE mines 
                SET name = ?, location = ?, area_size = ?, operational_status = ?
                WHERE id = ?
            `;
            
            db.run(sql, [name, location, area_size, operational_status, id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('Mine not found'));
                    return;
                }
                resolve({
                    id,
                    name,
                    location,
                    area_size,
                    operational_status
                });
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM mines WHERE id = ?`;
            
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('Mine not found'));
                    return;
                }
                resolve({ id });
            });
        });
    }
}

module.exports = Mine;
