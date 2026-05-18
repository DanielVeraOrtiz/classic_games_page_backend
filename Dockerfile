FROM node:22-alpine AS base

WORKDIR /app

# apk add es similar a apt install de debian, este es de alpine. Esto instala sin dejar cache dumn-init.
# Linux puede manejar mal a Node como PID 1 entre otras cosas, entonces dumb init es un init minimalista
# intermediario entre el sistema y node ayudando shutdowns limpios, ctrl + c, señales y procesos hijos.
RUN apk add --no-cache dumb-init

# Copiar los package.
COPY package.json package-lock.json ./

# Segundo stage production
FROM base AS production

# Solo dependencias productivas, saltando devDependencies. Instalación precisa de las versiones en lockfile.
# En otro proyecto no hice omit, pero era porque tenia que hacer build y necesito typescript entre otras cosas, luego
# solo el build quedan sin esas dependencias.
RUN npm ci --omit=dev

# Copiar todo para luego correar código con archivos de migraciones presentes y demás.
COPY . .

# Change mode para decir que es un script ejecutable.
RUN chmod +x scripts/docker-entrypoint.prod.sh

ENV NODE_ENV=production

EXPOSE 3000

# La imagen oficial de Node trae usuario. Entonces con esto deja de correr como root a node. Aunque,
# como lo hice en otro proyecto, para copiar archivos y tener un ownership más controlado y explicíto puedo
# crear mi propio usuario y grupo.
USER node

# Implica que todo comando correrá pasando primero por dumb-init --
ENTRYPOINT ["dumb-init", "--"]

# Se ejecuta el script. Termina ejecutando dumb-init -- ./scripts/docker-entrypoint.prod.sh
CMD ["./scripts/docker-entrypoint.prod.sh"]
