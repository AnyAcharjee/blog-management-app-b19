import app from './app.js';
import { configDotenv } from 'dotenv';
import { initDB } from './db.js';

configDotenv();
const PORT = process.env.PORT || 5001;

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`)
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1);
    });
