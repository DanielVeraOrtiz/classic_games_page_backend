// En ningun modelo exporto sequelize. Sin embargo, sequelize es la instancia de conexion.
// Por lo que esta bien asi.

const { sequelize } = require('../../models');

// Reset de la bdd. En SQL TRUNCATE es para remove todas las columnas rapidamente
// Sync reconstruye la bdd cada vez. dropea y recrea tablas cada vez. Reinicia Indices, pero es mas lento.
async function resetDatabase() {
  await sequelize.sync({ force: true });
}

// Cerrar la bdd
async function closeDatabase() {
  await sequelize.close();
}

module.exports = { resetDatabase, closeDatabase };
