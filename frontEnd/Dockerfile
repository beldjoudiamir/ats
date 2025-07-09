# Dockerfile pour le frontend React
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer Yarn globalement
RUN npm install -g yarn

# Installer les dépendances avec Yarn
RUN yarn install --frozen-lockfile

# Copier le code source
COPY . .

# Construire l'application pour la production
RUN yarn build

# Installer serve pour servir l'application
RUN yarn global add serve

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["serve", "-s", "dist", "-l", "3000"] 