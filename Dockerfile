# Dockerfile simplifié pour ATS Backend
FROM node:18-alpine

# Définir le répertoire de travail directement dans le backend
WORKDIR /app/backEnd

# Copier le backend
COPY backEnd/ ./

# Installer les dépendances avec Yarn (déjà inclus dans node:18-alpine)
RUN yarn install

# Exposer le port
EXPOSE 3000

# Commande de démarrage directe (test)
CMD ["node", "src/server.test.js"] 