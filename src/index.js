const app = require('./app');
const db = require('./models/index.js');
const dotenv = require('dotenv');

// Para las variables del .env
dotenv.config();

const PORT = process.env.PORT || 3000;

// Aqui esta el listen de koa cuando pasa las otras fases.
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
