# Guide de Contribution - ATS

Merci de votre intérêt pour contribuer au projet ATS ! Ce document vous guidera à travers le processus de contribution.

## 🤝 Comment Contribuer

### 1. Fork et Clone

1. **Fork** le repository sur GitHub
2. **Clone** votre fork localement :
```bash
git clone https://github.com/votre-username/ats-finished-avec-option.git
cd ats-finished-avec-option
```

### 2. Configuration de l'Environnement

#### Backend
```bash
cd backEnd
npm install
cp env.example .env
# Configurer les variables d'environnement
```

#### Frontend
```bash
cd frontEnd
npm install
```

### 3. Créer une Branche

Créez une branche pour votre fonctionnalité :
```bash
git checkout -b feature/nom-de-votre-fonctionnalite
```

**Conventions de nommage des branches :**
- `feature/nom-fonctionnalite` - Nouvelles fonctionnalités
- `fix/nom-bug` - Corrections de bugs
- `docs/nom-documentation` - Amélioration de la documentation
- `refactor/nom-refactorisation` - Refactorisation du code

### 4. Développement

#### Standards de Code

**JavaScript/Node.js (Backend)**
- Utiliser ES6+ syntax
- Indentation : 2 espaces
- Semicolons obligatoires
- Noms de variables/fonctions en camelCase
- Noms de classes en PascalCase

**React (Frontend)**
- Composants en PascalCase
- Props en camelCase
- Hooks personnalisés avec préfixe `use`
- JSX avec indentation cohérente

#### Structure des Fichiers

**Backend**
```
src/
├── controllers/     # Logique métier
├── routes/         # Définition des routes
├── middleware/     # Middleware personnalisé
├── utils/          # Fonctions utilitaires
└── config/         # Configuration
```

**Frontend**
```
src/
├── components/     # Composants réutilisables
├── hooks/          # Hooks personnalisés
├── utils/          # Fonctions utilitaires
└── Dashboard/      # Composants spécifiques
```

### 5. Tests

Avant de soumettre votre contribution :

#### Backend
```bash
cd backEnd
npm test
```

#### Frontend
```bash
cd frontEnd
npm test
npm run lint
```

### 6. Commit

Suivez les conventions de commit :
```bash
git commit -m "type(scope): description courte

Description détaillée si nécessaire

Closes #123"
```

**Types de commit :**
- `feat` - Nouvelle fonctionnalité
- `fix` - Correction de bug
- `docs` - Documentation
- `style` - Formatage, point-virgules manquants, etc.
- `refactor` - Refactorisation
- `test` - Ajout de tests
- `chore` - Tâches de maintenance

### 7. Push et Pull Request

```bash
git push origin feature/nom-de-votre-fonctionnalite
```

Puis créez une **Pull Request** sur GitHub avec :
- Description claire de la fonctionnalité
- Tests effectués
- Screenshots si applicable
- Référence aux issues concernées

## 📋 Checklist de Contribution

### Avant de Soumettre

- [ ] Code conforme aux standards
- [ ] Tests passent
- [ ] Documentation mise à jour
- [ ] Pas de logs de débogage
- [ ] Variables d'environnement sécurisées
- [ ] Pas de données sensibles exposées

### Code Review

- [ ] Code lisible et bien commenté
- [ ] Fonctionnalité testée
- [ ] Pas de régression introduite
- [ ] Performance acceptable
- [ ] Sécurité respectée

## 🐛 Signaler un Bug

### Template de Bug Report

```markdown
**Description du bug**
Description claire et concise du problème.

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Description de ce qui devrait se passer.

**Screenshots**
Si applicable, ajoutez des captures d'écran.

**Environnement**
- OS: [ex: Windows 10]
- Navigateur: [ex: Chrome 91]
- Version: [ex: 1.0.0]

**Informations supplémentaires**
Contexte supplémentaire sur le problème.
```

## 💡 Proposer une Fonctionnalité

### Template de Feature Request

```markdown
**Problème résolu**
Description claire du problème que cette fonctionnalité résout.

**Solution proposée**
Description de la solution souhaitée.

**Alternatives considérées**
Autres solutions envisagées.

**Contexte supplémentaire**
Informations supplémentaires, screenshots, etc.
```

## 📚 Documentation

### Mise à Jour de la Documentation

- Maintenir la cohérence avec le code
- Inclure des exemples d'utilisation
- Mettre à jour les README.md
- Documenter les nouvelles API

### Standards de Documentation

- Utiliser le Markdown
- Inclure des exemples de code
- Maintenir une structure logique
- Vérifier les liens

## 🔒 Sécurité

### Signaler une Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité :

1. **NE PAS** créer d'issue publique
2. Envoyer un email à l'équipe de sécurité
3. Attendre la confirmation avant de divulguer

### Bonnes Pratiques

- Ne jamais commiter de secrets
- Valider toutes les entrées utilisateur
- Utiliser des requêtes préparées
- Implémenter l'authentification appropriée

## 🎯 Zones de Contribution

### Priorités Actuelles

1. **Tests** - Améliorer la couverture de tests
2. **Documentation** - Compléter la documentation API
3. **Performance** - Optimiser les requêtes
4. **UI/UX** - Améliorer l'interface utilisateur
5. **Sécurité** - Audit de sécurité

### Projets Ouverts

- [ ] Tests unitaires complets
- [ ] Documentation API interactive
- [ ] Optimisation des performances
- [ ] Amélioration de l'accessibilité

## 📞 Support

### Questions et Discussions

- Utiliser les **Discussions** GitHub pour les questions générales
- Créer une **Issue** pour les bugs et fonctionnalités
- Contacter l'équipe pour les questions privées

### Ressources

- [Documentation API](README.md#api-endpoints)
- [Guide d'installation](README.md#installation)
- [Architecture du projet](README.md#structure)

## 🙏 Remerciements

Merci à tous les contributeurs qui participent à l'amélioration d'ATS !

---

**Note** : Ce guide évolue avec le projet. N'hésitez pas à proposer des améliorations ! 