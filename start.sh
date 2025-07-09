#!/bin/sh

# Script de démarrage pour ATS Backend
echo "🚀 Démarrage du serveur ATS..."

# Aller dans le dossier backend
cd /app/backEnd

# Démarrer le serveur
echo "📁 Répertoire de travail: $(pwd)"
echo "🔧 Démarrage du serveur Node.js..."

# Démarrer le serveur de production
exec node src/server.production.js 