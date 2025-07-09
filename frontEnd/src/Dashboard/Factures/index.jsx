import { useState, useEffect } from "react";
import Dashboard from "../mainDashboard.jsx";
import AddFacture from "./AddFacture";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ConfirmModal from "./ConfirmModal";
import FactureTable from "./FactureTable";
import { getAllFactures, apiDeleteFacture } from "../api/apiService";
import jsPDF from "jspdf";
import SearchForm from "../NosDevis/searchFormDevis.jsx";
import Loader from "../../components/Loader";
import { generateFacturePDF } from "./utils/pdfUtils";

export default function Factures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFacture, setShowAddFacture] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState(null);
  const [showEditFacture, setShowEditFacture] = useState(false);
  const [factureToEdit, setFactureToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFactures = async () => {
    setLoading(true);
    try {
      const response = await getAllFactures();
      setFactures(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const handleDelete = (id) => {
    setFactureToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!factureToDelete) return;
    try {
      await apiDeleteFacture(factureToDelete);
      setFactures((prev) => prev.filter((item) => item._id !== factureToDelete));
      fetchFactures();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    } finally {
      setShowDeleteModal(false);
      setFactureToDelete(null);
    }
  };

  // Callback appelé après ajout d'une facture
  const handleFactureAdded = () => {
    closeAllModals();
    fetchFactures();
  };

  // Fonction pour ouvrir la modale d'édition
  const handleEdit = (facture) => {
    setFactureToEdit(facture);
    setShowEditFacture(true);
  };

  // Callback après édition
  const handleFactureEdited = () => {
    closeAllModals();
    fetchFactures();
  };

  // Filtrage des factures selon le terme de recherche
  const filteredFactures = factures.filter(item =>
    (item?.factureID || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.client?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.client?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour générer un PDF structuré pour une facture
  const handleDownload = async (facture) => {
    console.log("🚀 Début de la génération PDF pour la facture:", facture);
    try {
      await generateFacturePDF(facture);
      console.log("✅ PDF généré avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la génération du PDF:", error);
    }
  };

  // Fonction centralisée pour fermer toutes les modales
  const closeAllModals = () => {
    setShowAddFacture(false);
    setShowEditFacture(false);
    setShowDeleteModal(false);
    setFactureToEdit(null);
    setFactureToDelete(null);
  };

  if (loading) {
    return <Loader size="large" color="blue" />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        <div className="mb-6">
          <SearchForm onSearch={setSearchTerm} onAddDevis={() => setShowAddFacture(true)} labelBtn="Ajouter une Facture" />
        </div>
        {showAddFacture && (
          <AddFacture
            onClose={closeAllModals}
            onFactureAdded={handleFactureAdded}
          />
        )}
        {showEditFacture && factureToEdit && (
          <AddFacture
            mode="edit"
            initialData={factureToEdit}
            onClose={closeAllModals}
            onFactureEdited={handleFactureEdited}
          />
        )}
        <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
          {loading ? (
            <p className="text-sm text-gray-600">Chargement des factures...</p>
          ) : filteredFactures.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune facture trouvée.</p>
          ) : (
            <FactureTable
              factures={filteredFactures}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          )}
        </div>
        {showDeleteModal && (
          <ConfirmModal
            show={showDeleteModal}
            onCancel={closeAllModals}
            onConfirm={handleConfirmDelete}
            message={"Voulez-vous vraiment supprimer cette facture ?"}
          />
        )}
      </div>
    </Dashboard>
  );
} 