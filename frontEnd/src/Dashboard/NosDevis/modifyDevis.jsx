import { useState, useEffect } from "react";
import Dashboard from "../mainDashboard.jsx";
import SearchForm from "./searchFormDevis.jsx";
import { getAllEstimates, apiDeleteEstimate } from "../api/apiService";

export default function NosDevis() {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lookEstimate();
  }, []);

  const lookEstimate = async () => {
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

  const deleteEstimate = async (devisID) => {
    if (!devisID) {
      alert("ID du devis introuvable !");
      return;
    }
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce devis ?");
    if (!confirmDelete) return;

    try {
      await apiDeleteEstimate(devisID);
      setDevis((prev) => prev.filter((item) => item._id !== devisID));
      console.log("✅ Devis supprimé !");
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const safe = (val) =>
    typeof val === "string" || typeof val === "number"
      ? val
      : JSON.stringify(val || "N/A");

  return (
    <Dashboard>
      <div className="p-4">
        <div className="p-4 mt-4 bg-white rounded-lg dark:bg-gray-900">
          <SearchForm />
        </div>

        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          {loading ? (
            <p className="text-gray-600">Chargement...</p>
          ) : devis.length === 0 ? (
            <p>Aucun devis disponible.</p>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-300">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">N° Devis</th>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Pays</th>
                  <th className="px-4 py-2">Total HT</th>
                  <th className="px-4 py-2">TVA</th>
                  <th className="px-4 py-2">Total TTC</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devis.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2">{safe(item?.devisID)}</td>
                    <td className="px-4 py-2">{safe(item?.client?.name)}</td>
                    <td className="px-4 py-2">{safe(item?.client?.country)}</td>
                    <td className="px-4 py-2">{safe(item?.totalHT)} €</td>
                    <td className="px-4 py-2">{safe(item?.tva)} €</td>
                    <td className="px-4 py-2 font-semibold">{safe(item?.totalTTC)} €</td>
                    <td className="px-4 py-2 flex gap-1">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded">
                        Voir
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
                        onClick={() => deleteEstimate(item._id)}
                      >
                        Supprimer
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 text-xs rounded">
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Dashboard>
  );
}
