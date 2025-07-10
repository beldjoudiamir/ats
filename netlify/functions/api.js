const express = require("express");
const serverless = require("serverless-http");
const path = require("path");

const connectToDatabase = require("../../backEnd/src/config/bd.js");
const applyMiddlewares = require("../../backEnd/src/utils/middleware.js");
const createRoutes = require("../../backEnd/src/routes/myRoutes.js");
const clientRoutes = require("../../backEnd/src/routes/clientRoutes.js");

const app = express();

// Middleware pour les uploads (simplifié pour Netlify)
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '../../backEnd/uploads')));

// Appliquer les middlewares
applyMiddlewares(app);

async function setupRoutes() {
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

    // Route de test pour Netlify
    app.get("/", (req, res) => {
      res.json({
        message: "ATS Backend API is running on Netlify Functions!",
        status: "success",
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

  } catch (err) {
    console.error("❌ Failed to setup routes:", err.message);
  }
}

// Setup routes
setupRoutes();

// Export pour Netlify Functions
module.exports.handler = serverless(app); 