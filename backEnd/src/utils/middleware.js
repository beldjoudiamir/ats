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
  
  // Configuration CORS très permissive pour le développement et Railway
  app.use(cors({
    origin: function (origin, callback) {
      // Permettre les requêtes sans origin (comme les requêtes de serveur à serveur)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5000',
        'https://ats-app-production.up.railway.app',
        'https://*.railway.app',
        'https://*.vercel.app',
        'https://*.netlify.app'
      ];
      
      // Vérifier si l'origine est autorisée
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          return origin.includes(allowedOrigin.replace('*.', ''));
        }
        return origin === allowedOrigin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('🚫 CORS blocked origin:', origin);
        callback(null, true); // Temporairement autoriser toutes les origines
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));

  // Middleware pour gérer les requêtes OPTIONS
  app.options('*', cors());
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
