import React, { useState, useEffect } from "react";
import Dashboard from "../mainDashboard.jsx";
import axios from "axios";
import Loader from "../../components/Loader";
import { DocumentIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import API_BASE_URL from "../../config/api.js";

export default function ConditionsTransport() {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conditionToDelete, setConditionToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const [formData, setFormData] = useState({
    responsabilites: {
      transporteur: "",
      client: ""
    },
    delais: {
      chargement: "",
      dechargement: ""
    },
    tarification: {
      fraisSupplementaires: "",
      penaliteRetard: ""
    },
    assurance: {
      type: "",
      exclusions: ""
    },
    annulation: {
      delaiAnnulation: "",
      fraisAnnulation: ""
    },
    paiement: {
      modePaiement: "",
      delaiPaiement: "",
      penaliteRetard: "",
      acompte: "",
      coordonneesBancaires: {
        nomBanque: "",
        iban: "",
        bic: ""
      }
    },
    juridiction: {
      litiges: ""
    }
  });

  useEffect(() => {
    const fetchConditions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/conditionsTransport`);
        setConditions(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des conditions:", error);
        setConditions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, []);

  const handleInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...(subsection 
          ? { [subsection]: { ...prev[section][subsection], [field]: value } }
          : { [field]: value }
        )
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCondition) {
        await axios.put(`${API_BASE_URL}/api/conditionsTransport/update/${editingCondition._id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/conditionsTransport/add`, formData);
      }
      setShowModal(false);
      setEditingCondition(null);
      resetForm();
      fetchConditions();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde des conditions de transport");
    }
  };

  const handleEdit = (condition) => {
    setEditingCondition(condition);
    setFormData(condition);
    setShowModal(true);
  };

  const handleDelete = (condition) => {
    setConditionToDelete(condition);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (condition) => {
    setSelectedCondition(condition);
    setShowDetailModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/conditionsTransport/delete/${conditionToDelete._id}`);
      fetchConditions();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setShowDeleteModal(false);
      setConditionToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      responsabilites: { transporteur: "", client: "" },
      delais: { chargement: "", dechargement: "" },
      tarification: { fraisSupplementaires: "", penaliteRetard: "" },
      assurance: { type: "", exclusions: "" },
      annulation: { delaiAnnulation: "", fraisAnnulation: "" },
      paiement: {
        modePaiement: "", delaiPaiement: "", penaliteRetard: "", acompte: "",
        coordonneesBancaires: { nomBanque: "", iban: "", bic: "" }
      },
      juridiction: { litiges: "" }
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingCondition(null);
    setShowModal(true);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "Non défini";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <DocumentIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Conditions de Transport</h1>
          </div>
          {conditions.length === 0 && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Ajouter des conditions
            </button>
          )}
        </div>

        {/* Liste des conditions - Tableau compact */}
        <div className="bg-white rounded-lg shadow">
          {conditions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <DocumentIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune condition de transport définie</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Responsabilités
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Délais
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Tarification
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conditions.map((condition, index) => (
                    <tr key={condition._id || index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <div className="max-w-full">
                          <div className="font-medium mb-1">Transporteur:</div>
                          <div className="text-gray-600 mb-2">
                            {truncateText(condition.responsabilites?.transporteur, 40)}
                          </div>
                          <div className="font-medium mb-1">Client:</div>
                          <div className="text-gray-600">
                            {truncateText(condition.responsabilites?.client, 40)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <div className="max-w-full">
                          <div className="font-medium mb-1">Chargement:</div>
                          <div className="text-gray-600 mb-2">
                            {truncateText(condition.delais?.chargement, 40)}
                          </div>
                          <div className="font-medium mb-1">Déchargement:</div>
                          <div className="text-gray-600">
                            {truncateText(condition.delais?.dechargement, 40)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <div className="max-w-full">
                          <div className="font-medium mb-1">Frais supp.:</div>
                          <div className="text-gray-600 mb-2">
                            {truncateText(condition.tarification?.fraisSupplementaires, 40)}
                          </div>
                          <div className="font-medium mb-1">Pénalités:</div>
                          <div className="text-gray-600">
                            {truncateText(condition.tarification?.penaliteRetard, 40)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs font-medium">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleViewDetails(condition)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Voir les détails"
                          >
                            <EyeIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleEdit(condition)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Modifier"
                          >
                            <PencilIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(condition)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Supprimer"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de détails */}
        {showDetailModal && selectedCondition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Détails des conditions de transport</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PlusIcon className="w-6 h-6 transform rotate-45" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                {/* Responsabilités */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Responsabilités</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Transporteur:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.responsabilites?.transporteur || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Client:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.responsabilites?.client || "Non défini"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Délais */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Délais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Chargement:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.delais?.chargement || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Déchargement:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.delais?.dechargement || "Non défini"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarification */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Tarification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Frais supplémentaires:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.tarification?.fraisSupplementaires || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Pénalités de retard:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.tarification?.penaliteRetard || "Non défini"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assurance */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Assurance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Type:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.assurance?.type || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Exclusions:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.assurance?.exclusions || "Non défini"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annulation */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Annulation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Délai d'annulation:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.annulation?.delaiAnnulation || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Frais d'annulation:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.annulation?.fraisAnnulation || "Non défini"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paiement */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Paiement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Mode de paiement:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.paiement?.modePaiement || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Délai de paiement:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.paiement?.delaiPaiement || "Non défini"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Pénalités de retard:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.paiement?.penaliteRetard || "Non défini"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Acompte:</div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {selectedCondition.paiement?.acompte || "Non défini"}
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées bancaires */}
                  {selectedCondition.paiement?.coordonneesBancaires && (
                    <div className="mt-3">
                      <h4 className="text-md font-medium mb-2">Coordonnées bancaires</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Banque:</div>
                          <div className="text-gray-600">
                            {selectedCondition.paiement.coordonneesBancaires.nomBanque || "Non défini"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700 mb-1">IBAN:</div>
                          <div className="text-gray-600">
                            {selectedCondition.paiement.coordonneesBancaires.iban || "Non défini"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700 mb-1">BIC:</div>
                          <div className="text-gray-600">
                            {selectedCondition.paiement.coordonneesBancaires.bic || "Non défini"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Juridiction */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-lg font-semibold mb-2">Juridiction</h3>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Litiges:</div>
                    <div className="text-gray-600 whitespace-pre-wrap">
                      {selectedCondition.juridiction?.litiges || "Non défini"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'ajout/modification */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingCondition ? "Modifier les conditions" : "Ajouter des conditions"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Responsabilités */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Responsabilités</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responsabilité du transporteur
                      </label>
                      <textarea
                        value={formData.responsabilites.transporteur}
                        onChange={(e) => handleInputChange("responsabilites", null, "transporteur", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Décrivez les responsabilités du transporteur..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responsabilité du client
                      </label>
                      <textarea
                        value={formData.responsabilites.client}
                        onChange={(e) => handleInputChange("responsabilites", null, "client", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Décrivez les responsabilités du client..."
                      />
                    </div>
                  </div>
                </div>

                {/* Délais */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Délais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conditions de chargement
                      </label>
                      <textarea
                        value={formData.delais.chargement}
                        onChange={(e) => handleInputChange("delais", null, "chargement", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Conditions de chargement..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conditions de déchargement
                      </label>
                      <textarea
                        value={formData.delais.dechargement}
                        onChange={(e) => handleInputChange("delais", null, "dechargement", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Conditions de déchargement..."
                      />
                    </div>
                  </div>
                </div>

                {/* Tarification */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Tarification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frais supplémentaires
                      </label>
                      <textarea
                        value={formData.tarification.fraisSupplementaires}
                        onChange={(e) => handleInputChange("tarification", null, "fraisSupplementaires", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Conditions des frais supplémentaires..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pénalités de retard
                      </label>
                      <textarea
                        value={formData.tarification.penaliteRetard}
                        onChange={(e) => handleInputChange("tarification", null, "penaliteRetard", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Pénalités en cas de retard..."
                      />
                    </div>
                  </div>
                </div>

                {/* Assurance */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Assurance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type d'assurance
                      </label>
                      <textarea
                        value={formData.assurance.type}
                        onChange={(e) => handleInputChange("assurance", null, "type", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Type d'assurance inclus..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exclusions
                      </label>
                      <textarea
                        value={formData.assurance.exclusions}
                        onChange={(e) => handleInputChange("assurance", null, "exclusions", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Exclusions de l'assurance..."
                      />
                    </div>
                  </div>
                </div>

                {/* Annulation */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Annulation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Délai d'annulation
                      </label>
                      <textarea
                        value={formData.annulation.delaiAnnulation}
                        onChange={(e) => handleInputChange("annulation", null, "delaiAnnulation", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Délai minimum pour annuler..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frais d'annulation
                      </label>
                      <textarea
                        value={formData.annulation.fraisAnnulation}
                        onChange={(e) => handleInputChange("annulation", null, "fraisAnnulation", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Frais en cas d'annulation..."
                      />
                    </div>
                  </div>
                </div>

                {/* Paiement */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Paiement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode de paiement
                      </label>
                      <textarea
                        value={formData.paiement.modePaiement}
                        onChange={(e) => handleInputChange("paiement", null, "modePaiement", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Modes de paiement acceptés..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Délai de paiement
                      </label>
                      <textarea
                        value={formData.paiement.delaiPaiement}
                        onChange={(e) => handleInputChange("paiement", null, "delaiPaiement", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Délai de paiement..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pénalités de retard de paiement
                      </label>
                      <textarea
                        value={formData.paiement.penaliteRetard}
                        onChange={(e) => handleInputChange("paiement", null, "penaliteRetard", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Pénalités en cas de retard de paiement..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Acompte
                      </label>
                      <textarea
                        value={formData.paiement.acompte}
                        onChange={(e) => handleInputChange("paiement", null, "acompte", e.target.value)}
                        className="w-full border rounded-md p-2 h-20"
                        placeholder="Conditions d'acompte..."
                      />
                    </div>
                  </div>

                  {/* Coordonnées bancaires */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2">Coordonnées bancaires</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la banque
                        </label>
                        <input
                          type="text"
                          value={formData.paiement.coordonneesBancaires.nomBanque}
                          onChange={(e) => handleInputChange("paiement", "coordonneesBancaires", "nomBanque", e.target.value)}
                          className="w-full border rounded-md p-2"
                          placeholder="Nom de la banque"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IBAN
                        </label>
                        <input
                          type="text"
                          value={formData.paiement.coordonneesBancaires.iban}
                          onChange={(e) => handleInputChange("paiement", "coordonneesBancaires", "iban", e.target.value)}
                          className="w-full border rounded-md p-2"
                          placeholder="IBAN"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BIC
                        </label>
                        <input
                          type="text"
                          value={formData.paiement.coordonneesBancaires.bic}
                          onChange={(e) => handleInputChange("paiement", "coordonneesBancaires", "bic", e.target.value)}
                          className="w-full border rounded-md p-2"
                          placeholder="BIC"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Juridiction */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Juridiction</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Litiges
                    </label>
                    <textarea
                      value={formData.juridiction.litiges}
                      onChange={(e) => handleInputChange("juridiction", null, "litiges", e.target.value)}
                      className="w-full border rounded-md p-2 h-20"
                      placeholder="Tribunal compétent en cas de litige..."
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCondition ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ces conditions de transport ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
} 