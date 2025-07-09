#!/bin/bash

# Script de déploiement ATS pour Hostinger
# Usage: ./deploy.sh [frontend|backend|all]

echo "🚀 Script de déploiement ATS pour Hostinger"
echo "=========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si le mode est spécifié
MODE=${1:-"all"}

case $MODE in
    "frontend")
        echo "📱 Déploiement du Frontend uniquement"
        deploy_frontend
        ;;
    "backend")
        echo "🔧 Déploiement du Backend uniquement"
        deploy_backend
        ;;
    "all")
        echo "🌐 Déploiement complet (Frontend + Backend)"
        deploy_frontend
        deploy_backend
        ;;
    *)
        print_error "Mode invalide. Utilisez: frontend, backend, ou all"
        exit 1
        ;;
esac

# Fonction de déploiement frontend
deploy_frontend() {
    echo ""
    echo "📱 Déploiement du Frontend..."
    
    # Vérifier si on est dans le bon dossier
    if [ ! -d "frontEnd" ]; then
        print_error "Dossier frontEnd non trouvé. Exécutez ce script depuis la racine du projet."
        exit 1
    fi
    
    # Aller dans le dossier frontend
    cd frontEnd
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        print_status "Installation des dépendances frontend..."
        yarn install
    fi
    
    # Build de production
    print_status "Build de production en cours..."
    yarn build
    
    if [ $? -eq 0 ]; then
        print_status "Build frontend terminé avec succès !"
        print_warning "📁 Contenu du dossier dist/ prêt pour upload :"
        ls -la dist/
        
        echo ""
        print_status "📋 Instructions pour upload sur Hostinger :"
        echo "1. Connectez-vous à votre panneau Hostinger"
        echo "2. Allez dans 'Gestionnaire de fichiers'"
        echo "3. Naviguez vers public_html/"
        echo "4. Uploadez le contenu du dossier frontEnd/dist/"
        echo "5. Assurez-vous que le fichier .htaccess est présent"
    else
        print_error "Erreur lors du build frontend"
        exit 1
    fi
    
    # Retourner à la racine
    cd ..
}

# Fonction de déploiement backend
deploy_backend() {
    echo ""
    echo "🔧 Déploiement du Backend..."
    
    # Vérifier si on est dans le bon dossier
    if [ ! -d "backEnd" ]; then
        print_error "Dossier backEnd non trouvé. Exécutez ce script depuis la racine du projet."
        exit 1
    fi
    
    # Aller dans le dossier backend
    cd backEnd
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        print_status "Installation des dépendances backend..."
        npm install
    fi
    
    # Vérifier si le fichier .env existe
    if [ ! -f ".env" ]; then
        print_warning "Fichier .env non trouvé. Création d'un exemple..."
        if [ -f "env.example" ]; then
            cp env.example .env
            print_status "Fichier .env créé à partir de env.example"
            print_warning "⚠️  N'oubliez pas de configurer vos variables d'environnement !"
        else
            print_error "Fichier env.example non trouvé"
            exit 1
        fi
    fi
    
    # Créer les administrateurs si nécessaire
    print_status "Création des administrateurs..."
    npm run create-admins
    
    print_status "Backend prêt pour déploiement !"
    
    echo ""
    print_status "📋 Instructions pour déploiement backend :"
    echo ""
    echo "Option A - VPS Hostinger :"
    echo "1. Connectez-vous à votre VPS via SSH"
    echo "2. Clonez le repository : git clone <votre-repo>"
    echo "3. cd ats/backEnd"
    echo "4. npm install"
    echo "5. Configurez le fichier .env"
    echo "6. npm install -g pm2"
    echo "7. pm2 start src/server.js --name 'ats-backend'"
    echo "8. pm2 startup && pm2 save"
    echo ""
    echo "Option B - Service externe (Railway/Render) :"
    echo "1. Connectez votre repo GitHub"
    echo "2. Configurez les variables d'environnement"
    echo "3. Déployez automatiquement"
    
    # Retourner à la racine
    cd ..
}

# Fonction de vérification finale
check_deployment() {
    echo ""
    echo "🔍 Vérification du déploiement..."
    
    if [ -d "frontEnd/dist" ]; then
        print_status "✅ Build frontend présent"
    else
        print_warning "⚠️  Build frontend manquant"
    fi
    
    if [ -d "backEnd/node_modules" ]; then
        print_status "✅ Dépendances backend installées"
    else
        print_warning "⚠️  Dépendances backend manquantes"
    fi
    
    if [ -f "backEnd/.env" ]; then
        print_status "✅ Fichier .env présent"
    else
        print_warning "⚠️  Fichier .env manquant"
    fi
}

# Exécuter la vérification finale
check_deployment

echo ""
print_status "🎉 Script de déploiement terminé !"
echo ""
echo "📚 Consultez DEPLOYMENT.md pour les instructions détaillées"
echo "🔗 Votre application sera accessible sur votre domaine Hostinger" 