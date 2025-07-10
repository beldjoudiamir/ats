import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import { getCompanyInfo, updateCompanyLogo, updateCompanyInfo } from "../api/apiService";
import Loader from "../../components/Loader";

const initialState = {
  logo: "",
  stamp: "",
  name: "",
  description: "",
  industry: "",
  address: "",
  city: "",
  postal_code: "",
  country: "",
  director_name: "",
  director_role: "",
  director_experience_years: "",
  director_description: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  twitter: "",
  taxID: "",
  siret: ""
};

function MaCompagnie() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [company, setCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [stampPreview, setStampPreview] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    // Charger les infos d'entreprise existantes
    getCompanyInfo().then(res => {
      if (res.data && res.data.length > 0) {
        setCompany(res.data[0]);
        setForm(res.data[0]);
        setLogoPreview(res.data[0].logo || "");
        setStampPreview(res.data[0].stamp || "");
        setHasExistingData(true);
        setEditMode(true); // Mode édition par défaut si des données existent
      } else {
        setHasExistingData(false);
        setEditMode(false); // Mode création si aucune donnée
      }
    }).catch(err => {
      console.error("Erreur lors du chargement des informations:", err);
      setHasExistingData(false);
      setEditMode(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/png") {
      setLogoPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("logo", file);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/upload/logo`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        const logoPath = res.data.path;
        setForm((prev) => ({ ...prev, logo: logoPath }));
        if (company && company._id) {
          await updateCompanyLogo(company._id, logoPath);
          setCompany((prev) => ({ ...prev, logo: logoPath }));
        }
      } catch (err) {
        alert("Erreur lors de l'upload du logo !");
      }
    } else {
      alert("Seuls les fichiers PNG sont acceptés !");
    }
  };

  const handleStampChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/png") {
      setStampPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("stamp", file);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/upload/stamp`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        const stampPath = res.data.path;
        setForm((prev) => ({ ...prev, stamp: stampPath }));
        if (company && company._id) {
          await axios.patch(`${API_BASE_URL}/api/myCompanyInfo/stamp/${company._id}`, { stamp: stampPath });
          setCompany((prev) => ({ ...prev, stamp: stampPath }));
        }
      } catch (err) {
        alert("Erreur lors de l'upload du tampon !");
      }
    } else {
      alert("Seuls les fichiers PNG sont acceptés !");
    }
  };

  // Téléchargement du logo (fonctionne pour URL locale ou externe)
  const handleDownloadLogo = async (url) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "logo.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Impossible de télécharger ce logo (CORS ou URL invalide).");
    }
  };

  const handleDownloadStamp = async (url) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "tampon.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Impossible de télécharger ce tampon (CORS ou URL invalide).");
    }
  };

  const handleFetchLogo = async (url) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload/fetch-logo`, { url });
      setForm((prev) => ({ ...prev, logo: res.data.url }));
      setLogoPreview(`${API_BASE_URL}${res.data.url}`);
      setSuccess("Logo récupéré et stocké localement !");
      if (company && company._id) {
        await updateCompanyLogo(company._id, res.data.url);
        setCompany((prev) => ({ ...prev, logo: res.data.url }));
      }
    } catch (err) {
      alert("Impossible de récupérer ce logo (URL invalide ou non accessible).");
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer le logo ?")) return;
    console.log('handleDeleteLogo - Company ID:', company?._id);
    setForm((prev) => ({ ...prev, logo: "" }));
    setLogoPreview("");
    if (company && company._id) {
      try {
        console.log('handleDeleteLogo - Appel updateCompanyLogo avec ID:', company._id);
        const result = await updateCompanyLogo(company._id, "");
        console.log('handleDeleteLogo - Résultat:', result);
        setCompany((prev) => ({ ...prev, logo: "" }));
      } catch (err) {
        console.error('handleDeleteLogo - Erreur:', err);
        console.error('handleDeleteLogo - Response:', err.response);
        alert("Erreur lors de la suppression du logo côté serveur.");
      }
    }
  };

  const handleDeleteStamp = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer le tampon ?")) return;
    console.log('handleDeleteStamp - Company ID:', company?._id);
    setForm((prev) => ({ ...prev, stamp: "" }));
    setStampPreview("");
    if (company && company._id) {
      try {
        console.log('handleDeleteStamp - Appel PATCH avec ID:', company._id);
        const result = await axios.patch(`${API_BASE_URL}/api/myCompanyInfo/stamp/${company._id}`, { stamp: "" });
        console.log('handleDeleteStamp - Résultat:', result);
        setCompany((prev) => ({ ...prev, stamp: "" }));
      } catch (err) {
        console.error('handleDeleteStamp - Erreur:', err);
        console.error('handleDeleteStamp - Response:', err.response);
        alert("Erreur lors de la suppression du tampon côté serveur.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 handleSubmit - DÉBUT');
    console.log('🚀 handleSubmit - hasExistingData:', hasExistingData);
    console.log('🚀 handleSubmit - company:', company);
    console.log('🚀 handleSubmit - company._id:', company?._id);
    console.log('🚀 handleSubmit - form:', JSON.stringify(form, null, 2));
    
    setLoading(true);
    setSuccess("");
    setError("");
    
    try {
      if (hasExistingData && company && company._id) {
        console.log('🔧 handleSubmit - Mode MODIFICATION');
        // Supprimer _id avant d'envoyer au backend
        const formToSend = { ...form };
        delete formToSend._id;
        await updateCompanyInfo(company._id, formToSend);
        setSuccess("Informations modifiées avec succès !");
        setCompany(form);
      } else {
        console.log('🔧 handleSubmit - Mode CRÉATION');
        // Mode création - utiliser la route POST
        const response = await axios.post(`${API_BASE_URL}/api/myCompanyInfo/add`, form);
        setSuccess("Informations enregistrées avec succès !");
        setCompany(response.data);
        setHasExistingData(true);
        setEditMode(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Une fiche entreprise existe déjà. Veuillez la modifier.");
      } else {
        setError("Erreur lors de l'enregistrement. Vérifiez les champs obligatoires.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasExistingData && company) {
      // Restaurer les données originales
      setForm(company);
      setLogoPreview(company.logo || "");
      setStampPreview(company.stamp || "");
    } else {
      // Réinitialiser le formulaire
      setForm(initialState);
      setLogoPreview("");
      setStampPreview("");
    }
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return <Loader size="large" color="blue" />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Colonne logo */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-10 md:w-1/3 border-r border-gray-200">
          <div className="w-56 h-56 overflow-hidden shadow-2xl mb-6 bg-white flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-blue-300">
            <img
              src={form.logo ? (form.logo.startsWith('http') ? form.logo : `${API_BASE_URL}${form.logo}`) : "/3342137.png"}
              alt="Logo"
              className="object-contain w-full h-full drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))' }}
            />
          </div>
          {form.logo && (
            <>
              <button
                type="button"
                onClick={() => handleDownloadLogo(form.logo.startsWith('http') ? form.logo : `${API_BASE_URL}${form.logo}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 text-sm font-semibold mb-2 transition-colors duration-200"
              >
                Télécharger le logo
              </button>
              <button
                type="button"
                onClick={handleDeleteLogo}
                className="px-6 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-700 text-sm font-semibold mb-2 transition-colors duration-200 ml-2"
              >
                Supprimer le logo
              </button>
            </>
          )}
          <label className="mt-6 block text-base font-medium text-gray-700">
            <span className="block mb-2">Changer le logo (PNG)</span>
            <input
              type="file"
              accept="image/png"
              onChange={handleLogoChange}
              className="block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
            />
          </label>
          {/* Bloc tampon stylé comme le logo */}
          <div className="w-56 h-56 overflow-hidden shadow-2xl mb-6 bg-white flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-green-300 mt-6">
            <img
              src={form.stamp ? (form.stamp.startsWith('http') ? form.stamp : `${API_BASE_URL}${form.stamp}`) : "/3342137.png"}
              alt="Tampon"
              className="object-contain w-full h-full drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))' }}
            />
          </div>
          {form.stamp && (
            <>
              <button
                type="button"
                onClick={() => handleDownloadStamp(form.stamp.startsWith('http') ? form.stamp : `${API_BASE_URL}${form.stamp}`)}
                className="px-6 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 text-sm font-semibold mb-2 transition-colors duration-200"
              >
                Télécharger le tampon
              </button>
              <button
                type="button"
                onClick={handleDeleteStamp}
                className="px-6 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-700 text-sm font-semibold mb-2 transition-colors duration-200 ml-2"
              >
                Supprimer le tampon
              </button>
            </>
          )}
          <label className="mt-6 block text-base font-medium text-gray-700">
            <span className="block mb-2">Changer le tampon (PNG)</span>
            <input
              type="file"
              accept="image/png"
              onChange={handleStampChange}
              className="block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
            />
          </label>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Pour un tampon externe, télécharge-le d'abord sur ton ordinateur.
          </p>
        </div>

        {/* Colonne infos */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-500">Informations sur l'entreprise</h2>
            {hasExistingData && (
              <div className="flex gap-2">
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Modifier
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                  >
                    Annuler
                  </button>
                )}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Nom</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  required 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Secteur d'activité</label>
                <input 
                  name="industry" 
                  value={form.industry} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Adresse</label>
                <input 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Ville</label>
                <input 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Code postal</label>
                <input 
                  name="postal_code" 
                  value={form.postal_code} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Pays</label>
                <input 
                  name="country" 
                  value={form.country} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Téléphone</label>
                <input 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Site web</label>
                <input 
                  name="website" 
                  value={form.website} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Numéro de TVA</label>
                <input 
                  name="taxID" 
                  value={form.taxID} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Numéro SIRET</label>
                <input 
                  name="siret" 
                  value={form.siret || ''} 
                  onChange={handleChange} 
                  className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                  disabled={!editMode && hasExistingData}
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                required 
                placeholder="Décris ton entreprise..." 
                className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-200 ${!editMode && hasExistingData ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                disabled={!editMode && hasExistingData}
              />
            </div>
            
            {/* Bouton de soumission - affiché seulement en mode édition ou si pas de données existantes */}
            {(editMode || !hasExistingData) && (
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                  disabled={loading}
                >
                  {loading ? "Enregistrement..." : (hasExistingData ? "Modifier" : "Enregistrer")}
                </button>
              </div>
            )}
            
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default MaCompagnie;
