# Dockerfile simplifié pour ATS Backend
FROM node:18-alpine

# Installer Yarn
RUN npm install -g yarn

# Définir le répertoire de travail directement dans le backend
WORKDIR /app/backEnd

# Copier le backend
COPY backEnd/ ./

# Installer les dépendances avec Yarn
RUN yarn install

# Exposer le port
EXPOSE 3000

# Commande de démarrage directe
CMD ["yarn", "start"] 