// utils/devisUtils.js
import axios from "axios";

export const fetchAllDevisIDs = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/estimate");
    const data = response.data;

    let allQuotationIds = [];
    if (Array.isArray(data)) {
      allQuotationIds = data
        .filter((item) => typeof item.devisID === "string")
        .map((item) => item.devisID);
    } else if (typeof data === "object") {
      Object.values(data).forEach((tableau) => {
        if (Array.isArray(tableau)) {
          tableau.forEach((item) => {
            if (typeof item.devisID === "string") {
              allQuotationIds.push(item.devisID);
            }
          });
        }
      });
    }

    return allQuotationIds;
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error);
    return [];
  }
};

export const generateDevisID = (devisList) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}-${month}`;

  const devisThisMonth = devisList.filter(
    (id) => typeof id === "string" && id.startsWith(prefix)
  );

  const lastNumbers = devisThisMonth.map((id) => {
    const parts = id.split("-");
    return parseInt(parts[2], 10);
  });

  const maxNumber = lastNumbers.length > 0 ? Math.max(...lastNumbers) : 0;
  const nextNumber = String(maxNumber + 1).padStart(3, "0");
  return `${prefix}-${nextNumber}`;
};

export const calculateTotals = (items, tvaRate) => {
  const totalHT = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tva = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + tva;

  return {
    totalHT: parseFloat(totalHT.toFixed(2)),
    tva: parseFloat(tva.toFixed(2)),
    totalTTC: parseFloat(totalTTC.toFixed(2)),
  };
};

export const deleteEstimate = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/estimate/delete/${id}`);
      return response; // ✅ on retourne bien la réponse ici
    } catch (error) {
      console.error("Erreur dans deleteEstimate :", error);
      throw error; // ✅ on relance l'erreur pour qu'elle soit catchée côté composant
    }
  };

export const fetchAllFactureIDs = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/invoice");
    const data = response.data;
    let allFactureIds = [];
    if (Array.isArray(data)) {
      allFactureIds = data
        .filter((item) => typeof item.factureID === "string")
        .map((item) => item.factureID);
    } else if (typeof data === "object") {
      Object.values(data).forEach((tableau) => {
        if (Array.isArray(tableau)) {
          tableau.forEach((item) => {
            if (typeof item.factureID === "string") {
              allFactureIds.push(item.factureID);
            }
          });
        }
      });
    }
    return allFactureIds;
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    return [];
  }
};

export const generateFactureID = (factureList) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}-${month}`;
  const facturesThisMonth = factureList.filter(
    (id) => typeof id === "string" && id.startsWith(prefix)
  );
  const lastNumbers = facturesThisMonth.map((id) => {
    const parts = id.split("-");
    return parseInt(parts[2], 10);
  });
  const maxNumber = lastNumbers.length > 0 ? Math.max(...lastNumbers) : 0;
  const nextNumber = String(maxNumber + 1).padStart(3, "0");
  return `${prefix}-${nextNumber}`;
};

