const express = require('express');
const { getPublicIP } = require('../config/get-ip');
const router = express.Router();

// Route pour afficher l'IP publique
router.get('/ip', async (req, res) => {
  try {
    console.log("🔍 IP Check Requested");
    
    // Informations Railway
    const railwayInfo = {
      RAILWAY_STATIC_URL: process.env.RAILWAY_STATIC_URL,
      RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN,
      RAILWAY_REPLICA_ID: process.env.RAILWAY_REPLICA_ID,
      RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV
    };
    
    // Récupérer l'IP publique
    const publicIP = await getPublicIP();
    
    const response = {
      success: true,
      publicIP: publicIP,
      mongoDBAtlasIP: publicIP + "/32",
      railwayInfo: railwayInfo,
      instructions: [
        "1. Go to MongoDB Atlas",
        "2. Click 'Network Access'",
        "3. Click 'ADD IP ADDRESS'",
        "4. Add this IP: " + publicIP + "/32",
        "5. Click 'Confirm'"
      ]
    };
    
    console.log("✅ IP Information:", response);
    res.json(response);
    
  } catch (error) {
    console.error("❌ Error getting IP:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      alternative: "Use 'Allow Access from Anywhere' (0.0.0.0/0) in MongoDB Atlas"
    });
  }
});

module.exports = router; 