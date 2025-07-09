# Dockerfile pour ATS Backend
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json ./
COPY railway.json ./

# Copier le backend
COPY backEnd/ ./backEnd/

# Installer les dépendances du backend avec npm
WORKDIR /app/backEnd
RUN npm install

# Retourner au répertoire racine
WORKDIR /app

# Exposer le port
EXPOSE 3000

# Commande de démarrage avec npm
CMD ["npm", "run", "start"] 