# Guide de Développement Frontend - ATS

## 🏗️ Architecture Frontend

L'application frontend est construite avec **React 19** et **Vite** pour des performances optimales.

## 📁 Structure des Composants

```
src/
├── Dashboard/              # Interface principale après connexion
│   ├── Clients/           # Gestion des clients
│   ├── Factures/          # Gestion des factures
│   ├── NosDevis/          # Gestion des devis
│   ├── Transport/         # Gestion des transports
│   ├── Messagerie/        # Système de messagerie
│   ├── Utilisateurs/      # Gestion des utilisateurs
│   ├── notreEntreprise/   # Informations de l'entreprise
│   ├── TableauDeBord/     # Graphiques et statistiques
│   └── components/        # Composants partagés du dashboard
├── components/            # Composants réutilisables globaux
├── hooks/                 # Hooks personnalisés
├── utils/                 # Utilitaires et helpers
└── assets/                # Ressources statiques
```

## 🎨 Technologies et Bibliothèques

### Core
- **React 19** - Framework principal
- **Vite** - Build tool et dev server
- **React Router** - Navigation et routing

### Styling
- **Tailwind CSS** - Framework CSS utilitaire
- **Heroicons** - Icônes SVG

### Data & API
- **Axios** - Client HTTP pour les requêtes API
- **React Query** (optionnel) - Gestion du cache et des états

### Utilitaires
- **D3.js** - Graphiques et visualisations
- **jsPDF** - Génération de PDF
- **Date-fns** - Manipulation des dates

## 🚀 Bonnes Pratiques

### 1. Structure des Composants

```jsx
// Exemple de structure de composant
import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

const MonComposant = ({ prop1, prop2 }) => {
  // 1. États locaux
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Effets
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Fonctions
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Rendu conditionnel
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!data) return <div>Aucune donnée</div>;

  // 5. Rendu principal
  return (
    <div className="container mx-auto p-4">
      {/* Contenu du composant */}
    </div>
  );
};

export default MonComposant;
```

### 2. Gestion des États

```jsx
// Utiliser des hooks personnalisés pour la logique complexe
import { useState, useEffect } from 'react';

export const useApiData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};
```

### 3. Gestion des Erreurs

```jsx
// Composant d'erreur réutilisable
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Une erreur est survenue
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return children;
};
```

### 4. Styling avec Tailwind

```jsx
// Classes Tailwind organisées
const buttonClasses = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded",
  danger: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
};

const Button = ({ variant = 'primary', children, ...props }) => (
  <button className={buttonClasses[variant]} {...props}>
    {children}
  </button>
);
```

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` dans le dossier `frontEnd/` :

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=ATS Application
```

### Configuration Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

## 📊 Composants de Graphiques

### Utilisation de D3.js
```jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Nettoyer le SVG

    // Configuration du graphique
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Création du graphique
    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));
  }, [data]);

  return <svg ref={svgRef} width="400" height="400" />;
};
```

## 🔐 Authentification

### Gestion du Token
```jsx
// hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier la validité du token
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

## 📱 Responsive Design

### Breakpoints Tailwind
```jsx
// Utilisation des breakpoints
<div className="
  w-full 
  md:w-1/2 
  lg:w-1/3 
  xl:w-1/4
  p-4
">
  {/* Contenu */}
</div>
```

### Composants Responsive
```jsx
const ResponsiveTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      {/* Table content */}
    </table>
  </div>
);
```

## 🧪 Tests

### Structure des Tests
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── components/
    └── MonComposant.test.jsx
```

### Exemple de Test
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MonComposant from '../MonComposant';

describe('MonComposant', () => {
  test('affiche le contenu correctement', () => {
    render(<MonComposant />);
    expect(screen.getByText('Mon titre')).toBeInTheDocument();
  });

  test('gère les clics sur le bouton', () => {
    const mockOnClick = jest.fn();
    render(<MonComposant onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
```

## 🚀 Déploiement

### Build de Production
```bash
yarn build
```

### Optimisations
- Code splitting automatique avec Vite
- Minification des assets
- Compression gzip
- Cache des assets statiques

## 📚 Ressources Utiles

- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation D3.js](https://d3js.org/) 