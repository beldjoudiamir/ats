import { useState, useEffect, useRef } from "react"; 
import Dashboard from "../mainDashboard.jsx";
import SearchForm from "./searchFormDevis.jsx";
import jsPDF from "jspdf";
import AddDevis from "./AddDevis";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

import {
  getAllEstimates,
  apiDeleteEstimate,
  getCompanyInfo
} from "../api/apiService";

import DevisTable from "./DevisTable";
import ConfirmModal from "./ConfirmModal";
import { generateDevisPDF } from "./utils/pdfUtils";
import Loader from "../../components/Loader";

export default function NosDevis() {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDevis, setShowAddDevis] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [devisToDelete, setDevisToDelete] = useState(null);
  const [showEditDevis, setShowEditDevis] = useState(false);
  const [devisToEdit, setDevisToEdit] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  const pdfRef = useRef(null);
  const [devisToPrint, setDevisToPrint] = useState(null);

  const fetchDevis = async () => {
    setLoading(true);
    try {
      const response = await getAllEstimates();
      console.log("Données reçues :", response);
      setDevis(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des devis :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await getCompanyInfo();
      console.log("🔍 Réponse getCompanyInfo:", response);
      if (response.data && response.data.length > 0) {
        console.log("🔍 Informations de l'entreprise récupérées:", response.data[0]);
        setCompanyInfo(response.data[0]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de l'entreprise:", error);
    }
  };

  useEffect(() => {
    fetchDevis();
    fetchCompanyInfo();
  }, []);

  const handleDelete = (id) => {
    setDevisToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!devisToDelete) return;
    try {
      await apiDeleteEstimate(devisToDelete);
      setDevis((prevDevis) => prevDevis.filter((item) => item._id !== devisToDelete));
      fetchDevis();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    } finally {
      setShowDeleteModal(false);
      setDevisToDelete(null);
    }
  };

  const safe = (val) =>
    typeof val === "string" || typeof val === "number"
      ? val
      : JSON.stringify(val || "N/A");

  // Callback appelé après ajout d'un devis
  const handleDevisAdded = () => {
    closeAllModals();
    fetchDevis();
  };

  // Fonction pour ouvrir la modale d'édition
  const handleEdit = (devis) => {
    setDevisToEdit(devis);
    setShowEditDevis(true);
  };

  // Callback après édition
  const handleDevisEdited = () => {
    closeAllModals();
    fetchDevis();
  };

  // Filtrage des devis selon le terme de recherche
  const filteredDevis = devis.filter(item =>
    (item?.devisID || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.client?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.client?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    // Ajoute d'autres champs si besoin
  );

  // Fonction pour générer un PDF structuré pour un devis
  const handleDownload = async (devis) => {
    console.log("🔍 handleDownload appelé avec devis:", devis);
    console.log("🔍 companyInfo disponible:", companyInfo);
    
    // Ajouter les informations de l'entreprise au devis
    const devisWithCompanyInfo = {
      ...devis,
      companyInfo: companyInfo
    };
    
    console.log("🔍 devisWithCompanyInfo:", devisWithCompanyInfo);
    
    try {
      // Utiliser la fonction generateDevisPDF du fichier pdfUtils.js (maintenant asynchrone)
      await generateDevisPDF(devisWithCompanyInfo);
    } catch (error) {
      console.error("❌ Erreur lors de la génération du PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  // Fonction centralisée pour fermer toutes les modales
  const closeAllModals = () => {
    setShowAddDevis(false);
    setShowEditDevis(false);
    setShowDeleteModal(false);
    setDevisToEdit(null);
    setDevisToDelete(null);
  };

  if (loading) {
    return <Loader size="large" color="purple" />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        <div className="mb-6">
          <SearchForm onSearch={setSearchTerm} onAddDevis={() => setShowAddDevis(true)} />
        </div>
        {showAddDevis && (
          <AddDevis
            onClose={closeAllModals}
            onDevisAdded={handleDevisAdded}
          />
        )}
        {showEditDevis && devisToEdit && (
          <AddDevis
            mode="edit"
            initialData={devisToEdit}
            onClose={closeAllModals}
            onDevisEdited={handleDevisEdited}
          />
        )}
        <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
          {loading ? (
            <p className="text-sm text-gray-600">Chargement des devis...</p>
          ) : filteredDevis.length === 0 ? (
            <p className="text-sm text-gray-600">Aucun devis trouvé.</p>
          ) : (
            <DevisTable
              devis={filteredDevis}
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
            message={"Voulez-vous vraiment supprimer ce devis ?"}
          />
        )}
      </div>
    </Dashboard>
  );
}
