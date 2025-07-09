import Dashboard from "../mainDashboard.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../Factures/ConfirmModal";
import Loader from "../../components/Loader";

export default function Messagerie() {
  const [clientMessages, setClientMessages] = useState([]);
  const [devisRequestMessages, setDevisRequestMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ show: false, type: null, id: null });
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' ou 'oldest'
  const [selectedDevisRequest, setSelectedDevisRequest] = useState(null);

  // Fonction pour charger les messages
  const fetchMessages = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/receivedMessage").then((response) => {
      let allMessages = Array.isArray(response.data) ? response.data : [];
      
      // Séparer les messages normaux des demandes de devis
      const normalMessages = [];
      const devisRequests = [];
      
      allMessages.forEach(msg => {
        // Vérifier si c'est une demande de devis (contient "DEMANDE DE DEVIS" dans le message)
        if (msg.message && msg.message.includes('DEMANDE DE DEVIS')) {
          devisRequests.push(msg);
        } else {
          normalMessages.push(msg);
        }
      });
      
      // Trier les messages par date
      normalMessages.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      devisRequests.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      setClientMessages(normalMessages);
      setDevisRequestMessages(devisRequests);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, [sortOrder]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour vérifier si un message est récent (moins de 24h)
  const isRecentMessage = (dateString) => {
    if (!dateString) return false;
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffHours = (now - messageDate) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  // Suppression message client
  const handleDeleteClient = async (id) => {
    setConfirm({ show: true, type: "client", id });
  };

  // Suppression demande de devis
  const handleDeleteDevisRequest = async (id) => {
    setConfirm({ show: true, type: "devisRequest", id });
  };

  // Confirmation suppression
  const handleConfirmDelete = async () => {
    if (!confirm.id) return;
    try {
      if (confirm.type === "client") {
        await axios.delete(`http://localhost:5000/api/receivedMessage/delete/${confirm.id}`);
        setClientMessages(msgs => msgs.filter(m => m._id !== confirm.id));
      } else if (confirm.type === "devisRequest") {
        await axios.delete(`http://localhost:5000/api/receivedMessage/delete/${confirm.id}`);
        setDevisRequestMessages(msgs => msgs.filter(m => m._id !== confirm.id));
      }
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setConfirm({ show: false, type: null, id: null });
    }
  };

  if (loading) {
    return <Loader size="large" color="teal" />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        {/* En-tête avec tri */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Messagerie</h1>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Trier par :</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Plus récents</option>
              <option value="oldest">Plus anciens</option>
            </select>
            <button 
              onClick={fetchMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Actualiser
            </button>
          </div>
        </div>

        {/* Partie 1 : Messages clients */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-700">
              Messages des clients 
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({clientMessages.length} message{clientMessages.length > 1 ? 's' : ''})
              </span>
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Nom & Prénom</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Téléphone</th>
                  <th scope="col" className="px-6 py-3">Message</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-6">Chargement...</td></tr>
                ) : clientMessages.length === 0 ? (
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4" colSpan={6}>
                      <span className="text-gray-400 italic">Aucun message client pour le moment.</span>
                    </td>
                  </tr>
                ) : (
                  clientMessages.map((msg, idx) => (
                    <tr key={msg._id || idx} className={`bg-white border-b border-gray-200 hover:bg-gray-50 ${isRecentMessage(msg.date) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {msg.name}
                        {isRecentMessage(msg.date) && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Nouveau
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${msg.email}`} className="text-blue-600 hover:text-blue-800">
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {msg.phone ? (
                          <a href={`tel:${msg.phone}`} className="text-green-600 hover:text-green-800">
                            {msg.phone}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="truncate" title={msg.message}>
                          {msg.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(msg.date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          className="px-3 py-1 text-white bg-red-600 rounded text-xs hover:bg-red-700 transition-colors" 
                          onClick={() => handleDeleteClient(msg._id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partie 2 : Demandes de devis des clients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-700">
              Demandes de devis des clients
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({devisRequestMessages.length} demande{devisRequestMessages.length > 1 ? 's' : ''})
              </span>
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Nom du client</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Téléphone</th>
                  <th scope="col" className="px-6 py-3">Type de transport</th>
                  <th scope="col" className="px-6 py-3">Itinéraire</th>
                  <th scope="col" className="px-6 py-3">Marchandise</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-6">Chargement...</td></tr>
                ) : devisRequestMessages.length === 0 ? (
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4" colSpan={8}>
                      <span className="text-gray-400 italic">Aucune demande de devis pour le moment.</span>
                    </td>
                  </tr>
                ) : (
                  devisRequestMessages.map((msg, idx) => {
                    // Extraire les informations du message de demande de devis
                    const extractInfo = (message, section) => {
                      const lines = message.split('\n');
                      const sectionIndex = lines.findIndex(line => line.includes(section));
                      if (sectionIndex === -1) return '';
                      
                      let result = '';
                      for (let i = sectionIndex + 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line === '' || line.includes('INFORMATIONS') || line.includes('SERVICES') || line.includes('ESTIMATION')) {
                          break;
                        }
                        if (line.includes(':')) {
                          result = line.split(':')[1]?.trim() || '';
                          break;
                        }
                      }
                      return result;
                    };

                    const transportType = extractInfo(msg.message, 'Type de transport');
                    const departure = extractInfo(msg.message, 'Adresse de départ');
                    const arrival = extractInfo(msg.message, 'Adresse d\'arrivée');
                    const merchandise = extractInfo(msg.message, 'Type de marchandise');
                    
                    return (
                      <tr key={msg._id || idx} className={`bg-white border-b border-gray-200 hover:bg-gray-50 ${isRecentMessage(msg.date) ? 'bg-green-50' : ''}`}>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {msg.name}
                          {isRecentMessage(msg.date) && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Nouveau
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <a href={`mailto:${msg.email}`} className="text-blue-600 hover:text-blue-800">
                            {msg.email}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {msg.phone ? (
                            <a href={`tel:${msg.phone}`} className="text-green-600 hover:text-green-800">
                              {msg.phone}
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {transportType || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-600">Départ: {departure || '-'}</div>
                            <div className="text-gray-600">Arrivée: {arrival || '-'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {merchandise || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {formatDate(msg.date)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button 
                              className="px-3 py-1 text-white bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors" 
                              onClick={() => setSelectedDevisRequest(msg)}
                              title="Voir les détails complets"
                            >
                              Voir détails
                            </button>
                            <button 
                              className="px-3 py-1 text-white bg-red-600 rounded text-xs hover:bg-red-700 transition-colors" 
                              onClick={() => handleDeleteDevisRequest(msg._id)}
                              title="Supprimer la demande"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale de détails de demande de devis */}
        {selectedDevisRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Détails de la demande de devis</h3>
                <button 
                  onClick={() => setSelectedDevisRequest(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Informations client</h4>
                    <p><strong>Nom :</strong> {selectedDevisRequest.name}</p>
                    <p><strong>Email :</strong> <a href={`mailto:${selectedDevisRequest.email}`} className="text-blue-600 hover:text-blue-800">{selectedDevisRequest.email}</a></p>
                    <p><strong>Téléphone :</strong> {selectedDevisRequest.phone ? <a href={`tel:${selectedDevisRequest.phone}`} className="text-green-600 hover:text-green-800">{selectedDevisRequest.phone}</a> : 'Non renseigné'}</p>
                    <p><strong>Date :</strong> {formatDate(selectedDevisRequest.date)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Statut</h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Nouvelle demande
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Message complet</h4>
                  <div className="bg-white p-4 rounded border text-sm whitespace-pre-wrap font-mono">
                    {selectedDevisRequest.message}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button 
                  onClick={() => setSelectedDevisRequest(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => {
                    window.open(`mailto:${selectedDevisRequest.email}?subject=Réponse à votre demande de devis&body=Bonjour ${selectedDevisRequest.name},%0D%0A%0D%0AMerci pour votre demande de devis. Nous l'étudions actuellement et vous répondrons dans les plus brefs délais.%0D%0A%0D%0ACordialement,%0D%0AL'équipe ATS Transport`);
                    setSelectedDevisRequest(null);
                  }}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Répondre par email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de confirmation */}
        <ConfirmModal
          show={confirm.show}
          onCancel={() => setConfirm({ show: false, type: null, id: null })}
          onConfirm={handleConfirmDelete}
          message={
            confirm.type === "client" ? "Voulez-vous vraiment supprimer ce message client ?" : 
            confirm.type === "devisRequest" ? "Voulez-vous vraiment supprimer cette demande de devis ?" : 
            "Confirmer la suppression ?"
          }
        />
      </div>
    </Dashboard>
  );
}
