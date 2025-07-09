// Importation des hooks React et des dépendances nécessaires
import { useState, useEffect, useMemo } from "react";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

import {
  fetchAllDevisIDs,
  generateDevisID,
  calculateTotals,
} from "../utils/devisUtils";

import {
  getCompanyInfo,
  getClients,
  addEstimate,
  updateEstimate,
  getCommissionnaires,
} from "../api/apiService";

// Composant principal pour ajouter un devis
const AddDevis = ({ onClose, onDevisAdded, mode = "add", initialData = null, onDevisEdited }) => {
  // États pour gérer les données du formulaire
  const [companyInfo, setCompanyInfo] = useState([]); // Infos de l'entreprise
  const [clients, setClients] = useState([]); // Liste des clients
  const [transporteurs, setTransporteurs] = useState([]);
  const [commissionnaires, setCommissionnaires] = useState([]);
  const [selectedType, setSelectedType] = useState("transporteur");
  const [selectedClient, setSelectedClient] = useState(null); // Client sélectionné
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]); // Articles dans le devis
  const [tvaRate, setTvaRate] = useState(20); // Taux de TVA
  const [devisList, setDevisList] = useState([]); // Liste des IDs de devis
  const [generatedID, setGeneratedID] = useState(""); // ID généré automatiquement pour le nouveau devis
  const [route, setRoute] = useState({ depart: "", arrivee: "" });
  const [adresseDepart, setAdresseDepart] = useState({ adresse: "", ville: "", codePostal: "", pays: "" });
  const [adresseArrivee, setAdresseArrivee] = useState({ adresse: "", ville: "", codePostal: "", pays: "" });
  const [status, setStatus] = useState("Brouillon");
  const [message, setMessage] = useState(initialData?.message || "");

  // Pré-remplissage si mode édition
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setGeneratedID(initialData.devisID || "");
      setItems(initialData.items || [{ description: "", quantity: 1, price: 0 }]);
      setTvaRate(initialData.tvaRate || 20);
      setSelectedClient(initialData.client || null);
      setRoute(initialData.route || { depart: "", arrivee: "" });
      setAdresseDepart(initialData.adresseDepart || { adresse: "", ville: "", codePostal: "", pays: "" });
      setAdresseArrivee(initialData.adresseArrivee || { adresse: "", ville: "", codePostal: "", pays: "" });
      setStatus(initialData.status || "Brouillon");
      setMessage(initialData.message || "");
    }
  }, [mode, initialData]);

  useEffect(() => {
    const loadInitialData = async () => {
      const ids = await fetchAllDevisIDs();
      setDevisList(ids);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await getCompanyInfo();
        setCompanyInfo(res.data);
      } catch (err) {
        console.error("Erreur chargement entreprise:", err);
      }
    };
    loadCompany();
  }, [onClose]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await getClients();
        setClients(res.data);
        setTransporteurs(res.data); // TEMP : tous les clients comme transporteurs
      } catch (err) {
        setClients([]);
        setTransporteurs([]);
      }
    };
    const loadCommissionnaires = async () => {
      try {
        const res = await getCommissionnaires();
        setCommissionnaires(res.data);
      } catch (err) {
        setCommissionnaires([]);
      }
    };
    loadClients();
    loadCommissionnaires();
  }, [mode, initialData]);

  useEffect(() => {
    if (selectedClient) {
      setTvaRate(selectedClient.country?.toLowerCase() === "france" ? 20 : 0);
    }
  }, [selectedClient]);

  // Détermination du type et de l'index du partenaire sélectionné en mode édition
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      if (initialData.client) {
        setSelectedType('client');
        const idx = clients.findIndex(c => c._id === initialData.client._id);
        setSelectedClient(idx !== -1 ? clients[idx] : initialData.client);
      } else if (initialData.transporteur) {
        setSelectedType('transporteur');
        const idx = transporteurs.findIndex(c => c._id === initialData.transporteur._id);
        setSelectedClient(idx !== -1 ? transporteurs[idx] : initialData.transporteur);
      } else if (initialData.commissionnaire) {
        setSelectedType('commissionnaire');
        const idx = commissionnaires.findIndex(c => c._id === initialData.commissionnaire._id);
        setSelectedClient(idx !== -1 ? commissionnaires[idx] : initialData.commissionnaire);
      }
    }
  }, [mode, initialData, clients, transporteurs, commissionnaires]);

  // Effet pour bloquer le scroll du body quand la modale est ouverte
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const totals = useMemo(() => calculateTotals(items, tvaRate), [items, tvaRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyInfo.length || !selectedClient) {
      console.error("Informations manquantes pour créer/modifier le devis.");
      return;
    }

    try {
      if (mode === "edit" && initialData) {
        await updateEstimate(initialData._id, {
          devisID: generatedID,
          companyInfo: companyInfo[0],
          [selectedType]: selectedClient,
          items,
          totalHT: totals.totalHT,
          tvaRate,
          tva: totals.tva,
          totalTTC: totals.totalTTC,
          route,
          adresseDepart,
          adresseArrivee,
          status,
          message,
        });
        if (typeof onDevisEdited === "function") onDevisEdited();
        else if (typeof onClose === "function") onClose();
      } else {
        const ids = await fetchAllDevisIDs();
        const newID = generateDevisID(ids);
        setGeneratedID(newID);
        await addEstimate({
          devisID: newID,
          companyInfo: companyInfo[0],
          [selectedType]: selectedClient,
          items,
          totalHT: totals.totalHT,
          tvaRate,
          tva: totals.tva,
          totalTTC: totals.totalTTC,
          route,
          adresseDepart,
          adresseArrivee,
          status,
          message,
        });
        if (typeof onDevisAdded === "function") onDevisAdded();
        else if (typeof onClose === "function") onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification du devis :", error);
    }
  };

  // Bloc d'affichage des infos entreprise
  const entrepriseInfos = mode === 'edit' && initialData && initialData.companyInfo
    ? [initialData.companyInfo]
    : companyInfo;

  // Bloc d'affichage des infos partenaire (client/transporteur/commissionnaire)
  let partenaireInfos = null;
  if (mode === 'edit' && initialData) {
    if (initialData.client) partenaireInfos = initialData.client;
    if (initialData.transporteur) partenaireInfos = initialData.transporteur;
    if (initialData.commissionnaire) partenaireInfos = initialData.commissionnaire;
  } else {
    partenaireInfos = selectedClient;
  }

  // Rendu du composant avec formulaire de création de devis
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50 p-4 sm:p-6 ">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-11/12 max-w-6xl relative overflow-y-auto max-h-full">
        {/* Bouton de fermeture */}
        <button onClick={onClose} className="absolute top-4 right-4 font-semibold text-red-500 hover:text-red-600 p-2 rounded">
          Annuler
        </button>

        <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 border-1 border-gray-800">
            {/* Informations entreprise et client */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <div className="border p-4 pb-4 mb-4 text-center">
                  {entrepriseInfos.length > 0 ? (
                    entrepriseInfos.map((info, index) => (
                      <div key={index}>
                        <h1 className="text-2xl font-bold text-gray-800">{info.name}</h1>
                        <p className="text-gray-600">{info.address}</p>
                        <p className="text-gray-600">{info.postal_code} {info.city}, {info.country}</p>
                        <p className="text-gray-600">Téléphone : {info.phone}</p>
                        <p className="text-gray-600">Email : {info.email}</p>
                        {info.siret && <p className="text-gray-600">SIRET : {info.siret}</p>}
                        {info.registrationNumber && !info.siret && <p className="text-gray-600">SIRET : {info.registrationNumber}</p>}
                        {info.taxID && <p className="text-gray-600">TVA : {info.taxID}</p>}
                      </div>
                    ))
                  ) : (
                    <p>Chargement des informations de l&apos;entreprise...</p>
                  )}
                </div>
              </div>

              {/* Choix du client */}
              <div className="w-1/2">
                {mode !== "edit" ? (
                  <>
                    <div className="mb-4 flex gap-6 items-center">
                      <span className="font-semibold">Type de partenaire :</span>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="type" value="transporteur" checked={selectedType === "transporteur"} onChange={() => setSelectedType("transporteur")} /> Transporteur
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="type" value="commissionnaire" checked={selectedType === "commissionnaire"} onChange={() => setSelectedType("commissionnaire")} /> Commissionnaire
                      </label>
                    </div>
                    <div className="mb-4">
                      {selectedType === "transporteur" && (
                        <select
                          value={selectedClient ? transporteurs.findIndex((c) => c === selectedClient) : ""}
                          onChange={(e) => setSelectedClient(transporteurs[parseInt(e.target.value, 10)])}
                          className="p-2 w-full"
                        >
                          <option value="">Veuillez sélectionner</option>
                          {transporteurs.map((client, index) => (
                            <option key={index} value={index}>{client.nom_de_entreprise || client.name}</option>
                          ))}
                        </select>
                      )}
                      {selectedType === "commissionnaire" && (
                        <select
                          value={selectedClient ? commissionnaires.findIndex((c) => c === selectedClient) : ""}
                          onChange={(e) => setSelectedClient(commissionnaires[parseInt(e.target.value, 10)])}
                          className="p-2 w-full"
                        >
                          <option value="">Veuillez sélectionner</option>
                          {commissionnaires.map((client, index) => (
                            <option key={index} value={index}>{client.nom_de_entreprise_du_comisionaire || client.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </>
                ) : null}
                {partenaireInfos && (
                  <div className="mb-4 p-4 rounded bg-gray-50">
                    <p><strong>Nom d'entreprise :</strong> {partenaireInfos.nom_de_entreprise || partenaireInfos.nom_de_entreprise_du_comisionaire || partenaireInfos.name || '-'}</p>
                    {partenaireInfos.siret && <p><strong>Numéro SIRET :</strong> {partenaireInfos.siret}</p>}
                    {partenaireInfos.registrationNumber && !partenaireInfos.siret && <p><strong>Numéro SIRET :</strong> {partenaireInfos.registrationNumber}</p>}
                    {partenaireInfos.representant && <p><strong>Représentant :</strong> {partenaireInfos.representant}</p>}
                    {partenaireInfos.email && <p><strong>Email :</strong> {partenaireInfos.email}</p>}
                    {partenaireInfos.phone && <p><strong>Téléphone :</strong> {partenaireInfos.phone}</p>}
                    {partenaireInfos.street && <p><strong>Adresse :</strong> {partenaireInfos.street}</p>}
                    {partenaireInfos.city && <p><strong>Ville :</strong> {partenaireInfos.city}</p>}
                    {partenaireInfos.zipCode && <p><strong>Code postal :</strong> {partenaireInfos.zipCode}</p>}
                    {partenaireInfos.country && <p><strong>Pays :</strong> {partenaireInfos.country}</p>}
                    <p><strong>TVA :</strong> {partenaireInfos.taxID || partenaireInfos.tva || '-'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Affichage de l'ID généré */}
            <h2 className="text-xl font-semibold mt-6 mb-6">
              {mode === "edit" ? (
                <>Modifier le devis N° : <span>{generatedID}</span></>
              ) : (
                <>Devis N° : {generatedID ? <span>{generatedID}</span> : <span>Génération en cours...</span>}</>
              )}
            </h2>

            {/* Formulaire du devis */}
            <form onSubmit={handleSubmit}>
              {/* Champs Départ et Arrivée (détaillés comme sur AddFacture) */}
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Adresse complète de départ</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-1"
                    placeholder="Adresse"
                    value={adresseDepart.adresse}
                    onChange={e => setAdresseDepart(a => ({ ...a, adresse: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-1"
                    placeholder="Ville"
                    value={adresseDepart.ville}
                    onChange={e => setAdresseDepart(a => ({ ...a, ville: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-1"
                    placeholder="Code postal"
                    value={adresseDepart.codePostal}
                    onChange={e => setAdresseDepart(a => ({ ...a, codePostal: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Pays"
                    value={adresseDepart.pays}
                    onChange={e => setAdresseDepart(a => ({ ...a, pays: e.target.value }))}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Adresse complète d'arrivée</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-1"
                    placeholder="Adresse"
                    value={adresseArrivee.adresse}
                    onChange={e => setAdresseArrivee(a => ({ ...a, adresse: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-1"
                    placeholder="Ville"
                    value={adresseArrivee.ville}
                    onChange={e => setAdresseArrivee(a => ({ ...a, ville: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-1"
                    placeholder="Code postal"
                    value={adresseArrivee.codePostal}
                    onChange={e => setAdresseArrivee(a => ({ ...a, codePostal: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Pays"
                    value={adresseArrivee.pays}
                    onChange={e => setAdresseArrivee(a => ({ ...a, pays: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <table className="w-full border-collapse border mt-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Quantité</th>
                    <th className="border p-2">TVA</th>
                    <th className="border p-2">Prix (€)</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">
                        <input type="text" value={item.description} onChange={(e) => handleChange(index, "description", e.target.value)} className="border p-2 w-full rounded" required />
                      </td>
                      <td className="border p-2">
                        <input type="number" value={item.quantity} onChange={(e) => handleChange(index, "quantity", parseInt(e.target.value))} className="border p-2 w-full rounded" required />
                      </td>
                      <td className="border p-2">
                        <div className="p-2 w-full rounded">{tvaRate}%</div>
                      </td>
                      <td className="border p-2">
                        <input type="number" value={item.price} onChange={(e) => handleChange(index, "price", parseFloat(e.target.value))} className="border p-2 w-full rounded" required />
                      </td>
                      <td className="border p-2">
                        <button type="button" onClick={() => removeItem(index)} className="bg-red-500 text-white px-3 py-1 rounded">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bouton pour ajouter un article */}
              <button type="button" onClick={addItem} className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded">
                <FaPlus /> Ajouter un élément
              </button>

              {/* Champ statut */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Statut</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option>Brouillon</option>
                  <option>Envoyé</option>
                  <option>Accepté</option>
                  <option>Refusé</option>
                  <option>Expiré</option>
                  <option>Annulé</option>
                </select>
              </div>

              {/* Champ message */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Message lié au devis</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Affichage des totaux */}
              <div className="mt-4 border-t pt-4 text-right">
                <p className="text-gray-700">Total HT : <strong>{totals.totalHT.toFixed(2)} €</strong></p>
                <p className="text-gray-700">TVA : <strong>{totals.tva.toFixed(2)} €</strong></p>
                <p className="text-xl font-bold mt-2">Total TTC : <strong>{totals.totalTTC.toFixed(2)} €</strong></p>
              </div>

              {/* Bouton pour soumettre le formulaire */}
              <button type="submit" className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded w-full justify-center">
                <FaSave /> {mode === "edit" ? "Enregistrer les modifications" : "Enregistrer le devis"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDevis;
