import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import Loader from "../../components/Loader";

// URL de l'API utilisateurs
const API_URL = `${API_BASE_URL}/api/users`;

// Fonction utilitaire pour récupérer le header d'authentification JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Composant principal de gestion des utilisateurs
const TableComponent = () => {
  // State pour la liste des utilisateurs
  const [users, setUsers] = useState([]);
  // State pour l'affichage du loader
  const [loading, setLoading] = useState(true);
  // State pour les messages d'erreur
  const [error, setError] = useState("");
  // State pour afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false);
  // State pour l'utilisateur en cours d'édition
  const [editUser, setEditUser] = useState(null);
  // State pour les champs du formulaire
  const [form, setForm] = useState({ name: "", mail: "", password: "", role: "user" });

  // Vérification du rôle admin (à adapter selon ton système d'authentification)
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const userRole = localStorage.getItem("userRole");

  // Fonction pour récupérer la liste des utilisateurs depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  // Gestion des changements dans le formulaire (champ par champ)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Préparation du formulaire pour la modification d'un utilisateur
  const handleEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, mail: user.mail, password: "", role: user.role });
    setShowForm(true);
  };

  // Suppression d'un utilisateur (sauf admin)
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${API_URL}/delete/${id}`, { headers: getAuthHeaders() });
      fetchUsers(); // Rafraîchit la liste après suppression
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // Soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Modification d'un utilisateur existant
        const updatePayload = {
          name: form.name,
          mail: form.mail,
        };
        if (form.password) updatePayload.password = form.password; // On ne modifie le mot de passe que s'il est renseigné
        await axios.put(`${API_URL}/update/${editUser._id}`, updatePayload, { headers: getAuthHeaders() });
      } else {
        // Ajout d'un nouvel utilisateur (rôle toujours "user" côté front)
        await axios.post(`${API_URL}/add`, {
          name: form.name,
          mail: form.mail,
          password: form.password,
          role: 'user' // Sécurité côté front, mais à vérifier aussi côté back
        }, { headers: getAuthHeaders() });
      }
      setShowForm(false);
      setEditUser(null);
      setForm({ name: "", mail: "", password: "", role: "user" });
      fetchUsers(); // Rafraîchit la liste après ajout/modif
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  // Rendu du composant
  return (
    <div className="flex-1 p-2 sm:p-4 mx-1 sm:mx-2 bg-white rounded-md dark:bg-gray-800 dark:text-gray-400">
      {/* En-tête et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-base sm:text-lg font-bold">
          Gestion des utilisateurs 
          {userRole && <span className="text-sm text-gray-500 ml-2">({userRole})</span>}
        </h2>
        {/* Bouton d'ajout seulement pour les admins */}
        {isAdmin && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
            onClick={() => { setShowForm(true); setEditUser(null); setForm({ name: "", mail: "", password: "", role: "user" }); }}
          >
            Ajouter un utilisateur
          </button>
        )}
      </div>
      
      {/* Message informatif pour les utilisateurs normaux */}
      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Accès limité
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Pour avoir accès aux fonctionnalités d'administration (ajouter, modifier, supprimer des utilisateurs), 
                  vous devez contacter votre responsable.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Affichage des erreurs */}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {/* Loader */}
      {loading ? (
        <Loader size="large" color="pink" />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[600px] w-full text-xs sm:text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs sm:text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-2 sm:px-6 py-3">Nom / Prénom</th>
                <th className="px-2 sm:px-6 py-3">E-mail</th>
                <th className="px-2 sm:px-6 py-3">Rôle</th>
                <th className="px-2 sm:px-6 py-3 hidden sm:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
              {/* Affichage de chaque utilisateur */}
              {users.map((user) => (
                <tr key={user._id} className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-2 sm:px-6 py-4 text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-2 sm:px-6 py-4">{user.mail}</td>
                  <td className="px-2 sm:px-6 py-4">
                    <span className={`px-2 py-1 text-xs sm:text-sm rounded-full ${user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{user.role}</span>
                </td>
                  <td className="px-2 sm:px-6 py-4 space-x-2 hidden sm:table-cell">
                    {/* Actions selon le rôle de l'utilisateur connecté */}
                    {user.role === "admin" ? (
                      <>
                        <button
                          className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed w-full sm:w-auto"
                          disabled
                          title="Impossible de modifier l'admin"
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed w-full sm:w-auto"
                          disabled
                          title="Impossible de supprimer l'admin"
                        >
                          Supprimer
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={isAdmin ? "bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto" : "bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed w-full sm:w-auto"}
                          onClick={isAdmin ? () => handleEdit(user) : undefined}
                          disabled={!isAdmin}
                          title={isAdmin ? "Modifier l'utilisateur" : "Accès réservé aux administrateurs"}
                        >
                          Modifier
                        </button>
                        <button
                          className={isAdmin ? "bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded w-full sm:w-auto" : "bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed w-full sm:w-auto"}
                          onClick={isAdmin ? () => handleDelete(user._id) : undefined}
                          disabled={!isAdmin}
                          title={isAdmin ? "Supprimer l'utilisateur" : "Accès réservé aux administrateurs"}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      {/* Formulaire d'ajout/modification d'utilisateur */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-2 sm:p-4">
          <div className="bg-white p-2 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md relative">
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">
              ×
            </button>
            <h3 className="text-base sm:text-lg font-bold mb-4">{editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block mb-1 text-xs sm:text-sm">Nom / Prénom</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2 text-xs sm:text-sm" required />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm">E-mail</label>
                <input type="email" name="mail" value={form.mail} onChange={handleChange} className="w-full border rounded p-2 text-xs sm:text-sm" required />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm">Mot de passe {editUser && <span className="text-xs text-gray-400">(laisser vide pour ne pas changer)</span>}</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border rounded p-2 text-xs sm:text-sm" autoComplete="new-password" />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm">Rôle</label>
                {/* Champ rôle en lecture seule, toujours "Utilisateur" côté front */}
                <input type="text" value="Utilisateur" className="w-full border rounded p-2 bg-gray-100 text-xs sm:text-sm" disabled readOnly />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">{editUser ? "Enregistrer" : "Ajouter"}</button>
            </form>
          </div>
      </div>
      )}
    </div>
  );
};

export default TableComponent;