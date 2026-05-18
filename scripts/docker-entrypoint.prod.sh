#!/bin/sh
# "si algún comando falla, termina el script inmediatamente"
set -e

# echo es como print o console.log en otros lenguajes.
echo "Running database migrations..."

# Migrar bdd, también aquí podría agregar otros comandos como seeders.
npx sequelize-cli db:migrate

echo "Starting application..."
exec npm run start
