# Frontend ATS - React Application

## 📋 Description

Interface utilisateur de l'application ATS développée avec React 19, Vite et Tailwind CSS. Cette application offre une interface moderne et responsive pour la gestion de transport et de services.

## 🚀 Fonctionnalités

- **Dashboard interactif** avec graphiques D3.js
- **Gestion des clients** et transporteurs
- **Système de devis** et facturation
- **Messagerie intégrée**
- **Interface responsive** avec Tailwind CSS
- **Génération de PDF** pour devis et factures
- **Auto-refresh** des données
- **Recherche avancée** dans les tableaux

## 🛠️ Technologies

- **React 19** - Framework UI
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS
- **D3.js** - Graphiques et visualisations
- **React Router DOM** - Navigation
- **Axios** - Client HTTP
- **jsPDF** - Génération de PDF
- **Heroicons** - Icônes

## 📁 Structure des Composants

```
src/
├── Dashboard/                 # Composants du tableau de bord
│   ├── Clients/              # Gestion des clients
│   ├── Factures/             # Gestion des factures
│   ├── NosDevis/             # Gestion des devis
│   ├── Transport/            # Gestion des transports
│   ├── Messagerie/           # Système de messagerie
│   ├── TableauDeBord/        # Graphiques et statistiques
│   └── components/           # Composants partagés
├── components/               # Composants réutilisables
├── hooks/                    # Custom hooks React
├── utils/                    # Utilitaires
└── assets/                   # Ressources statiques
```

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

1. **Installer les dépendances**
```bash
cd frontEnd
npm install
```

2. **Démarrer en mode développement**
```bash
npm start
```

3. **Accéder à l'application**
- URL: http://localhost:5173

## 📜 Scripts Disponibles

- `npm start` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Lance ESLint pour vérifier le code

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` dans le dossier `frontEnd/` :

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=ATS
```

### Configuration Tailwind
Le fichier `tailwind.config.js` contient la configuration personnalisée pour le design system.

## 🎨 Composants Principaux

### Dashboard
- **mainDashboard.jsx** - Composant principal du dashboard
- **AutoRefreshIndicator.jsx** - Indicateur de rafraîchissement automatique
- **AutoRefreshSettings.jsx** - Paramètres de rafraîchissement

### Gestion des Données
- **ClientTable.jsx** - Tableau des clients
- **TransporteurTable.jsx** - Tableau des transporteurs
- **DevisTable.jsx** - Tableau des devis
- **FactureTable.jsx** - Tableau des factures

### Graphiques
- **PieChartD3.jsx** - Graphique circulaire
- **BarChartD3.jsx** - Graphique en barres
- **ColumnChartD3.jsx** - Graphique en colonnes
- **DonutChartD3.jsx** - Graphique en donut

## 🔌 API Integration

L'application communique avec le backend via le service `apiService.js` qui utilise Axios pour les requêtes HTTP.

### Endpoints principaux
- Authentification
- CRUD Clients
- CRUD Transporteurs
- CRUD Devis
- CRUD Factures
- Upload de fichiers

## 📱 Responsive Design

L'application est entièrement responsive grâce à Tailwind CSS avec des breakpoints pour :
- Mobile (sm: 640px)
- Tablet (md: 768px)
- Desktop (lg: 1024px)
- Large Desktop (xl: 1280px)

## 🧪 Tests

Pour lancer les tests (si configurés) :
```bash
npm test
```

## 📦 Build de Production

1. **Construire l'application**
```bash
npm run build
```

2. **Prévisualiser la build**
```bash
npm run preview
```

## 🔍 Débogage

- Utiliser les React DevTools
- Vérifier la console du navigateur
- Utiliser les logs dans `apiService.js`

## 🤝 Contribution

1. Suivre les conventions de nommage
2. Utiliser les composants existants quand possible
3. Tester sur différents navigateurs
4. Vérifier la responsivité

## 📄 Licence

Ce projet fait partie de l'application ATS et suit la même licence.
