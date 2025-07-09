import React, { useState } from "react";

const safe = (val) =>
  typeof val === "string" || typeof val === "number"
    ? val
    : JSON.stringify(val || "N/A");

function getStatusColor(status) {
  if (status === "Payée") return "text-green-700 font-semibold";
  if (status === "Brouillon" || status === "Envoyé") return "text-blue-700 font-semibold";
  if (status === "Partiellement payée" || status === "En retard" || status === "Annulée" || status === "Remboursée") return "text-red-600 font-semibold";
  return "text-gray-500";
}

function FactureDetailsModal({ facture, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">×</button>
        <h2 className="text-lg font-bold mb-2">Détail de la facture</h2>
        {/* Bloc société harmonisé */}
        {facture.client && (
          <div className="mb-3 p-2 rounded border border-blue-300 bg-blue-50">
            <div className="font-bold text-blue-700">Société (Client)</div>
            <div><span className="font-semibold">Nom d'entreprise :</span> {facture.client.nom_de_entreprise || facture.client.nom_de_entreprise_du_comisionaire || facture.client.name || '-'}</div>
            {facture.client.representant && <div><span className="font-semibold">Représentant :</span> {facture.client.representant}</div>}
            {facture.client.email && <div><span className="font-semibold">Email :</span> {facture.client.email}</div>}
            {facture.client.phone && <div><span className="font-semibold">Téléphone :</span> {facture.client.phone}</div>}
            {facture.client.street && <div><span className="font-semibold">Adresse :</span> {facture.client.street}</div>}
            {facture.client.city && <div><span className="font-semibold">Ville :</span> {facture.client.city}</div>}
            {facture.client.zipCode && <div><span className="font-semibold">Code postal :</span> {facture.client.zipCode}</div>}
            {facture.client.country && <div><span className="font-semibold">Pays :</span> {facture.client.country}</div>}
            {(facture.client.taxID || facture.client.tva) && <div><span className="font-semibold">TVA :</span> {facture.client.taxID || facture.client.tva}</div>}
            {(facture.client.siret || facture.client.registrationNumber) && <div><span className="font-semibold">SIRET :</span> {facture.client.siret || facture.client.registrationNumber}</div>}
          </div>
        )}
        {facture.transporteur && (
          <div className="mb-3 p-2 rounded border border-green-300 bg-green-50">
            <div className="font-bold text-green-700">Société (Transporteur)</div>
            <div><span className="font-semibold">Nom d'entreprise :</span> {facture.transporteur.nom_de_entreprise || facture.transporteur.name || '-'}</div>
            {facture.transporteur.representant && <div><span className="font-semibold">Représentant :</span> {facture.transporteur.representant}</div>}
            {facture.transporteur.email && <div><span className="font-semibold">Email :</span> {facture.transporteur.email}</div>}
            {facture.transporteur.phone && <div><span className="font-semibold">Téléphone :</span> {facture.transporteur.phone}</div>}
            {facture.transporteur.street && <div><span className="font-semibold">Adresse :</span> {facture.transporteur.street}</div>}
            {facture.transporteur.city && <div><span className="font-semibold">Ville :</span> {facture.transporteur.city}</div>}
            {facture.transporteur.zipCode && <div><span className="font-semibold">Code postal :</span> {facture.transporteur.zipCode}</div>}
            {facture.transporteur.country && <div><span className="font-semibold">Pays :</span> {facture.transporteur.country}</div>}
            {(facture.transporteur.taxID || facture.transporteur.tva) && <div><span className="font-semibold">TVA :</span> {facture.transporteur.taxID || facture.transporteur.tva}</div>}
            {(facture.transporteur.siret || facture.transporteur.registrationNumber) && <div><span className="font-semibold">SIRET :</span> {facture.transporteur.siret || facture.transporteur.registrationNumber}</div>}
          </div>
        )}
        {facture.commissionnaire && (
          <div className="mb-3 p-2 rounded border border-purple-300 bg-purple-50">
            <div className="font-bold text-purple-700">Société (Commissionnaire)</div>
            <div><span className="font-semibold">Nom d'entreprise :</span> {facture.commissionnaire.nom_de_entreprise_du_comisionaire || facture.commissionnaire.nom_de_entreprise || facture.commissionnaire.name || '-'}</div>
            {facture.commissionnaire.representant && <div><span className="font-semibold">Représentant :</span> {facture.commissionnaire.representant}</div>}
            {facture.commissionnaire.email && <div><span className="font-semibold">Email :</span> {facture.commissionnaire.email}</div>}
            {facture.commissionnaire.phone && <div><span className="font-semibold">Téléphone :</span> {facture.commissionnaire.phone}</div>}
            {facture.commissionnaire.street && <div><span className="font-semibold">Adresse :</span> {facture.commissionnaire.street}</div>}
            {facture.commissionnaire.city && <div><span className="font-semibold">Ville :</span> {facture.commissionnaire.city}</div>}
            {facture.commissionnaire.zipCode && <div><span className="font-semibold">Code postal :</span> {facture.commissionnaire.zipCode}</div>}
            {facture.commissionnaire.country && <div><span className="font-semibold">Pays :</span> {facture.commissionnaire.country}</div>}
            {(facture.commissionnaire.taxID || facture.commissionnaire.tva) && <div><span className="font-semibold">TVA :</span> {facture.commissionnaire.taxID || facture.commissionnaire.tva}</div>}
            {(facture.commissionnaire.siret || facture.commissionnaire.registrationNumber) && <div><span className="font-semibold">SIRET :</span> {facture.commissionnaire.siret || facture.commissionnaire.registrationNumber}</div>}
          </div>
        )}
        <div className="mb-2"><span className="font-semibold">Départ :</span> {facture.adresseDepart ? `${facture.adresseDepart.adresse}, ${facture.adresseDepart.ville}, ${facture.adresseDepart.codePostal}, ${facture.adresseDepart.pays}` : facture.route?.depart}</div>
        <div className="mb-2"><span className="font-semibold">Arrivée :</span> {facture.adresseArrivee ? `${facture.adresseArrivee.adresse}, ${facture.adresseArrivee.ville}, ${facture.adresseArrivee.codePostal}, ${facture.adresseArrivee.pays}` : facture.route?.arrivee}</div>
        <div className="mb-2"><span className="font-semibold">Statut :</span> <span className={getStatusColor(facture.status)}>{facture.status}</span></div>
        <div className="mb-2"><span className="font-semibold">Total TTC :</span> {facture.totalTTC} €</div>
        {/* Ajoute d'autres infos importantes ici si besoin */}
      </div>
    </div>
  );
}

