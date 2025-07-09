# Dockerfile optimisé pour ATS Backend
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Définir le répertoire de travail
WORKDIR /app/backEnd

# Copier package.json et yarn.lock d'abord pour optimiser le cache
COPY backEnd/package*.json backEnd/yarn.lock ./

# Installer les dépendances
RUN yarn install --frozen-lockfile --production=false

# Copier le reste du code
COPY backEnd/ ./

# Exposer le port
EXPOSE 3000

# Commande de démarrage (serveur simple sans MongoDB)
CMD ["node", "src/server.simple.js"] 