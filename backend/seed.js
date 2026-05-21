import { User, sequelize } from './models/index.js';

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Careful, this wipes the DB!
        console.log('Database synced for seeding.');

        const users = [
            {
                userId: 'admin',
                password: 'admin_password',
                name: 'System Administrator',
                role: 'Admin',
                address: '123 Admin Lane, Main City',
                mobile: '9876543210'
            },
            {
                userId: 'dr_john',
                password: 'doctor_password',
                name: 'Dr. John Watson',
                role: 'Doctor',
                hospitalName: 'St. Mary\'s Hospital',
                address: '221B Baker Street, London',
                mobile: '1234567890'
            },
            {
                userId: 'lab_tech_1',
                password: 'lab_password',
                name: 'Abhi Singh',
                role: 'Lab Technician',
                certifiedId: 'CERT-LAB-001',
                address: '456 Lab Heights, Bio District',
                mobile: '5566778899'
            },
            {
                userId: 'pharmacy_1',
                password: 'pharmacy_password',
                name: 'MediCare Pharmacy',
                role: 'Pharmacy',
                certifiedId: 'PHARM-LICENSE-2024',
                address: '789 Medical Square, South Plaza',
                mobile: '1122334455'
            }
        ];

        for (const user of users) {
            await User.create(user);
        }

        console.log('Seed data created successfully!');
        process.exit();
    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
};

seed();
