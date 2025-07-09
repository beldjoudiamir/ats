#!/bin/bash

echo "🚀 Déploiement Frontend ATS"
echo "=========================="

# Vérifier que Yarn est installé
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn n'est pas installé. Installez-le d'abord."
    exit 1
fi

echo "📦 Installation des dépendances..."
yarn install

echo "🔨 Build de l'application..."
yarn build

echo "✅ Build terminé !"
echo "📁 Dossier dist créé avec succès"
echo "🌐 Pour tester localement: yarn preview"
echo "🚀 Prêt pour le déploiement sur Railway/Vercel/Netlify" 