export default function FactureTable({ factures, onEdit, onDelete, onDownload }) {
  const [selectedFacture, setSelectedFacture] = useState(null);

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
          {factures.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-6">Aucune facture trouvée.</td></tr>
          ) : (
            factures.map((item, idx) => (
              <tr key={item._id || idx} className="bg-white border-b border-gray-200">
                <td className="px-4 py-2 cursor-pointer" onClick={() => setSelectedFacture(item)}>{safe(item?.factureID)}</td>
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
                  {/* Priorité : transporteur > commissionnaire > client */}
                  {item.transporteur ? (
                    <div>
                      <div className="font-semibold text-green-700">{item.transporteur.nom_de_entreprise || item.transporteur.name || '-'}</div>
                      {item.transporteur.representant && <div className="text-xs text-gray-600">{item.transporteur.representant}</div>}
                      {item.transporteur.email && <div className="text-xs text-gray-500">{item.transporteur.email}</div>}
                      {item.transporteur.phone && <div className="text-xs text-gray-500">{item.transporteur.phone}</div>}
                      {(item.transporteur.street || item.transporteur.city || item.transporteur.zipCode) && (
                        <div className="text-xs text-gray-500">
                          {[item.transporteur.street, item.transporteur.city, item.transporteur.zipCode].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {(item.transporteur.taxID || item.transporteur.tva) && (
                        <div className="text-xs text-gray-500">TVA : {item.transporteur.taxID || item.transporteur.tva}</div>
                      )}
                      {(item.transporteur.siret || item.transporteur.registrationNumber) && (
                        <div className="text-xs text-gray-500">SIRET : {item.transporteur.siret || item.transporteur.registrationNumber}</div>
                      )}
                    </div>
                  ) : item.commissionnaire ? (
                    <div>
                      <div className="font-semibold text-purple-700">{item.commissionnaire.nom_de_entreprise_du_comisionaire || item.commissionnaire.nom_de_entreprise || item.commissionnaire.name || '-'}</div>
                      {item.commissionnaire.representant && <div className="text-xs text-gray-600">{item.commissionnaire.representant}</div>}
                      {item.commissionnaire.email && <div className="text-xs text-gray-500">{item.commissionnaire.email}</div>}
                      {item.commissionnaire.phone && <div className="text-xs text-gray-500">{item.commissionnaire.phone}</div>}
                      {(item.commissionnaire.street || item.commissionnaire.city || item.commissionnaire.zipCode) && (
                        <div className="text-xs text-gray-500">
                          {[item.commissionnaire.street, item.commissionnaire.city, item.commissionnaire.zipCode].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {(item.commissionnaire.taxID || item.commissionnaire.tva) && (
                        <div className="text-xs text-gray-500">TVA : {item.commissionnaire.taxID || item.commissionnaire.tva}</div>
                      )}
                      {(item.commissionnaire.siret || item.commissionnaire.registrationNumber) && (
                        <div className="text-xs text-gray-500">SIRET : {item.commissionnaire.siret || item.commissionnaire.registrationNumber}</div>
                      )}
                    </div>
                  ) : item.client ? (
                    <div>
                      <div className="font-semibold text-blue-700">{item.client.nom_de_entreprise || item.client.nom_de_entreprise_du_comisionaire || item.client.name || '-'}</div>
                      {item.client.representant && <div className="text-xs text-gray-600">{item.client.representant}</div>}
                      {item.client.email && <div className="text-xs text-gray-500">{item.client.email}</div>}
                      {item.client.phone && <div className="text-xs text-gray-500">{item.client.phone}</div>}
                      {(item.client.street || item.client.city || item.client.zipCode) && (
                        <div className="text-xs text-gray-500">
                          {[item.client.street, item.client.city, item.client.zipCode].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {(item.client.taxID || item.client.tva) && (
                        <div className="text-xs text-gray-500">TVA : {item.client.taxID || item.client.tva}</div>
                      )}
                      {(item.client.siret || item.client.registrationNumber) && (
                        <div className="text-xs text-gray-500">SIRET : {item.client.siret || item.client.registrationNumber}</div>
                      )}
                    </div>
                  ) : item.companyInfo ? (
                    <div>
                      <div className="font-semibold">{item.companyInfo.name || '-'}</div>
                      {item.companyInfo.email && <div className="text-xs text-gray-500">{item.companyInfo.email}</div>}
                      {item.companyInfo.phone && <div className="text-xs text-gray-500">{item.companyInfo.phone}</div>}
                      {item.companyInfo.country && <div className="text-xs text-gray-500">{item.companyInfo.country}</div>}
                      {(item.companyInfo.taxID || item.companyInfo.tva) && <div className="text-xs text-gray-500">TVA : {item.companyInfo.taxID || item.companyInfo.tva}</div>}
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
                    <button className="px-1 py-1 text-white bg-emerald-600 rounded text-[8px] whitespace-nowrap hover:bg-emerald-700" onClick={() => setSelectedFacture(item)}>Détail</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedFacture && <FactureDetailsModal facture={selectedFacture} onClose={() => setSelectedFacture(null)} />}
    </>
  );
} 