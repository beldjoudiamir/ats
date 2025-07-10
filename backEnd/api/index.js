const express = require("express");
const path = require("path");

const connectToDatabase = require("../src/config/bd.js");
const applyMiddlewares = require("../src/utils/middleware.js");
const createRoutes = require("../src/routes/myRoutes.js");
const clientRoutes = require("../src/routes/clientRoutes.js");

const app = express();

// Configuration pour Vercel
const PORT = process.env.PORT || 3000;

// Middleware pour les uploads (simplifié pour Vercel)
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Appliquer les middlewares
applyMiddlewares(app);

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

    app.use("/api", routes);
    app.use("/api/clients", clientRoutes(collection2));

    // Route de test pour Vercel
    app.get("/", (req, res) => {
      res.json({
        message: "ATS Backend API is running on Vercel!",
        status: "success",
        port: PORT,
        timestamp: new Date().toISOString()
      });
    });

    // Route de test API
    app.get("/api/test", (req, res) => {
      res.json({
        message: "API is working!",
        status: "success",
        database: "connected"
      });
    });

    app.use((req, res) => {
      res.status(404).json({
        error: "Route not found",
        path: req.path,
        method: req.method
      });
    });

    app.use((err, req, res, next) => {
      console.error("Global error handler:", err.stack);
      res.status(500).json({
        error: "Something went wrong",
        message: err.message
      });
    });

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 ATS Backend running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start the server:", err.message);
  }
}

// Démarrer le serveur
startServer();

// Export pour Vercel
module.exports = app; 