// Configuration MongoDB locale comme fallback
const { MongoClient } = require("mongodb");

function createLocalMongoClient() {
  // URL MongoDB locale (pour développement/test)
  const localURI = "mongodb://localhost:27017";
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
  };
  
  return new MongoClient(localURI, options);
}

module.exports = { createLocalMongoClient }; 