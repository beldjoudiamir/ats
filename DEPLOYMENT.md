# Guide de Déploiement - ATS Application

## 🚀 Options de Déploiement

### 1. Déploiement Local (Développement)

#### Prérequis
- Node.js 18+
- MongoDB installé localement
- Yarn ou npm

#### Étapes
```bash
# 1. Cloner le repository
git clone <votre-repo-url>
cd ats-finiched-avec-option

# 2. Configuration Backend
cd backEnd
yarn install
cp env.example .env
# Éditer .env avec vos configurations

# 3. Configuration Frontend
cd ../frontEnd
yarn install

# 4. Démarrer MongoDB
mongod

# 5. Démarrer Backend (nouveau terminal)
cd backEnd
yarn dev

# 6. Démarrer Frontend (nouveau terminal)
cd frontEnd
yarn start
```

### 2. Déploiement sur Serveur VPS

#### Prérequis Serveur
- Ubuntu 20.04+ ou CentOS 8+
- Node.js 18+
- MongoDB
- Nginx
- PM2 (gestionnaire de processus)

#### Installation sur Serveur

```bash
# 1. Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# 2. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Installer MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# 4. Installer Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. Installer PM2
sudo npm install -g pm2
```

#### Configuration de l'Application

```bash
# 1. Cloner le projet
git clone <votre-repo-url>
cd ats-finiched-avec-option

# 2. Configuration Backend
cd backEnd
npm install
cp env.example .env
# Éditer .env pour la production
```

Configuration `.env` pour la production :
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ats-production
JWT_SECRET=votre-secret-jwt-tres-securise
NODE_ENV=production
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

```bash
# 3. Configuration Frontend
cd ../frontEnd
npm install
# Créer .env pour la production
```

Configuration `.env` frontend pour la production :
```env
VITE_API_URL=https://votre-domaine.com/api
VITE_APP_NAME=ATS Application
```

#### Build et Démarrage

```bash
# 1. Build Frontend
cd frontEnd
npm run build

# 2. Démarrer Backend avec PM2
cd ../backEnd
pm2 start src/server.js --name "ats-backend"

# 3. Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

#### Configuration Nginx

Créer le fichier `/etc/nginx/sites-available/ats-app` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend React
    location / {
        root /var/www/ats-app/frontEnd/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache des assets statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/ats-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Déploiement avec Docker

#### Dockerfile Backend

Créer `backEnd/Dockerfile` :
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### Dockerfile Frontend

Créer `frontEnd/Dockerfile` :
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

Créer `docker-compose.yml` à la racine :
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: ats-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backEnd
    container_name: ats-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/ats?authSource=admin
      - JWT_SECRET=votre-secret-jwt
      - PORT=3000
    ports:
      - "3000:3000"
    depends_on:
      - mongodb

  frontend:
    build: ./frontEnd
    container_name: ats-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### Déploiement Docker

```bash
# Build et démarrer les conteneurs
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down
```

### 4. Déploiement Cloud (AWS, Google Cloud, Azure)

#### AWS EC2 + RDS

1. **Créer une instance EC2**
2. **Créer une base de données RDS MongoDB**
3. **Configurer les groupes de sécurité**
4. **Déployer l'application**

#### Google Cloud Run

```bash
# Build et push des images
gcloud builds submit --tag gcr.io/votre-projet/ats-backend ./backEnd
gcloud builds submit --tag gcr.io/votre-projet/ats-frontend ./frontEnd

# Déployer sur Cloud Run
gcloud run deploy ats-backend --image gcr.io/votre-projet/ats-backend --platform managed
gcloud run deploy ats-frontend --image gcr.io/votre-projet/ats-frontend --platform managed
```

## 🔒 Sécurité

### Certificats SSL
```bash
# Installation Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# Obtenir un certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### Variables d'environnement sécurisées
- Utiliser des secrets managers (AWS Secrets Manager, Google Secret Manager)
- Ne jamais commiter les fichiers `.env` dans Git
- Utiliser des mots de passe forts pour JWT_SECRET

### Firewall
```bash
# Configuration UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📊 Monitoring

### PM2 Monitoring
```bash
# Dashboard PM2
pm2 monit

# Logs
pm2 logs ats-backend

# Redémarrage
pm2 restart ats-backend
```

### Nginx Monitoring
```bash
# Vérifier les logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Statistiques
sudo nginx -V
```

## 🔄 Mise à Jour

### Script de déploiement automatique
Créer `deploy.sh` :
```bash
#!/bin/bash

echo "🚀 Déploiement ATS Application..."

# Pull des dernières modifications
git pull origin main

# Mise à jour Backend
cd backEnd
npm install
pm2 restart ats-backend

# Mise à jour Frontend
cd ../frontEnd
npm install
npm run build

echo "✅ Déploiement terminé!"
```

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
./deploy.sh
```

## 📞 Support

Pour toute question sur le déploiement, consultez :
- [Documentation PM2](https://pm2.keymetrics.io/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation AWS](https://aws.amazon.com/documentation/) 