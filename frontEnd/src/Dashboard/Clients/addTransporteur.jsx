import PropTypes from 'prop-types';
import { useState } from 'react';

const AddTransporteur = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-25 z-50 p-4 sm:p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un Transporteur</h2>
        <div className="mb-4 flex flex-col gap-2 w-full">
          <input type="text" name="nom_de_entreprise" value={formData.nom_de_entreprise} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Nom de l'entreprise" />
          <input type="text" name="representant" value={formData.representant} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Nom du représentant" />
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Numéro d'enregistrement" />
          <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Adresse (rue)" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Ville" />
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Code postal" />
          <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Pays" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Adresse email" />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Téléphone" />
          <input type="text" name="taxID" value={formData.taxID} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Numéro de TVA" />
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Annuler</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Sauvegarder</button>
        </div>
      </div>
    </div>
  );
};

AddTransporteur.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddTransporteur; 