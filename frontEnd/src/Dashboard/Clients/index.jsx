import React, { useEffect, useState } from "react";
import Dashboard from "../mainDashboard.jsx";
import TransporteurTable from "./TransporteurTable.jsx";
import TransporteurActions from "./TransporteurActions.jsx";
import SearchBarTransporteur from "./SearchBarTransporteur.jsx";
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { getClients, addClients, updateClients, apiDeleteClients } from "../api/apiService.js";
import AddTransporteur from "./addTransporteur";
import Loader from "../../components/Loader";

export default function ListeTransporteurs() {
  const [transporteurs, setTransporteurs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [transporteurToEdit, setTransporteurToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transporteurToDelete, setTransporteurToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [transporteurDetails, setTransporteurDetails] = useState(null);

  const loadTransporteurs = async () => {
    try {
      const res = await getClients();
      setTransporteurs(res.data);
    } catch (err) {
      console.error("Erreur chargement transporteurs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransporteurs();
  }, []);

  const handleUpdate = (transporteur) => {
    if (!transporteur) return alert("Transporteur introuvable.");
    setTransporteurToEdit(transporteur);
    setShowEditModal(true);
  };

  const handleDelete = (transporteur) => {
    setTransporteurToDelete(transporteur);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!transporteurToDelete) return;
    try {
      await apiDeleteClients(transporteurToDelete._id);
      await loadTransporteurs();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression du transporteur.");
    } finally {
      setShowDeleteModal(false);
      setTransporteurToDelete(null);
    }
  };

  const normalize = str => str ? str.normalize('NFD').replace(/[^\w\s-]/g, '').toLowerCase() : '';
  const words = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filteredTransporteurs = transporteurs.filter(transporteur =>
    words.every(word =>
      normalize(transporteur.nom_de_entreprise).includes(word) ||
      normalize(transporteur.representant).includes(word) ||
      normalize(transporteur.registrationNumber).includes(word) ||
      normalize(transporteur.country).includes(word) ||
      normalize(transporteur.email).includes(word) ||
      normalize(transporteur.phone).includes(word)
    )
  );

  const handleSearch = e => { e.preventDefault(); };

  // Ajout d'un transporteur
  const handleAddTransporteur = async (formData) => {
    try {
      await addClients(formData);
      await loadTransporteurs();
    } catch (err) {
      alert("Erreur lors de l'ajout du transporteur.");
    }
  };

  // Edition d'un transporteur
  function TransporteurFormModal({ mode, initialData, onClose, onSuccess }) {
    const isEdit = mode === 'edit';
    const [formData, setFormData] = useState(
      initialData || {
        nom_de_entreprise: '',
        representant: '',
        registrationNumber: '',
        street: '',
        city: '',
        zipCode: '',
        country: '',
        email: '',
        phone: '',
        taxID: '',
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
      if (!formData.nom_de_entreprise || !formData.nom_de_entreprise.trim()) newErrors.nom_de_entreprise = "Le nom de l'entreprise est obligatoire";
      if (!formData.representant || !formData.representant.trim()) newErrors.representant = "Le nom du représentant est obligatoire";
      if (!formData.registrationNumber || !formData.registrationNumber.trim()) newErrors.registrationNumber = "Le numéro d'enregistrement est obligatoire";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
      if (!validate()) return;
      try {
        setLoading(true);
        if (isEdit) {
          const { _id, ...dataToSend } = formData;
          await updateClients(initialData._id, dataToSend);
        } else {
          await addClients(formData);
        }
        if (onSuccess) await onSuccess();
        onClose();
      } catch (err) {
        console.error('Erreur lors de la sauvegarde du transporteur :', err);
        alert("Erreur lors de l'enregistrement du transporteur.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal show={true} onClose={null}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEdit ? 'Modifier le Transporteur' : 'Ajouter un Transporteur'}
        </h2>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {[{ name: 'nom_de_entreprise', placeholder: "Nom de l'entreprise", type: 'text' },
            { name: 'representant', placeholder: "Nom du représentant", type: 'text' },
            { name: 'registrationNumber', placeholder: "Numéro d'enregistrement ou SIRET", type: 'text' },
            { name: 'street', placeholder: "Adresse (rue)", type: 'text' },
            { name: 'city', placeholder: "Ville", type: 'text' },
            { name: 'zipCode', placeholder: "Code postal", type: 'text' },
            { name: 'country', placeholder: "Pays", type: 'text' },
            { name: 'email', placeholder: "Adresse email", type: 'email' },
            { name: 'phone', placeholder: "Téléphone", type: 'tel' },
            { name: 'taxID', placeholder: "Numéro de TVA", type: 'text' },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
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

  function DeleteConfirmModal({ transporteur, onCancel, onConfirm }) {
    return (
      <Modal show={true} onClose={null}>
        <div className="p-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirmer la suppression</h2>
          <p className="mb-4 text-gray-600 text-center">
            Voulez-vous vraiment supprimer le transporteur <span className="font-bold">{transporteur.nom_de_entreprise}</span> ?
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

  const handleDetails = (transporteur) => {
    setTransporteurDetails(transporteur);
    setShowDetailsModal(true);
  };

  if (loading) {
    return <Loader size="large" color="green" />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg mt-2 p-2 gap-2 sm:gap-4 w-full">
          <SearchBarTransporteur
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            placeholder="Recherche rapide..."
          />
          <Button
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg border border-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter un transporteur
          </Button>
        </div>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {loading ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">Chargement des transporteurs...</p>
          ) : filteredTransporteurs.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">Aucun transporteur trouvé.</p>
          ) : (
            <TransporteurTable
              transporteurs={filteredTransporteurs}
              onEdit={handleUpdate}
              onDelete={handleDelete}
              onDetails={handleDetails}
            />
          )}
        </div>
        {showAddModal && (
          <AddTransporteur
            onClose={() => setShowAddModal(false)}
            onSave={handleAddTransporteur}
          />
        )}
        {showEditModal && transporteurToEdit && (
          <TransporteurFormModal
            mode="edit"
            initialData={transporteurToEdit}
            onClose={() => {
              setShowEditModal(false);
              setTransporteurToEdit(null);
            }}
            onSuccess={loadTransporteurs}
          />
        )}
        {showDeleteModal && transporteurToDelete && (
          <DeleteConfirmModal
            transporteur={transporteurToDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setTransporteurToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        )}
        {showDetailsModal && transporteurDetails && (
          <DetailsModal
            transporteur={transporteurDetails}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </Dashboard>
  );
}

function DetailsModal({ transporteur, onClose }) {
  // Mapping des labels en français
  const labels = {
    nom_de_entreprise: "Nom d'entreprise",
    representant: "Représentant",
    registrationNumber: "Numéro d'enregistrement (SIRET)",
    taxID: "Numéro de TVA",
    street: "Adresse (rue)",
    city: "Ville",
    zipCode: "Code postal",
    country: "Pays",
    email: "Email",
    phone: "Téléphone"
  };
  // Ordre d'affichage
  const order = [
    "nom_de_entreprise",
    "representant",
    "registrationNumber",
    "taxID",
    "street",
    "city",
    "zipCode",
    "country",
    "email",
    "phone"
  ];
  return (
    <Modal show={true} onClose={null}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails du transporteur</h2>
      <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2">
        {order.map((key) => (
          key in transporteur && (
            <div key={key} className="flex justify-between border-b py-1">
              <span className="font-semibold text-gray-700">{labels[key]}</span>
              <span className="text-gray-900">{transporteur[key]}</span>
            </div>
          )
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="bg-gray-400 text-white hover:bg-gray-500">Fermer</Button>
      </div>
    </Modal>
  );
}
