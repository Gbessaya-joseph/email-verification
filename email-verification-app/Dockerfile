FROM node:20.11-slim

# Dépendances nécessaires pour Prisma et hot reload
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm install
RUN npx prisma generate
# Copie du reste de l’application
COPY . .

# Port exposé par Next.js
EXPOSE 3000

# Commande de démarrage en mode développement avec hot reload
CMD ["npm", "run", "dev"]