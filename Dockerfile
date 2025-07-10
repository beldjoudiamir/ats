# Dockerfile pour ATS
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json
COPY backEnd/package*.json ./backEnd/
COPY frontEnd/package*.json ./frontEnd/

# Installer les dépendances
RUN cd backEnd && npm install
RUN cd frontEnd && npm install

# Copier le code source
COPY . .

# Builder le frontend
RUN cd frontEnd && npm run build

# Exposer le port (Railway gère le port via $PORT)
EXPOSE $PORT

# Commande de démarrage
CMD ["sh", "-c", "cd backEnd && npm start"] 