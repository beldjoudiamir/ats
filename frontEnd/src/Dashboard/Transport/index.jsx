import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import Dashboard from "../mainDashboard.jsx";
import SearchForm from "./searchFormOrdre.jsx";
import AddTransportOrder from "./AddTransportOrder";
import ConfirmModal from "../Factures/ConfirmModal";
import { generateTransportOrderPDF } from "./utils/pdfUtils";
import Loader from "../../components/Loader";

export default function Transport() {
  const [showAdd, setShowAdd] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyInfo, setCompanyInfo] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/transportOrder`);
      setOrders(res.data);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    setOrderToDelete(orderId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/transportOrder/delete/${orderToDelete}`);
      fetchOrders();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setShowConfirm(false);
      setOrderToDelete(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Récupération des infos de notre entreprise
    setCompanyLoading(true);
    axios.get(`${API_BASE_URL}/api/myCompanyInfo`)
      .then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data.companyInfo) data = [data.companyInfo];
          else data = [data];
        }
        setCompanyInfo(data || []);
        console.log("companyInfo utilisé pour le PDF :", data);
        setCompanyLoading(false);
      })
      .catch(() => setCompanyLoading(false));
  }, []);

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    return (
      (order.ordreTransport && order.ordreTransport.toLowerCase().includes(term)) ||
      (order.villeDepart && order.villeDepart.toLowerCase().includes(term)) ||
      (order.codePostalDepart && order.codePostalDepart.toLowerCase().includes(term)) ||
      (order.paysDepart && order.paysDepart.toLowerCase().includes(term)) ||
      (order.dateChargementDepart && order.dateChargementDepart.toLowerCase().includes(term)) ||
      (order.heureChargementDepart && order.heureChargementDepart.toLowerCase().includes(term)) ||
      (order.villeArrivee && order.villeArrivee.toLowerCase().includes(term)) ||
      (order.codePostalArrivee && order.codePostalArrivee.toLowerCase().includes(term)) ||
      (order.paysArrivee && order.paysArrivee.toLowerCase().includes(term)) ||
      (order.dateDechargementArrivee && order.dateDechargementArrivee.toLowerCase().includes(term)) ||
      (order.heureDechargementArrivee && order.heureDechargementArrivee.toLowerCase().includes(term)) ||
      (order.typeCamion && order.typeCamion.toLowerCase().includes(term)) ||
      (order.poids && order.poids.toString().toLowerCase().includes(term)) ||
      (order.volume && order.volume.toString().toLowerCase().includes(term)) ||
      (order.nombrePalettes && order.nombrePalettes.toString().toLowerCase().includes(term)) ||
      (order.prix && order.prix.toString().toLowerCase().includes(term)) ||
      (order.status && order.status.toLowerCase().includes(term)) ||
      // Recherche sur le statut en français
      (getStatusFr(order.status).toLowerCase().includes(term)) ||
      // Recherche sur tous les champs du bloc société
      (order.societe && typeof order.societe === 'object' && (
        (order.societe.name && order.societe.name.toLowerCase().includes(term)) ||
        (order.societe.representant && order.societe.representant.toLowerCase().includes(term)) ||
        (order.societe.email && order.societe.email.toLowerCase().includes(term)) ||
        (order.societe.phone && order.societe.phone.toLowerCase().includes(term)) ||
        (order.societe.adresse && order.societe.adresse.toLowerCase().includes(term)) ||
        (order.societe.ville && order.societe.ville.toLowerCase().includes(term)) ||
        (order.societe.codePostal && order.societe.codePostal.toLowerCase().includes(term)) ||
        (order.societe.pays && order.societe.pays.toLowerCase().includes(term)) ||
        (order.societe.siret && order.societe.siret.toLowerCase().includes(term)) ||
        (order.societe.tva && order.societe.tva.toLowerCase().includes(term)) ||
        (order.societe.director_name && order.societe.director_name.toLowerCase().includes(term))
      )) ||
      // Transporteur
      (order.transporteur && typeof order.transporteur === 'object' && (
        (order.transporteur.name && order.transporteur.name.toLowerCase().includes(term)) ||
        (order.transporteur.representant && order.transporteur.representant.toLowerCase().includes(term)) ||
        (order.transporteur.email && order.transporteur.email.toLowerCase().includes(term)) ||
        (order.transporteur.phone && order.transporteur.phone.toLowerCase().includes(term)) ||
        (order.transporteur.adresse && order.transporteur.adresse.toLowerCase().includes(term)) ||
        (order.transporteur.ville && order.transporteur.ville.toLowerCase().includes(term)) ||
        (order.transporteur.codePostal && order.transporteur.codePostal.toLowerCase().includes(term)) ||
        (order.transporteur.pays && order.transporteur.pays.toLowerCase().includes(term)) ||
        (order.transporteur.siret && order.transporteur.siret.toLowerCase().includes(term)) ||
        (order.transporteur.tva && order.transporteur.tva.toLowerCase().includes(term)) ||
        (order.transporteur.siteWeb && order.transporteur.siteWeb.toLowerCase().includes(term))
      )) ||
      // Commissionnaire
      (order.commissionnaire && typeof order.commissionnaire === 'object' && (
        ((order.commissionnaire.nom_de_entreprise_du_comisionaire && order.commissionnaire.nom_de_entreprise_du_comisionaire.toLowerCase().includes(term)) ||
        (order.commissionnaire.name && order.commissionnaire.name.toLowerCase().includes(term))) ||
        (order.commissionnaire.representant && order.commissionnaire.representant.toLowerCase().includes(term)) ||
        (order.commissionnaire.email && order.commissionnaire.email.toLowerCase().includes(term)) ||
        (order.commissionnaire.phone && order.commissionnaire.phone.toLowerCase().includes(term)) ||
        (order.commissionnaire.adresse && order.commissionnaire.adresse.toLowerCase().includes(term)) ||
        (order.commissionnaire.ville && order.commissionnaire.ville.toLowerCase().includes(term)) ||
        (order.commissionnaire.codePostal && order.commissionnaire.codePostal.toLowerCase().includes(term)) ||
        (order.commissionnaire.pays && order.commissionnaire.pays.toLowerCase().includes(term)) ||
        (order.commissionnaire.siret && order.commissionnaire.siret.toLowerCase().includes(term)) ||
        (order.commissionnaire.tva && order.commissionnaire.tva.toLowerCase().includes(term)) ||
        (order.commissionnaire.siteWeb && order.commissionnaire.siteWeb.toLowerCase().includes(term))
      ))
    );
  });

  // Remplace la fonction d'appel PDF pour passer companyInfo
  const handleGenerateTransportOrderPDF = async (order) => {
    console.log("Génération PDF pour l'ordre:", order);
    try {
      await generateTransportOrderPDF(order, companyInfo[0] || {});
      console.log("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Erreur lors de la génération du PDF: " + error.message);
    }
  };

  if (loading || companyLoading) {
    return <Loader size="large" color="orange" />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        <div className="p-4 mt-4 bg-white rounded-lg dark:bg-gray-900">
          <SearchForm onSearch={setSearchTerm} onAddOrder={() => setShowAdd(true)} />
        </div>

        {showAdd && (
          <AddTransportOrder
            onClose={() => { setShowAdd(false); setOrderToEdit(null); }}
            onOrderAdded={() => {
              setShowAdd(false);
              setOrderToEdit(null);
              fetchOrders();
            }}
            editOrder={orderToEdit}
          />
        )}

        <div className="flex items-center justify-between rounded-lg dark:bg-gray-700 mt-2 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch', minHeight: 'calc(1.5em + 48px)' }}>
          <table className="w-full min-w-[900px] text-xs text-left text-gray-700 dark:text-gray-400 border-separate border-spacing-0">
            <thead className="text-[11px] uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 border-r border-gray-200 min-w-[90px] text-left align-middle font-semibold">Numéro</th>
                <th className="px-4 py-3 border-r border-gray-200 min-w-[170px] text-left align-middle font-semibold">Départ</th>
                <th className="px-4 py-3 border-r border-gray-200 min-w-[170px] text-left align-middle font-semibold">Arrivée</th>
                <th className="px-4 py-3 border-r border-gray-200 min-w-[180px] text-left align-middle font-semibold">Société</th>
                <th className="px-4 py-3 border-r border-gray-200 min-w-[100px] text-left align-middle font-semibold">Statut</th>
                <th className="px-4 py-3 min-w-[120px] text-right align-middle font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-6">Chargement...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6">Aucun ordre trouvé.</td></tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <OrderRow
                    key={order._id || idx}
                    order={order}
                    idx={idx}
                    setSelectedOrder={setSelectedOrder}
                    setOrderToEdit={setOrderToEdit}
                    setShowAdd={setShowAdd}
                    handleDelete={handleDelete}
                    generateTransportOrderPDF={handleGenerateTransportOrderPDF}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="h-4" />
        {selectedOrder && <DetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        <ConfirmModal
          show={showConfirm}
          onCancel={() => { setShowConfirm(false); setOrderToDelete(null); }}
          onConfirm={confirmDelete}
          message="Voulez-vous vraiment supprimer cet ordre de transport ?"
        />
      </div>
    </Dashboard>
  );
}

function DetailsModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">×</button>
        <h2 className="text-lg font-bold mb-2">Détails de l'ordre</h2>
        {/* Bloc société harmonisé */}
        {order.societe && (
          <div className="mb-3 p-2 rounded border border-blue-300 bg-blue-50">
            <div className="font-bold text-blue-700">Société</div>
            <div><span className="font-semibold">Nom :</span> {order.societe.name}</div>
            {order.societe.representant && <div><span className="font-semibold">Représentant :</span> {order.societe.representant}</div>}
            {order.societe.email && <div><span className="font-semibold">Email :</span> {order.societe.email}</div>}
            {order.societe.phone && <div><span className="font-semibold">Téléphone :</span> {order.societe.phone}</div>}
            {order.societe.adresse && <div><span className="font-semibold">Adresse :</span> {order.societe.adresse}</div>}
            {order.societe.ville && <div><span className="font-semibold">Ville :</span> {order.societe.ville}</div>}
            {order.societe.codePostal && <div><span className="font-semibold">Code postal :</span> {order.societe.codePostal}</div>}
            {order.societe.pays && <div><span className="font-semibold">Pays :</span> {order.societe.pays}</div>}
            {order.societe.siret && <div><span className="font-semibold">SIRET :</span> {order.societe.siret}</div>}
            {order.societe.tva && <div><span className="font-semibold">TVA :</span> {order.societe.tva}</div>}
          </div>
        )}
        {/* Affichage complet du partenaire choisi */}
        {order.transporteur && typeof order.transporteur === 'object' && order.transporteur.name && (
          <div className="mb-2 p-2 rounded border border-blue-200 bg-blue-50">
            <div className="font-bold text-blue-700 mb-1">Transporteur choisi</div>
            <div className="text-xs">
              <div><span className="font-semibold">Nom :</span> {order.transporteur.name}</div>
              {order.transporteur.representant && <div><span className="font-semibold">Représentant :</span> {order.transporteur.representant}</div>}
              {order.transporteur.email && <div><span className="font-semibold">Email :</span> {order.transporteur.email}</div>}
              {order.transporteur.phone && <div><span className="font-semibold">Téléphone :</span> {order.transporteur.phone}</div>}
              {order.transporteur.adresse && <div><span className="font-semibold">Adresse :</span> {order.transporteur.adresse}</div>}
              {(order.transporteur.codePostal || order.transporteur.ville) && <div><span className="font-semibold">Ville/CP :</span> {order.transporteur.codePostal} {order.transporteur.ville}</div>}
              {order.transporteur.pays && <div><span className="font-semibold">Pays :</span> {order.transporteur.pays}</div>}
              {order.transporteur.tva && <div><span className="font-semibold">TVA :</span> {order.transporteur.tva}</div>}
              {order.transporteur.siret && <div><span className="font-semibold">SIRET :</span> {order.transporteur.siret}</div>}
              {order.transporteur.siteWeb && <div><span className="font-semibold">Site web :</span> <a href={order.transporteur.siteWeb} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{order.transporteur.siteWeb}</a></div>}
            </div>
          </div>
        )}
        {order.commissionnaire && typeof order.commissionnaire === 'object' && (order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name) && (
          <div className="mb-2 p-2 rounded border border-green-200 bg-green-50">
            <div className="font-bold text-green-700 mb-1">Commissionnaire choisi</div>
            <div className="text-xs">
              <div><span className="font-semibold">Nom :</span> {order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name}</div>
              {order.commissionnaire.representant && <div><span className="font-semibold">Représentant :</span> {order.commissionnaire.representant}</div>}
              {order.commissionnaire.email && <div><span className="font-semibold">Email :</span> {order.commissionnaire.email}</div>}
              {order.commissionnaire.phone && <div><span className="font-semibold">Téléphone :</span> {order.commissionnaire.phone}</div>}
              {order.commissionnaire.adresse && <div><span className="font-semibold">Adresse :</span> {order.commissionnaire.adresse}</div>}
              {(order.commissionnaire.codePostal || order.commissionnaire.ville) && <div><span className="font-semibold">Ville/CP :</span> {order.commissionnaire.codePostal} {order.commissionnaire.ville}</div>}
              {order.commissionnaire.pays && <div><span className="font-semibold">Pays :</span> {order.commissionnaire.pays}</div>}
              {order.commissionnaire.tva && <div><span className="font-semibold">TVA :</span> {order.commissionnaire.tva}</div>}
              {order.commissionnaire.siret && <div><span className="font-semibold">SIRET :</span> {order.commissionnaire.siret}</div>}
              {order.commissionnaire.siteWeb && <div><span className="font-semibold">Site web :</span> <a href={order.commissionnaire.siteWeb} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{order.commissionnaire.siteWeb}</a></div>}
            </div>
          </div>
        )}
        <div className="text-sm space-y-1">
          <div><span className="font-semibold">Numéro d'ordre :</span> {order.ordreTransport}</div>
          {order.devisID && (
            <div><span className="font-semibold">Devis source :</span> {order.devisID}</div>
          )}
          {order.factureID && (
            <div><span className="font-semibold">Facture source :</span> {order.factureID}</div>
          )}
          {/* Adresses avec dates et heures bien organisées */}
          <div className="mb-3 p-3 rounded border border-blue-200 bg-blue-50">
            <div className="font-bold text-blue-700 mb-2">📍 Adresse de départ (Chargement)</div>
            <div className="text-sm space-y-1">
              <div><span className="font-semibold">Adresse :</span> {order.adresseDepart}</div>
              <div><span className="font-semibold">Ville :</span> {order.villeDepart} {order.codePostalDepart}</div>
              <div><span className="font-semibold">Pays :</span> {order.paysDepart}</div>
              {(order.dateChargementDepart || order.heureChargementDepart) && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="font-semibold text-blue-600">📅 Planning de chargement :</div>
                  {order.dateChargementDepart && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Date :</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {order.dateChargementDepart}
                      </span>
                    </div>
                  )}
                  {order.heureChargementDepart && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Heure :</span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        {order.heureChargementDepart}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3 p-3 rounded border border-green-200 bg-green-50">
            <div className="font-bold text-green-700 mb-2">🎯 Adresse d'arrivée (Déchargement)</div>
            <div className="text-sm space-y-1">
              <div><span className="font-semibold">Adresse :</span> {order.adresseArrivee}</div>
              <div><span className="font-semibold">Ville :</span> {order.villeArrivee} {order.codePostalArrivee}</div>
              <div><span className="font-semibold">Pays :</span> {order.paysArrivee}</div>
              {(order.dateDechargementArrivee || order.heureDechargementArrivee) && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <div className="font-semibold text-green-600">📅 Planning de déchargement :</div>
                  {order.dateDechargementArrivee && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Date :</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {order.dateDechargementArrivee}
                      </span>
                    </div>
                  )}
                  {order.heureDechargementArrivee && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Heure :</span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        {order.heureDechargementArrivee}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Informations de marchandise et transport */}
          <div className="mb-3 p-3 rounded border border-orange-200 bg-orange-50">
            <div className="font-bold text-orange-700 mb-2">📦 Détails de la marchandise</div>
            <div className="text-sm space-y-1">
              {order.typeMarchandise && <div><span className="font-semibold">Type :</span> {order.typeMarchandise}</div>}
              <div><span className="font-semibold">Type de camion :</span> {order.typeCamion}</div>
              <div><span className="font-semibold">Poids :</span> {order.poids}</div>
              <div><span className="font-semibold">Volume :</span> {order.volume}</div>
              <div><span className="font-semibold">Nombre de palettes :</span> {order.nombrePalettes}</div>
            </div>
          </div>

          {/* Informations financières */}
          <div className="mb-3 p-3 rounded border border-purple-200 bg-purple-50">
            <div className="font-bold text-purple-700 mb-2">💰 Informations financières</div>
            <div className="text-sm space-y-1">
              <div><span className="font-semibold">Prix :</span> <span className="text-purple-800 font-bold">{order.prix} €</span></div>
              <div><span className="font-semibold">Statut :</span> <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">{getStatusFr(order.status)}</span></div>
            </div>
          </div>
          {/* Bloc client si présent */}
          {order.client && (
            <div className="mt-3 mb-1 font-bold text-purple-700">Client</div>
          )}
          {order.client && (
            <div className="ml-2 space-y-0.5">
              <div><span className="font-semibold">Nom :</span> {order.client.name}</div>
              {order.client.representant && <div><span className="font-semibold">Représentant :</span> {order.client.representant}</div>}
              {order.client.email && <div><span className="font-semibold">Email :</span> {order.client.email}</div>}
              {order.client.phone && <div><span className="font-semibold">Téléphone :</span> {order.client.phone}</div>}
              {order.client.adresse && <div><span className="font-semibold">Adresse :</span> {order.client.adresse}</div>}
              {order.client.ville && <div><span className="font-semibold">Ville :</span> {order.client.ville}</div>}
              {order.client.codePostal && <div><span className="font-semibold">Code postal :</span> {order.client.codePostal}</div>}
              {order.client.pays && <div><span className="font-semibold">Pays :</span> {order.client.pays}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, idx, setSelectedOrder, setOrderToEdit, setShowAdd, handleDelete, generateTransportOrderPDF }) {
  return (
    <tr key={order._id || idx} className={"" + (idx % 2 === 0 ? "bg-white" : "bg-gray-50") + " border-b border-gray-200 align-middle hover:bg-blue-50 transition-colors"}>
      <td className="px-4 py-3 border-r border-gray-200 align-middle font-semibold text-blue-900">{order.ordreTransport}</td>
      <td className="px-4 py-3 border-r border-gray-200 align-middle shadow-md shadow-blue-100/40">
        <div className="mb-1 text-xs font-bold text-blue-700">Départ</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-gray-800">{order.villeDepart}</span>
          {order.codePostalDepart && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              {order.codePostalDepart}
            </span>
          )}
          {order.paysDepart && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
              {order.paysDepart}
            </span>
          )}
        </div>
        {(order.dateChargementDepart || order.heureChargementDepart) && (
          <div className="flex flex-col items-start gap-1 mt-1">
            {order.dateChargementDepart && (
              <div className="flex items-center gap-1">
                <span className="text-xs italic text-gray-400">Date :</span>
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100 shadow-sm">
                  {order.dateChargementDepart}
                </span>
              </div>
            )}
            {order.heureChargementDepart && (
              <div className="flex items-center gap-1">
                <span className="text-xs italic text-gray-400">Heure :</span>
                <span className="bg-green-50 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-100 shadow-sm">
                  {order.heureChargementDepart}
                </span>
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 border-r border-gray-200 align-middle shadow-md shadow-green-100/40">
        <div className="mb-1 text-xs font-bold text-green-700">Arrivée</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-gray-800">{order.villeArrivee}</span>
          {order.codePostalArrivee && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              {order.codePostalArrivee}
            </span>
          )}
          {order.paysArrivee && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
              {order.paysArrivee}
            </span>
          )}
        </div>
        {(order.dateDechargementArrivee || order.heureDechargementArrivee) && (
          <div className="flex flex-col items-start gap-1 mt-1">
            {order.dateDechargementArrivee && (
              <div className="flex items-center gap-1">
                <span className="text-xs italic text-gray-400">Date :</span>
                <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100 shadow-sm">
                  {order.dateDechargementArrivee}
                </span>
              </div>
            )}
            {order.heureDechargementArrivee && (
              <div className="flex items-center gap-1">
                <span className="text-xs italic text-gray-400">Heure :</span>
                <span className="bg-green-50 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-100 shadow-sm">
                  {order.heureDechargementArrivee}
                </span>
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 border-r border-gray-200 align-middle">
        {order.societe && order.societe.name ? (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-blue-700">{order.societe.name}</span>
            {order.societe.representant && (
              <span className="text-xs text-gray-500 ml-2">👤 {order.societe.representant}</span>
            )}
            {order.societe.email && (
              <span className="text-xs text-gray-500 ml-2">✉️ {order.societe.email}</span>
            )}
            {order.societe.phone && (
              <span className="text-xs text-gray-500 ml-2">📞 {order.societe.phone}</span>
            )}
            {order.societe.street && (
              <span className="text-xs text-gray-500 ml-2">🏠 {order.societe.street}</span>
            )}
            {(order.societe.zipCode || order.societe.city) && (
              <span className="text-xs text-gray-500 ml-2">📍 {order.societe.zipCode} {order.societe.city}</span>
            )}
            {order.societe.country && (
              <span className="text-xs text-gray-500 ml-2">🌍 {order.societe.country}</span>
            )}
            {order.societe.taxID && (
              <span className="text-xs text-gray-500 ml-2">🧾 TVA: {order.societe.taxID}</span>
            )}
            {order.societe.siret && (
              <span className="text-xs text-gray-500 ml-2">🏢 SIRET: {order.societe.siret}</span>
            )}
          </div>
        ) : order.transporteur && order.transporteur.name ? (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-blue-700">{order.transporteur.name}</span>
            {order.transporteur.representant && (
              <span className="text-xs text-gray-500 ml-2">👤 {order.transporteur.representant}</span>
            )}
            {order.transporteur.email && (
              <span className="text-xs text-gray-500 ml-2">✉️ {order.transporteur.email}</span>
            )}
            {order.transporteur.phone && (
              <span className="text-xs text-gray-500 ml-2">📞 {order.transporteur.phone}</span>
            )}
            {order.transporteur.adresse && (
              <span className="text-xs text-gray-500 ml-2">🏠 {order.transporteur.adresse}</span>
            )}
            {(order.transporteur.codePostal || order.transporteur.ville) && (
              <span className="text-xs text-gray-500 ml-2">📍 {order.transporteur.codePostal} {order.transporteur.ville}</span>
            )}
            {order.transporteur.pays && (
              <span className="text-xs text-gray-500 ml-2">🌍 {order.transporteur.pays}</span>
            )}
            {order.transporteur.tva && (
              <span className="text-xs text-gray-500 ml-2">🧾 TVA: {order.transporteur.tva}</span>
            )}
            {order.transporteur.siret && (
              <span className="text-xs text-gray-500 ml-2">🏢 SIRET: {order.transporteur.siret}</span>
            )}
          </div>
        ) : order.commissionnaire && (order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name) ? (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-green-700">{order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name}</span>
            {order.commissionnaire.representant && (
              <span className="text-xs text-gray-500 ml-2">👤 {order.commissionnaire.representant}</span>
            )}
            {order.commissionnaire.email && (
              <span className="text-xs text-gray-500 ml-2">✉️ {order.commissionnaire.email}</span>
            )}
            {order.commissionnaire.phone && (
              <span className="text-xs text-gray-500 ml-2">📞 {order.commissionnaire.phone}</span>
            )}
            {order.commissionnaire.adresse && (
              <span className="text-xs text-gray-500 ml-2">🏠 {order.commissionnaire.adresse}</span>
            )}
            {(order.commissionnaire.codePostal || order.commissionnaire.ville) && (
              <span className="text-xs text-gray-500 ml-2">📍 {order.commissionnaire.codePostal} {order.commissionnaire.ville}</span>
            )}
            {order.commissionnaire.pays && (
              <span className="text-xs text-gray-500 ml-2">🌍 {order.commissionnaire.pays}</span>
            )}
            {order.commissionnaire.tva && (
              <span className="text-xs text-gray-500 ml-2">🧾 TVA: {order.commissionnaire.tva}</span>
            )}
            {order.commissionnaire.siret && (
              <span className="text-xs text-gray-500 ml-2">🏢 SIRET: {order.commissionnaire.siret}</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 border-r border-gray-200 align-middle">
        <span className="font-semibold text-yellow-700">{getStatusFr(order.status)}</span>
      </td>
      <td className="px-4 py-3 align-middle text-right">
        <div className="grid grid-cols-2 gap-1">
          <button className="px-1 py-1 text-white bg-blue-600 rounded text-[8px] whitespace-nowrap hover:bg-blue-700" onClick={() => setSelectedOrder(order)}>
            Détails
          </button>
          <button className="px-1 py-1 text-white bg-yellow-500 rounded text-[8px] whitespace-nowrap hover:bg-yellow-600" onClick={() => { setOrderToEdit(order); setShowAdd(true); }}>
            Modifier
          </button>
          <button className="px-1 py-1 text-white bg-red-600 rounded text-[8px] whitespace-nowrap hover:bg-red-700" onClick={() => handleDelete(order._id)}>
            Supprimer
          </button>
          <button className="px-1 py-1 text-white bg-slate-600 rounded text-[8px] whitespace-nowrap hover:bg-slate-700" onClick={() => generateTransportOrderPDF(order)}>
            Télécharger
          </button>
        </div>
      </td>
    </tr>
  );
}

// Fonction utilitaire pour traduire les statuts en français
function getStatusFr(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'En attente';
    case 'in progress': return 'En cours';
    case 'completed': return 'Terminé';
    case 'cancelled': return 'Annulé';
    case 'draft': return 'Brouillon';
    default: return status || '-';
  }
}
