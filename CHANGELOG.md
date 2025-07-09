# Changelog - ATS

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Added
- Documentation complète du projet
- Guide de contribution
- Fichier de licence MIT
- Structure de projet optimisée pour GitHub

### Changed
- Amélioration du README principal
- Documentation détaillée des API
- Organisation des fichiers pour une meilleure lisibilité

## [1.0.0] - 2024-01-XX

### Added
- **Frontend React** avec Vite
  - Dashboard interactif avec graphiques D3.js
  - Gestion des clients et transporteurs
  - Système de devis et facturation
  - Messagerie intégrée
  - Interface responsive avec Tailwind CSS
  - Génération de PDF pour devis et factures
  - Auto-refresh des données
  - Recherche avancée dans les tableaux

- **Backend Node.js** avec Express
  - API RESTful complète
  - Authentification JWT sécurisée
  - Gestion des fichiers (upload d'images)
  - Envoi d'emails avec Nodemailer
  - Base de données MongoDB
  - Certificats SSL auto-signés
  - Middleware de sécurité (CORS, validation)
  - Gestion des erreurs centralisée

### Technologies
- **Frontend**: React 19, Vite, Tailwind CSS, D3.js, React Router DOM, Axios, jsPDF
- **Backend**: Node.js, Express.js, MongoDB, JWT, Multer, Nodemailer, bcrypt

### Features
- Authentification utilisateur
- CRUD complet pour clients, transporteurs, devis, factures
- Upload et gestion de fichiers
- Système de messagerie
- Graphiques et statistiques
- Génération de documents PDF
- Interface responsive et moderne

## [0.9.0] - 2024-01-XX

### Added
- Structure de base du projet
- Configuration initiale React + Node.js
- Premiers composants du dashboard
- API de base pour l'authentification

### Changed
- Mise en place de l'architecture frontend/backend
- Configuration des outils de développement

## [0.8.0] - 2024-01-XX

### Added
- Configuration MongoDB
- Middleware d'authentification
- Routes de base pour l'API

### Changed
- Amélioration de la structure du backend
- Optimisation des performances

## [0.7.0] - 2024-01-XX

### Added
- Composants de base du frontend
- Configuration Tailwind CSS
- Routing avec React Router

### Changed
- Refactorisation de l'architecture frontend
- Amélioration de l'UX

## [0.6.0] - 2024-01-XX

### Added
- Système de graphiques avec D3.js
- Composants de tableau de bord
- Fonctionnalités de recherche

### Changed
- Optimisation des performances des graphiques
- Amélioration de l'interface utilisateur

## [0.5.0] - 2024-01-XX

### Added
- Gestion des devis et factures
- Système de génération PDF
- Upload de fichiers

### Changed
- Amélioration du système de fichiers
- Optimisation de la génération PDF

## [0.4.0] - 2024-01-XX

### Added
- Système de messagerie
- Gestion des transporteurs
- Auto-refresh des données

### Changed
- Amélioration de la réactivité
- Optimisation des requêtes API

## [0.3.0] - 2024-01-XX

### Added
- Gestion des clients
- Interface de tableau de bord
- Système d'authentification

### Changed
- Refactorisation de l'architecture
- Amélioration de la sécurité

## [0.2.0] - 2024-01-XX

### Added
- Configuration de base du projet
- Structure des dossiers
- Configuration des outils

### Changed
- Mise en place de l'environnement de développement

## [0.1.0] - 2024-01-XX

### Added
- Initialisation du projet
- Configuration Git
- Structure de base

---

## Types de Changements

- **Added** pour les nouvelles fonctionnalités
- **Changed** pour les changements dans les fonctionnalités existantes
- **Deprecated** pour les fonctionnalités qui seront bientôt supprimées
- **Removed** pour les fonctionnalités supprimées
- **Fixed** pour les corrections de bugs
- **Security** pour les corrections de vulnérabilités

## Notes de Version

### Version 1.0.0
- Première version stable de l'application ATS
- Fonctionnalités complètes de gestion de transport
- Interface utilisateur moderne et responsive
- API backend robuste et sécurisée

### Versions Préliminaires
- Développement progressif des fonctionnalités
- Tests et optimisations continues
- Amélioration de l'expérience utilisateur 