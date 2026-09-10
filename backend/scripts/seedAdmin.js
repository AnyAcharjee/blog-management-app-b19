import { initDB, closeDB, User } from '../db.js';

async function seedAdmin() {
    await initDB();

    const [admin, created] = await User.findOrCreate({
        where: { email: 'admin@example.com' },
        defaults: {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            isActive: true,
        },
    });

    console.log(created ? 'Admin user created.' : 'Admin user already exists.', admin.email);
    await closeDB();
}

seedAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});
