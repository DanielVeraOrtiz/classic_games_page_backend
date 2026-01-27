const { sequelize } = require('../../models');

// Reset de la bdd. En SQL TRUNCATE es para remove todas las columnas rapidamente
async function resetDatabase() {
  await sequelize.truncate({ cascade: true });
}

// Cerrar la bdd
async function closeDatabase() {
  await sequelize.close();
}

module.exports = { resetDatabase, closeDatabase };
