const User = require('../models/user');

async function createAdminUser() {
    try {
        await User.create({
            username: 'admin',
            password: 'admin123', // This should be changed after first login
            role: 'admin'
        });
        console.log('Admin user created successfully');
    } catch (error) {
        if (error.message === 'Username already exists') {
            console.log('Admin user already exists');
        } else {
            console.error('Error creating admin user:', error);
        }
    }
    process.exit();
}

createAdminUser();
