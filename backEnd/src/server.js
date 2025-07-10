require('dotenv').config();
const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");

const connectToDatabase = require("./config/bd.js");
const applyMiddlewares = require("./utils/middleware.js");
const createRoutes = require("./routes/myRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const ipRoute = require("./routes/ipRoute.js");

const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

const app = express();

// Middleware pour les uploads
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Sert le dossier uploads du frontend en statique
app.use('/uploads', express.static(path.resolve(__dirname, '../../frontEnd/public/uploads')));

applyMiddlewares(app);

// Charger les certificats SSL (si disponibles)
let sslOptions = null;
try {
  sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "certs/server.key")),
    cert: fs.readFileSync(path.join(__dirname, "certs/server.cert")),
  };
} catch (error) {
  console.log("⚠️ Certificats SSL non trouvés, HTTPS désactivé");
}

async function startServer() {
  try {
    const {
      collection, collection2, collection3, collection4,
      collection5, collection6, collection7, collection8, collection9,
      users
    } = await connectToDatabase();

    const routes = createRoutes(
      collection, collection2, collection3, collection4,
      collection5, collection6, collection7, collection8, collection9,
      users
    );

    // Routes API
    app.use("/api", routes);
    app.use("/api/clients", clientRoutes(collection2));
    app.use("/api", ipRoute);

    // Route de test
    app.get("/api/health", (req, res) => {
      res.json({ 
        status: "OK", 
        message: "ATS Transport API is running!",
        timestamp: new Date().toISOString()
      });
    });

    // Servir le frontend React
    const frontendPath = path.join(__dirname, '../../frontEnd/dist');
    
    // Vérifier si le frontend est buildé
    if (fs.existsSync(frontendPath)) {
      console.log("📁 Frontend build trouvé, configuration pour production...");
      
      // Servir les fichiers statiques du frontend
      app.use(express.static(frontendPath));
      
      // Route catch-all pour React Router
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    } else {
      console.log("⚠️ Frontend build non trouvé, mode développement...");
      app.get("/", (req, res) => {
        res.json(`ATS project backend server is running! Port: ${PORT}`);
      });
    }

    // Gestion d'erreur 404
    app.use((req, res) => {
      res.status(404).send("Route not found");
    });

    // Gestionnaire d'erreur global
    app.use((err, req, res, next) => {
      console.error("Global error handler:", err.stack);
      res.status(500).send("Something went wrong.");
    });

    // Lancer HTTP
    app.listen(PORT, () => {
      console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Lancer HTTPS si les certificats sont disponibles
    if (sslOptions) {
      https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
        console.log(`🔐 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
      });
    }

  } catch (err) {
    console.error("❌ Failed to start the server:", err.message);
  }
}

startServer();
