import React, { useState } from "react";

const safe = (val) =>
  typeof val === "string" || typeof val === "number"
    ? val
    : JSON.stringify(val || "N/A");

function getStatusColor(status) {
  if (status === "Accepté") return "text-green-700 font-semibold";
  if (status === "Brouillon" || status === "Envoyé") return "text-blue-700 font-semibold";
  if (status === "Refusé" || status === "Expiré" || status === "Annulé") return "text-red-600 font-semibold";
  return "text-gray-500";
}

export default function DevisTable({ devis, onEdit, onDelete, onDownload }) {
  const [selectedDevis, setSelectedDevis] = useState(null);

  return (
    <>
      <table className="w-full min-w-[900px] text-xs text-left text-gray-700 border-separate border-spacing-0">
        <thead className="text-[11px] uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3 border-r border-gray-200 min-w-[90px]">Numéro</th>
            <th className="px-4 py-3 border-r border-gray-200 min-w-[170px]">Départ</th>
            <th className="px-4 py-3 border-r border-gray-200 min-w-[170px]">Arrivée</th>
            <th className="px-4 py-3 border-r border-gray-200 min-w-[180px]">Entreprise</th>
            <th className="px-4 py-3 border-r border-gray-200 min-w-[100px]">Statut</th>
            <th className="px-4 py-3 min-w-[120px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devis.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-6">Aucun devis trouvé.</td></tr>
          ) : (
            devis.map((item, idx) => (
              <tr key={item._id || idx} className="bg-white border-b border-gray-200">
                <td className="px-4 py-2 cursor-pointer" onClick={() => setSelectedDevis(item)}>{safe(item?.devisID)}</td>
                <td className="px-4 py-2">
                  {item.adresseDepart ? (
                    <div>
                      <span className="font-semibold text-blue-700">{item.adresseDepart.ville}</span>
                      {item.adresseDepart.pays && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">{item.adresseDepart.pays}</span>
                      )}
                    </div>
                  ) : (
                    <span>{item.route?.depart || "..."}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {item.adresseArrivee ? (
                    <div>
                      <span className="font-semibold text-green-700">{item.adresseArrivee.ville}</span>
                      {item.adresseArrivee.pays && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">{item.adresseArrivee.pays}</span>
                      )}
                    </div>
                  ) : (
                    <span>{item.route?.arrivee || "..."}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {/* Priorité : transporteur > commissionnaire > companyInfo */}
                  {item.transporteur ? (
                    <div>
                      <div className="font-semibold text-green-700">{item.transporteur.nom_de_entreprise || item.transporteur.name || '-'}</div>
                      {item.transporteur.representant && <div className="text-xs text-gray-600">{item.transporteur.representant}</div>}
                      {item.transporteur.email && <div className="text-xs text-gray-500">{item.transporteur.email}</div>}
                      {item.transporteur.phone && <div className="text-xs text-gray-500">{item.transporteur.phone}</div>}
                      {(item.transporteur.adresse || item.transporteur.street) && (
                        <div className="text-xs text-gray-500">
                          {item.transporteur.adresse || item.transporteur.street} {item.transporteur.ville || item.transporteur.city} {item.transporteur.code_postal || item.transporteur.zipCode}
                        </div>
                      )}
                      {(item.transporteur.tva || item.transporteur.taxID) && <div className="text-xs text-gray-500">TVA : {item.transporteur.tva || item.transporteur.taxID}</div>}
                      {item.transporteur.siret && <div className="text-xs text-gray-500">SIRET : {item.transporteur.siret}</div>}
                    </div>
                  ) : item.commissionnaire ? (
                    <div>
                      <div className="font-semibold text-purple-700">{item.commissionnaire.nom_de_entreprise_du_comisionaire || item.commissionnaire.nom_de_entreprise || item.commissionnaire.name || '-'}</div>
                      {item.commissionnaire.representant && <div className="text-xs text-gray-600">{item.commissionnaire.representant}</div>}
                      {item.commissionnaire.email && <div className="text-xs text-gray-500">{item.commissionnaire.email}</div>}
                      {item.commissionnaire.phone && <div className="text-xs text-gray-500">{item.commissionnaire.phone}</div>}
                      {(item.commissionnaire.adresse || item.commissionnaire.street) && (
                        <div className="text-xs text-gray-500">
                          {item.commissionnaire.adresse || item.commissionnaire.street} {item.commissionnaire.ville || item.commissionnaire.city} {item.commissionnaire.code_postal || item.commissionnaire.zipCode}
                        </div>
                      )}
                      {(item.commissionnaire.tva || item.commissionnaire.taxID) && <div className="text-xs text-gray-500">TVA : {item.commissionnaire.tva || item.commissionnaire.taxID}</div>}
                      {item.commissionnaire.siret && <div className="text-xs text-gray-500">SIRET : {item.commissionnaire.siret}</div>}
                    </div>
                  ) : item.companyInfo ? (
                    <div>
                      <div className="font-semibold">{item.companyInfo.name || '-'}</div>
                      {item.companyInfo.email && <div className="text-xs text-gray-500">{item.companyInfo.email}</div>}
                      {item.companyInfo.phone && <div className="text-xs text-gray-500">{item.companyInfo.phone}</div>}
                      {item.companyInfo.country && <div className="text-xs text-gray-500">{item.companyInfo.country}</div>}
                      {(item.companyInfo.taxID || item.companyInfo.tva) && <div className="text-xs text-gray-500">TVA : {item.companyInfo.taxID || item.companyInfo.tva}</div>}
                      {item.companyInfo.siret && <div className="text-xs text-gray-500">SIRET : {item.companyInfo.siret}</div>}
                    </div>
                  ) : (
                    <span>...</span>
                  )}
                </td>
                <td className={"px-4 py-2 " + getStatusColor(item.status)}>{safe(item.status)}</td>
                <td className="px-4 py-2 text-right">
                  <div className="grid grid-cols-2 gap-1">
                    <button className="px-1 py-1 text-white bg-blue-600 rounded text-[8px] whitespace-nowrap hover:bg-blue-700" onClick={() => onEdit(item)}>Modifier</button>
                    <button className="px-1 py-1 text-white bg-red-600 rounded text-[8px] whitespace-nowrap hover:bg-red-700" onClick={() => onDelete(item._id)}>Supprimer</button>
                    <button className="px-1 py-1 text-white bg-slate-600 rounded text-[8px] whitespace-nowrap hover:bg-slate-700" onClick={() => onDownload(item)}>Télécharger</button>
                    <button className="px-1 py-1 text-white bg-emerald-600 rounded text-[8px] whitespace-nowrap hover:bg-emerald-700" onClick={() => setSelectedDevis(item)}>Détail</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedDevis && <DevisDetailsModal devis={selectedDevis} onClose={() => setSelectedDevis(null)} />}
    </>
  );
}

function DevisDetailsModal({ devis, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">×</button>
        <h2 className="text-lg font-bold mb-2">Détail du devis</h2>
        {/* Bloc société harmonisé */}
        {devis.client && (
          <div className="mb-3 p-2 rounded border border-blue-300 bg-blue-50">
            <div className="font-bold text-blue-700">Société (Client)</div>
            <div><span className="font-semibold">Nom d'entreprise :</span> {devis.client.nom_de_entreprise || devis.client.nom_de_entreprise_du_comisionaire || devis.client.name || '-'}</div>
            {devis.client.representant && <div><span className="font-semibold">Représentant :</span> {devis.client.representant}</div>}
            {devis.client.email && <div><span className="font-semibold">Email :</span> {devis.client.email}</div>}
            {devis.client.phone && <div><span className="font-semibold">Téléphone :</span> {devis.client.phone}</div>}
            {devis.client.street && <div><span className="font-semibold">Adresse :</span> {devis.client.street}</div>}
            {devis.client.city && <div><span className="font-semibold">Ville :</span> {devis.client.city}</div>}
            {devis.client.zipCode && <div><span className="font-semibold">Code postal :</span> {devis.client.zipCode}</div>}
            {devis.client.country && <div><span className="font-semibold">Pays :</span> {devis.client.country}</div>}
            {(devis.client.taxID || devis.client.tva) && <div><span className="font-semibold">TVA :</span> {devis.client.taxID || devis.client.tva}</div>}
          </div>
        )}
        {devis.transporteur && (
          <div className="mb-3 p-2 rounded border border-green-300 bg-green-50">
            <div className="font-bold text-green-700">Société (Transporteur)</div>
            <div><span className="font-semibold">Nom d'entreprise :</span> {devis.transporteur.nom_de_entreprise || devis.transporteur.name || '-'}</div>
            {devis.transporteur.representant && <div><span className="font-semibold">Représentant :</span> {devis.transporteur.representant}</div>}
            {devis.transporteur.email && <div><span className="font-semibold">Email :</span> {devis.transporteur.email}</div>}
            {devis.transporteur.phone && <div><span className="font-semibold">Téléphone :</span> {devis.transporteur.phone}</div>}
            {devis.transporteur.street && <div><span className="font-semibold">Adresse :</span> {devis.transporteur.street}</div>}
            {devis.transporteur.city && <div><span className="font-semibold">Ville :</span> {devis.transporteur.city}</div>}
            {devis.transporteur.zipCode && <div><span className="font-semibold">Code postal :</span> {devis.transporteur.zipCode}</div>}
            {devis.transporteur.country && <div><span className="font-semibold">Pays :</span> {devis.transporteur.country}</div>}
            {devis.transporteur.taxID && <div><span className="font-semibold">TVA :</span> {devis.transporteur.taxID}</div>}
          </div>
        )}
        {devis.commissionnaire && (
          <div className="mb-3 p-2 rounded border border-purple-300 bg-purple-50">
            <div className="font-bold text-purple-700">Société (Commissionnaire)</div>
            <div><span className="font-semibold">Nom d'entreprise :</span> {devis.commissionnaire.nom_de_entreprise_du_comisionaire || devis.commissionnaire.nom_de_entreprise || devis.commissionnaire.name || '-'}</div>
            {devis.commissionnaire.representant && <div><span className="font-semibold">Représentant :</span> {devis.commissionnaire.representant}</div>}
            {devis.commissionnaire.email && <div><span className="font-semibold">Email :</span> {devis.commissionnaire.email}</div>}
            {devis.commissionnaire.phone && <div><span className="font-semibold">Téléphone :</span> {devis.commissionnaire.phone}</div>}
            {devis.commissionnaire.street && <div><span className="font-semibold">Adresse :</span> {devis.commissionnaire.street}</div>}
            {devis.commissionnaire.city && <div><span className="font-semibold">Ville :</span> {devis.commissionnaire.city}</div>}
            {devis.commissionnaire.zipCode && <div><span className="font-semibold">Code postal :</span> {devis.commissionnaire.zipCode}</div>}
            {devis.commissionnaire.country && <div><span className="font-semibold">Pays :</span> {devis.commissionnaire.country}</div>}
            {(devis.commissionnaire.taxID || devis.commissionnaire.tva) && <div><span className="font-semibold">TVA :</span> {devis.commissionnaire.taxID || devis.commissionnaire.tva}</div>}
          </div>
        )}
        <div className="mb-2"><span className="font-semibold">Départ :</span> {devis.adresseDepart ? `${devis.adresseDepart.adresse}, ${devis.adresseDepart.ville}, ${devis.adresseDepart.codePostal}, ${devis.adresseDepart.pays}` : devis.route?.depart}</div>
        <div className="mb-2"><span className="font-semibold">Arrivée :</span> {devis.adresseArrivee ? `${devis.adresseArrivee.adresse}, ${devis.adresseArrivee.ville}, ${devis.adresseArrivee.codePostal}, ${devis.adresseArrivee.pays}` : devis.route?.arrivee}</div>
        <div className="mb-2"><span className="font-semibold">Statut :</span> <span className={getStatusColor(devis.status)}>{devis.status}</span></div>
        <div className="mb-2"><span className="font-semibold">Total TTC :</span> {devis.totalTTC} €</div>
        {/* Ajoute d'autres infos importantes ici si besoin */}
      </div>
    </div>
  );
} 