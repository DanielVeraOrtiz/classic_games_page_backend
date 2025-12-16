import dotenv from 'dotenv';
import app from './app.js';
import db from './models/index.cjs';

dotenv.config();

const PORT = process.env.PORT || 3000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    app.listen(PORT, (err) => {
      if (err) {
        console.error('Failed', err);
        return;
      }
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
