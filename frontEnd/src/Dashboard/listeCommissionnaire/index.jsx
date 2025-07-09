import React, { useEffect, useState } from "react";
import Dashboard from "../mainDashboard.jsx";
import CommissionnaireTable from "./CommissionnaireTable.jsx";
import CommissionnaireActions from "./CommissionnaireActions.jsx";
import SearchBarCommissionnaire from "./SearchBarCommissionnaire.jsx";
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { getCommissionnaires, addCommissionnaire, updateCommissionnaire, deleteCommissionnaire } from "../api/apiService";
import Loader from "../../components/Loader";

export default function ListeCommissionnaire() {
  const [commissionnaires, setCommissionnaires] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [commissionnaireToEdit, setCommissionnaireToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commissionnaireToDelete, setCommissionnaireToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [commissionnaireDetails, setCommissionnaireDetails] = useState(null);

  const loadCommissionnaires = async () => {
    try {
      const res = await getCommissionnaires();
      setCommissionnaires(res.data);
    } catch (err) {
      console.error("Erreur chargement commissionnaires:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissionnaires();
  }, []);

  const handleUpdate = (commissionnaire) => {
    if (!commissionnaire) return alert("Commissionnaire introuvable.");
    setCommissionnaireToEdit(commissionnaire);
    setShowEditModal(true);
  };

  const handleDelete = (commissionnaire) => {
    setCommissionnaireToDelete(commissionnaire);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!commissionnaireToDelete) return;
    try {
      await deleteCommissionnaire(commissionnaireToDelete._id);
      await loadCommissionnaires();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression du commissionnaire.");
    } finally {
      setShowDeleteModal(false);
      setCommissionnaireToDelete(null);
    }
  };

  const handleDetails = (commissionnaire) => {
    setCommissionnaireDetails(commissionnaire);
    setShowDetailsModal(true);
  };

  const normalize = str => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
  const words = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filteredCommissionnaires = commissionnaires.filter(commissionnaire =>
    words.every(word =>
      normalize(commissionnaire.nom_de_entreprise_du_comisionaire).includes(word) ||
      normalize(commissionnaire.representant).includes(word) ||
      normalize(commissionnaire.siret).includes(word) ||
      normalize(commissionnaire.tva).includes(word) ||
      normalize(commissionnaire.adresse).includes(word) ||
      normalize(commissionnaire.ville).includes(word) ||
      normalize(commissionnaire.code_postal).includes(word) ||
      normalize(commissionnaire.pays).includes(word) ||
      normalize(commissionnaire.email).includes(word) ||
      normalize(commissionnaire.phone).includes(word) ||
      normalize(commissionnaire.contact).includes(word)
    )
  );

  const handleSearch = e => { e.preventDefault(); };

  if (loading) {
    return <Loader size="large" color="indigo" />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg mt-2 p-2 gap-2 sm:gap-4 w-full">
          <SearchBarCommissionnaire
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            placeholder="Recherche rapide..."
          />
          <Button
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg border border-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter un commissionnaire
          </Button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Chargement des commissionnaires...</p>
        ) : filteredCommissionnaires.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Aucun commissionnaire trouvé.</p>
        ) : (
          <CommissionnaireTable
            commissionnaires={filteredCommissionnaires}
            onEdit={handleUpdate}
            onDelete={handleDelete}
            onDetails={handleDetails}
          />
        )}
        {showAddModal && (
          <CommissionnaireFormModal
            mode="add"
            onClose={() => setShowAddModal(false)}
            onSuccess={loadCommissionnaires}
          />
        )}
        {showEditModal && commissionnaireToEdit && (
          <CommissionnaireFormModal
            mode="edit"
            initialData={commissionnaireToEdit}
            onClose={() => {
              setShowEditModal(false);
              setCommissionnaireToEdit(null);
            }}
            onSuccess={loadCommissionnaires}
          />
        )}
        {showDeleteModal && commissionnaireToDelete && (
          <DeleteConfirmModal
            commissionnaire={commissionnaireToDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setCommissionnaireToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        )}
        {showDetailsModal && commissionnaireDetails && (
          <DetailsModal
            commissionnaire={commissionnaireDetails}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </Dashboard>
  );
}

function CommissionnaireFormModal({ mode, initialData, onClose, onSuccess }) {
  const isEdit = mode === 'edit';
  const [formData, setFormData] = useState(
    initialData || {
      nom_de_entreprise_du_comisionaire: '',
      siret: '',
      tva: '',
      adresse: '',
      ville: '',
      code_postal: '',
      pays: '',
      phone: '',
      email: '',
      representant: '',
      contact: '',
    }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    // Validation obligatoire pour nom_de_entreprise_du_comisionaire
    if (!formData.nom_de_entreprise_du_comisionaire || !formData.nom_de_entreprise_du_comisionaire.toString().trim()) {
      newErrors.nom_de_entreprise_du_comisionaire = "Le nom de l'entreprise du commissionnaire est obligatoire";
    }
    // Validation optionnelle pour les autres champs
    Object.keys(formData).forEach((key) => {
      if (key !== 'nom_de_entreprise_du_comisionaire' && (!formData[key] || !formData[key].toString().trim())) {
        // Les autres champs ne sont pas bloquants
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isEdit) {
        const { _id, ...dataToSend } = formData;
        await updateCommissionnaire(initialData._id, dataToSend);
      } else {
        await addCommissionnaire(formData);
      }
      if (onSuccess) await onSuccess();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du commissionnaire :', err);
      alert("Erreur lors de l'enregistrement du commissionnaire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onClose={null}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEdit ? 'Modifier le Commissionnaire' : 'Ajouter un Commissionnaire'}
      </h2>
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
        {[
          { name: 'nom_de_entreprise_du_comisionaire', placeholder: "Nom de l'entreprise du commissionnaire", type: 'text' },
          { name: 'representant', placeholder: "Nom du représentant de l'entreprise", type: 'text' },
          { name: 'siret', placeholder: "Numéro de SIRET", type: 'text' },
          { name: 'tva', placeholder: "Numéro de TVA", type: 'text' },
          { name: 'adresse', placeholder: "Adresse", type: 'text' },
          { name: 'ville', placeholder: "Ville", type: 'text' },
          { name: 'code_postal', placeholder: "Code postal", type: 'text' },
          { name: 'pays', placeholder: "Pays", type: 'text' },
          { name: 'phone', placeholder: "Téléphone", type: 'tel' },
          { name: 'email', placeholder: "Adresse email", type: 'email' },
        ].map((field) => (
          <div key={field.name} className="w-full">
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} ${field.name === 'nom_de_entreprise_du_comisionaire' && errors.nom_de_entreprise_du_comisionaire ? 'bg-red-50' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 mt-4">
        <Button
          onClick={onClose}
          disabled={loading}
          className="bg-gray-400 text-white hover:bg-gray-500"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </Modal>
  );
}

function DeleteConfirmModal({ commissionnaire, onCancel, onConfirm }) {
  return (
    <Modal show={true} onClose={null}>
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirmer la suppression</h2>
        <p className="mb-4 text-gray-600 text-center">
          Voulez-vous vraiment supprimer le commissionnaire <span className="font-bold">{commissionnaire.nom_de_entreprise_du_comisionaire}</span> ?
        </p>
        <div className="flex gap-4 mt-2">
          <Button
            onClick={onCancel}
            className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 rounded"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function DetailsModal({ commissionnaire, onClose }) {
  // Mapping des labels en français
  const labels = {
    nom_de_entreprise_du_comisionaire: "Nom d'entreprise",
    representant: "Représentant",
    siret: "Numéro SIRET",
    tva: "Numéro TVA",
    adresse: "Adresse",
    ville: "Ville",
    code_postal: "Code postal",
    pays: "Pays",
    email: "Email",
    phone: "Téléphone",
    contact: "Contact"
  };
  // Ordre d'affichage
  const order = [
    "nom_de_entreprise_du_comisionaire",
    "representant",
    "siret",
    "tva",
    "adresse",
    "ville",
    "code_postal",
    "pays",
    "email",
    "phone",
    "contact"
  ];
  return (
    <Modal show={true} onClose={null}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails du commissionnaire</h2>
      <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2">
        {order.map((key) => (
          key in commissionnaire && (
            <div key={key} className="flex justify-between border-b py-1">
              <span className="font-semibold text-gray-700">{labels[key]}</span>
              <span className="text-gray-900">{commissionnaire[key]}</span>
            </div>
          )
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={onClose} className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 rounded">Fermer</button>
      </div>
    </Modal>
  );
}
