// Fichier utils/middleware.js
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

function applyMiddlewares(app) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  // Configuration CORS plus permissive
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://ats-app-production.up.railway.app',
      'https://*.railway.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
}

// Middleware de vérification du token JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

module.exports = applyMiddlewares;
module.exports.verifyToken = verifyToken;
