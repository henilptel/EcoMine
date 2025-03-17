const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

class User {
    static async create({ username, password, role }) {
        return new Promise(async (resolve, reject) => {
            try {
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);
                
                const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
                
                db.run(sql, [username, hashedPassword, role], function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            reject(new Error('Username already exists'));
                        } else {
                            reject(err);
                        }
                        return;
                    }
                    resolve({ id: this.lastID, username, role });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static async findByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE username = ?`;
            
            db.get(sql, [username], async (err, user) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!user) {
                    reject(new Error('Invalid login credentials'));
                    return;
                }

                const isMatch = await bcrypt.compare(password, user.password);
                
                if (!isMatch) {
                    reject(new Error('Invalid login credentials'));
                    return;
                }

                resolve(user);
            });
        });
    }

    static generateAuthToken(user) {
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        return token;
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, username, role, created_at FROM users WHERE id = ?`;
            
            db.get(sql, [id], (err, user) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(user);
            });
        });
    }

    static async list() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, username, role, created_at FROM users`;
            
            db.all(sql, [], (err, users) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(users);
            });
        });
    }

    static async updateRole(id, newRole) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET role = ? WHERE id = ?`;
            
            db.run(sql, [newRole, id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('User not found'));
                    return;
                }
                resolve({ id, role: newRole });
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM users WHERE id = ?`;
            
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new Error('User not found'));
                    return;
                }
                resolve({ id });
            });
        });
    }
}

module.exports = User;
