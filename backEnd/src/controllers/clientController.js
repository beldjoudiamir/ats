// Contrôleur pour la gestion des clients
exports.getAllClients = async (clientsCollection, req, res) => {
  try {
    const clients = await clientsCollection.find().toArray();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des clients" });
  }
};

exports.addClient = async (clientsCollection, req, res) => {
  const { nom_de_entreprise, registrationNumber } = req.body;
  if (!nom_de_entreprise || !registrationNumber) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }
  try {
    await clientsCollection.insertOne(req.body);
    res.status(201).json({ message: "Client ajouté" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du client" });
  }
};

exports.updateClient = async (clientsCollection, req, res) => {
  const { id } = req.params;
  let updatedData = { ...req.body };
  console.log("updateClient - id:", id, "updatedData:", updatedData);

  // Ne jamais modifier _id
  if (updatedData._id) delete updatedData._id;

  // Seuls nom_de_entreprise et registrationNumber sont obligatoires
  if (!updatedData.nom_de_entreprise || !updatedData.registrationNumber) {
    return res.status(400).json({ error: "Champs nom_de_entreprise et registrationNumber obligatoires" });
  }

  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
  }

  try {
    const { ObjectId } = require("mongodb");
    console.log("Tentative update avec ObjectId:", id, "est valide ?", ObjectId.isValid(id));
    const result = await clientsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.json({ message: "Client mis à jour" });
  } catch (err) {
    console.error("Erreur updateClient:", err);
    console.error("Contenu envoyé:", updatedData);
    res.status(500).json({ error: "Erreur lors de la mise à jour du client", details: err.message, stack: err.stack });
  }
};

exports.deleteClient = async (clientsCollection, req, res) => {
  const { id } = req.params;
  console.log("deleteClient - id:", id);
  const { ObjectId } = require("mongodb");
  if (!ObjectId.isValid(id)) {
    console.error("deleteClient - id invalide:", id);
    return res.status(400).json({ error: "Format d'identifiant invalide" });
  }
  try {
    const result = await clientsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.json({ message: "Client supprimé" });
  } catch (err) {
    console.error("Erreur deleteClient:", err);
    res.status(500).json({ error: "Erreur lors de la suppression du client" });
  }
};

// Nouvelle fonction pour retourner le numéro de téléphone de l'entreprise
const getCompanyPhone = async (collection, req, res) => {
  try {
    const infos = await collection.find({}).toArray();
    if (infos.length > 0 && infos[0].phone) {
      res.json({ phone: infos[0].phone });
    } else {
      res.status(404).json({ error: 'Numéro de téléphone non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports.getCompanyPhone = getCompanyPhone; 