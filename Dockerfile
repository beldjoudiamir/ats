# Dockerfile pour ATS Backend
FROM node:18-alpine

# Installer yarn
RUN npm install -g yarn

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json ./
COPY .nixpacks ./
COPY railway.json ./

# Copier le backend
COPY backEnd/ ./backEnd/

# Installer les dépendances du backend
WORKDIR /app/backEnd
RUN yarn install --frozen-lockfile

# Retourner au répertoire racine
WORKDIR /app

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["yarn", "start"] 