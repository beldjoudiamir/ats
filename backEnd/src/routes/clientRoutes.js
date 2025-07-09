const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

module.exports = (clientsCollection) => {
  router.get("/", (req, res) => clientController.getAllClients(clientsCollection, req, res));
  router.post("/add", (req, res) => clientController.addClient(clientsCollection, req, res));
  router.put("/update/:id", (req, res) => clientController.updateClient(clientsCollection, req, res));
  router.delete("/delete/:id", (req, res) => clientController.deleteClient(clientsCollection, req, res));
  return router;
}; 