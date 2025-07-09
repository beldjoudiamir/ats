import { useState, useEffect } from "react";
import axios from "axios";

const STATUSES = {
  PENDING:   { label: "En attente", description: "Le devis est en attente de validation ou d'approbation." },
  APPROVED:  { label: "Approuvé", description: "Le devis a été approuvé par le client." },
  REJECTED:  { label: "Rejeté", description: "Le devis a été rejeté par le client." },
  EXPIRED:   { label: "Expiré", description: "Le devis est expiré et n'est plus valide." },
  IN_REVIEW: { label: "En révision", description: "Le devis est en cours de modification ou de mise à jour." },
  CANCELLED: { label: "Annulé", description: "Le devis a été annulé par le client ou l'entreprise." }
};

const initialState = {
  ordreTransport: "",
  transporteur: "",
  commissionnaire: "",
  adresseDepart: "",
  villeDepart: "",
  codePostalDepart: "",
  paysDepart: "",
  dateChargementDepart: "",
  heureChargementDepart: "",
  adresseArrivee: "",
  villeArrivee: "",
  codePostalArrivee: "",
  paysArrivee: "",
  dateDechargementArrivee: "",
  heureDechargementArrivee: "",
  typeMarchandise: "",
  typeCamion: "",
  poids: "",
  volume: "",
  nombrePalettes: "",
  prix: "",
  status: "PENDING",
  devisID: "",
  factureID: "",
  sourceType: "devis"
};

const TRUCK_TYPES = [
  "Fourgon",
  "Frigorifique",
  "Plateau",
  "Citerne",
  "Benne",
  "Tautliner",
  "Porte-voitures",
  "Bâché",
  "Remorque",
  "Autre"
];

const GOODS_TYPES = [
  "Alimentaire",
  "Matériaux",
  "Meubles",
  "Électronique",
  "Textile",
  "Animaux",
  "Produits chimiques",
  "Automobile",
  "Déchets",
  "Autre"
];

function generateOrderNumber(orderList) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `OT${year}${month}`;
  const filtered = orderList
    .map(o => o.ordreTransport)
    .filter(id => typeof id === "string" && id.startsWith(prefix));
  const lastNumbers = filtered.map(id => parseInt(id.split("-")[1], 10)).filter(Boolean);
  const maxNumber = lastNumbers.length > 0 ? Math.max(...lastNumbers) : 0;
  const nextNumber = String(maxNumber + 1).padStart(3, "0");
  return `${prefix}-${nextNumber}`;
}

function TransporteurSelector({ transporteurs, value, onChange, required = false }) {
  return (
    <div>
      <label className="block font-medium">Transporteur *</label>
      <select
        name="transporteur"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded p-2"
      >
        <option value="">Sélectionner...</option>
        {transporteurs.map(t => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}

function CommissionnaireSelector({ commissionnaires, value, onChange, required = false }) {
  return (
    <div>
      <label className="block font-medium">Commissionnaire *</label>
      <select
        name="commissionnaire"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded p-2"
      >
        <option value="">Sélectionner...</option>
        {commissionnaires.map(c => (
          <option key={c._id} value={c._id}>{c.nom_de_entreprise_du_comisionaire || c.name}</option>
        ))}
      </select>
    </div>
  );
}

function AdresseFields({ prefix, form, handleChange, required = false, title = "" }) {
  return (
    <>
      {title && <div className="md:col-span-2 font-semibold mt-4">{title}</div>}
      <div>
        <label className="block font-medium">Adresse {title && title.toLowerCase()} {required && "*"}</label>
        <input
          type="text"
          name={`adresse${prefix}`}
          value={form[`adresse${prefix}`]}
          onChange={handleChange}
          required={required}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Ville {title && title.toLowerCase()}</label>
        <input
          type="text"
          name={`ville${prefix}`}
          value={form[`ville${prefix}`]}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Code postal {title && title.toLowerCase()}</label>
        <input
          type="text"
          name={`codePostal${prefix}`}
          value={form[`codePostal${prefix}`]}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Pays {title && title.toLowerCase()}</label>
        <input
          type="text"
          name={`pays${prefix}`}
          value={form[`pays${prefix}`]}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Date {title && title.toLowerCase()}</label>
        <input
          type="date"
          name={prefix === "Depart" ? "dateChargementDepart" : "dateDechargementArrivee"}
          value={form[prefix === "Depart" ? "dateChargementDepart" : "dateDechargementArrivee"]}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Heure {title && title.toLowerCase()}</label>
        <input
          type="time"
          name={prefix === "Depart" ? "heureChargementDepart" : "heureDechargementArrivee"}
          value={form[prefix === "Depart" ? "heureChargementDepart" : "heureDechargementArrivee"]}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
    </>
  );
}

// Helper pour construire un objet société à partir de n'importe quelle source
function buildSocieteFromAny(source) {
  if (!source) return null;
  console.log("🔍 buildSocieteFromAny - source:", source);
  console.log("🔍 buildSocieteFromAny - source.siret:", source.siret);
  console.log("🔍 buildSocieteFromAny - source.registrationNumber:", source.registrationNumber);
  console.log("🔍 buildSocieteFromAny - source.taxID:", source.taxID);
  console.log("🔍 buildSocieteFromAny - source.tva:", source.tva);
  console.log("🔍 buildSocieteFromAny - source.street:", source.street);
  console.log("🔍 buildSocieteFromAny - source.adresse:", source.adresse);
  console.log("🔍 buildSocieteFromAny - source.city:", source.city);
  console.log("🔍 buildSocieteFromAny - source.ville:", source.ville);
  console.log("🔍 buildSocieteFromAny - source.zipCode:", source.zipCode);
  console.log("🔍 buildSocieteFromAny - source.codePostal:", source.codePostal);
  
  const result = {
    name: source["Nom d'entreprise"] || source.name || source.nom_de_entreprise || source.nom_de_entreprise_du_comisionaire || "",
    representant: source.representant || "",
    email: source.email || "",
    phone: source.phone || "",
    street: source.street || source.adresse || source.address || "",
    zipCode: source.zipCode || source.codePostal || source.postal_code || "",
    city: source.city || source.ville || "",
    country: source.country || source.pays || "",
    taxID: source.taxID || source.tva || source.numero_tva || "",
    siret: source.siret || source.registrationNumber || source.numero_siret || "",
    website: source.website || "",
    industry: source.industry || "",
    description: source.description || "",
    linkedin: source.linkedin || "",
    twitter: source.twitter || ""
  };
  
  console.log("🔍 buildSocieteFromAny - result.siret:", result.siret);
  console.log("🔍 buildSocieteFromAny - result.taxID:", result.taxID);
  console.log("🔍 buildSocieteFromAny - result.street:", result.street);
  console.log("🔍 buildSocieteFromAny - result.city:", result.city);
  console.log("🔍 buildSocieteFromAny - result.zipCode:", result.zipCode);
  return result;
}

// Helper pour extraire la valeur string d'un champ d'adresse (objet ou string)
function getAdresseField(val, key) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    // Pour les cas où l'objet a la clé recherchée
    if (val[key]) return val[key];
    // Pour les cas où l'objet a une seule clé pertinente
    const possibleKeys = ["adresse", "address", "ville", "city", "codePostal", "postal_code", "pays", "country"];
    for (const k of possibleKeys) {
      if (val[k]) return val[k];
    }
    // Sinon, retourne la première valeur string trouvée
    for (const v of Object.values(val)) {
      if (typeof v === "string") return v;
    }
  }
  return "";
}

// Fonction utilitaire pour extraire les informations d'adresse d'une facture
function extractAddressFromFacture(facture, type) {
  if (!facture) return null;
  
  // Essayer d'abord les adresses structurées
  if (type === 'depart' && facture.adresseDepart) {
    return facture.adresseDepart;
  }
  if (type === 'arrivee' && facture.adresseArrivee) {
    return facture.adresseArrivee;
  }
  
  // Fallback sur route
  if (facture.route) {
    if (type === 'depart' && facture.route.depart) {
      return { adresse: facture.route.depart };
    }
    if (type === 'arrivee' && facture.route.arrivee) {
      return { adresse: facture.route.arrivee };
    }
  }
  
  return null;
}

// Ajout de la fonction utilitaire pour extraire le nom d'entreprise du devis
const getDevisPartnerName = (devis) => {
  if (devis.transporteur) {
    if (devis.transporteur.nom_de_entreprise) return devis.transporteur.nom_de_entreprise;
    if (devis.transporteur["Nom d'entreprise"]) return devis.transporteur["Nom d'entreprise"];
    if (devis.transporteur.name && devis.transporteur.name.trim() !== "") return devis.transporteur.name;
    if (devis.transporteur.representant && devis.transporteur.representant.trim() !== "") return devis.transporteur.representant;
    if (devis.transporteur.nom_de_entreprise_du_comisionaire) return devis.transporteur.nom_de_entreprise_du_comisionaire;
  }
  if (devis.commissionnaire) {
    if (devis.commissionnaire.nom_de_entreprise) return devis.commissionnaire.nom_de_entreprise;
    if (devis.commissionnaire.nom_de_entreprise_du_comisionaire) return devis.commissionnaire.nom_de_entreprise_du_comisionaire;
    if (devis.commissionnaire["Nom d'entreprise"]) return devis.commissionnaire["Nom d'entreprise"];
    if (devis.commissionnaire.name && devis.commissionnaire.name.trim() !== "") return devis.commissionnaire.name;
    if (devis.commissionnaire.representant && devis.commissionnaire.representant.trim() !== "") return devis.commissionnaire.representant;
  }
  if (devis.client) {
    if (devis.client.nom_de_entreprise) return devis.client.nom_de_entreprise;
    if (devis.client["Nom d'entreprise"]) return devis.client["Nom d'entreprise"];
    if (devis.client.name && devis.client.name.trim() !== "") return devis.client.name;
    if (devis.client.representant && devis.client.representant.trim() !== "") return devis.client.representant;
  }
  return "";
};

function AddTransportOrder({ onClose, onOrderAdded, editOrder }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transporteurs, setTransporteurs] = useState([]);
  const [commissionnaires, setCommissionnaires] = useState([]);
  const [partnerType, setPartnerType] = useState("transporteur");
  const [orders, setOrders] = useState([]);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState("");
  const [devisList, setDevisList] = useState([]);
  const [selectedDevisId, setSelectedDevisId] = useState("");
  const [factureList, setFactureList] = useState([]);
  const [selectedFactureId, setSelectedFactureId] = useState("");
  const [sourceType, setSourceType] = useState("devis");
  const [externalClient, setExternalClient] = useState(null);
  const [companyInfo, setCompanyInfo] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [lastDataSent, setLastDataSent] = useState(null);
  const [societeEdit, setSocieteEdit] = useState(editOrder && editOrder.societe ? editOrder.societe : null);

  useEffect(() => {
    console.log("editOrder reçu :", editOrder);
    setCompanyLoading(true);
    axios.get("http://localhost:5000/api/companyClient").then(res => setTransporteurs(res.data || []));
    axios.get("http://localhost:5000/api/listeCommissionnaire").then(res => setCommissionnaires(res.data || []));
    axios.get("http://localhost:5000/api/transportOrder").then(res => {
      setOrders(res.data || []);
      if (!editOrder) {
        const num = generateOrderNumber(res.data || []);
        setGeneratedOrderNumber(num);
        setForm(prev => ({ ...prev, ordreTransport: num }));
      }
    });
    axios.get("http://localhost:5000/api/estimate").then(res => setDevisList(res.data || []));
    axios.get("http://localhost:5000/api/invoice").then(res => {
      console.log("🔍 Factures récupérées:", res.data);
      console.log("🔍 Détail de la première facture:", res.data?.[0]);
      if (res.data && res.data.length > 0) {
        console.log("🔍 Structure des partenaires de la première facture:");
        console.log("  - Transporteur:", res.data[0].transporteur);
        console.log("  - Commissionnaire:", res.data[0].commissionnaire);
        console.log("  - Client:", res.data[0].client);
      }
      setFactureList(res.data || []);
    });
    axios.get("http://localhost:5000/api/companyInfo")
      .then(res => {
        // Adaptation pour gérer différents formats de réponse
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data.companyInfo) data = [data.companyInfo];
          else data = [data];
        }
        setCompanyInfo(data || []);
        setCompanyLoading(false);
      })
      .catch(() => {
        setCompanyLoading(false);
      });
    if (editOrder) {
      setForm({
        ...initialState,
        ...editOrder,
        transporteur: editOrder.transporteur?._id || editOrder.transporteur || "",
        commissionnaire: editOrder.commissionnaire?._id || editOrder.commissionnaire || "",
        devisID: editOrder.devisID || "",
        factureID: editOrder.factureID || "",
        sourceType: editOrder.sourceType || (editOrder.devisID ? "devis" : editOrder.factureID ? "facture" : "devis")
      });
      setPartnerType(editOrder.transporteur ? "transporteur" : "commissionnaire");
      if (editOrder.devisID) setSelectedDevisId(editOrder.devisID);
      if (editOrder.factureID) setSelectedFactureId(editOrder.factureID);
      if (editOrder.sourceType) setSourceType(editOrder.sourceType);
      if (editOrder.societe) setSocieteEdit(editOrder.societe);
    }
  }, [editOrder]);

  // Initialisation de societeEdit en édition
  useEffect(() => {
    if (editOrder) {
      let societe = editOrder.societe;
      if (!societe) {
        // Fallback : transporteur, commissionnaire, ou client du devis/facture
        societe = buildSocieteFromAny(editOrder.transporteur) ||
                  buildSocieteFromAny(editOrder.commissionnaire);
        // Si toujours rien, tente de retrouver le partenaire du devis/facture
        if (!societe && editOrder.devisID && devisList.length > 0) {
          const devis = devisList.find(d => d._id === editOrder.devisID);
          if (devis) {
            societe = buildSocieteFromAny(devis.transporteur) ||
                      buildSocieteFromAny(devis.commissionnaire) ||
                      buildSocieteFromAny(devis.client);
          }
        }
        if (!societe && editOrder.factureID && factureList.length > 0) {
          const facture = factureList.find(f => f._id === editOrder.factureID);
          if (facture && facture.client) societe = buildSocieteFromAny(facture.client);
        }
      }
      setSocieteEdit(societe);
    }
  }, [editOrder, devisList, factureList]);

  // Effet pour réinitialiser le bloc société partenaire en création
  useEffect(() => {
    if (!editOrder) {
      // Si on change de partenaire, on ne garde pas l'ancien bloc
      // (Pas besoin de setState ici car le bloc est calculé dynamiquement)
    }
  }, [partnerType, form.transporteur, form.commissionnaire, editOrder]);

  // Pré-remplissage automatique des adresses depuis devis ou facture
  useEffect(() => {
    console.log("🔍 Pré-remplissage - sourceType:", sourceType);
    console.log("🔍 Pré-remplissage - form.devisID:", form.devisID);
    console.log("🔍 Pré-remplissage - form.factureID:", form.factureID);
    console.log("🔍 Pré-remplissage - devisList.length:", devisList.length);
    console.log("🔍 Pré-remplissage - factureList.length:", factureList.length);
    
    if (sourceType === "devis" && form.devisID) {
      const devis = devisList.find(d =>
        d._id === form.devisID ||
        d.devisID === form.devisID ||
        d.quotation?.quotationId === form.devisID
      );
      console.log("🔍 Devis trouvé:", devis);
      if (devis) {
        // Gestion des champs imbriqués pour adresseDepart et adresseArrivee
        const adDep = devis.adresseDepart;
        const adArr = devis.adresseArrivee;
        console.log("🔍 Adresse départ devis:", adDep);
        console.log("🔍 Adresse arrivée devis:", adArr);
        setForm(prev => ({
          ...prev,
          adresseDepart: adDep && typeof adDep === "object" ? adDep.adresse || adDep.address || prev.adresseDepart || "" : getAdresseField(adDep, "adresse") || prev.adresseDepart || "",
          villeDepart: adDep && typeof adDep === "object" ? adDep.ville || adDep.city || prev.villeDepart || "" : getAdresseField(devis.villeDepart, "ville") || prev.villeDepart || "",
          codePostalDepart: adDep && typeof adDep === "object" ? adDep.codePostal || adDep.postal_code || prev.codePostalDepart || "" : getAdresseField(devis.codePostalDepart, "codePostal") || prev.codePostalDepart || "",
          paysDepart: adDep && typeof adDep === "object" ? adDep.pays || adDep.country || prev.paysDepart || "" : getAdresseField(devis.paysDepart, "pays") || prev.paysDepart || "",
          adresseArrivee: adArr && typeof adArr === "object" ? adArr.adresse || adArr.address || prev.adresseArrivee || "" : getAdresseField(adArr, "adresse") || prev.adresseArrivee || "",
          villeArrivee: adArr && typeof adArr === "object" ? adArr.ville || adArr.city || prev.villeArrivee || "" : getAdresseField(devis.villeArrivee, "ville") || prev.villeArrivee || "",
          codePostalArrivee: adArr && typeof adArr === "object" ? adArr.codePostal || adArr.postal_code || prev.codePostalArrivee || "" : getAdresseField(devis.codePostalArrivee, "codePostal") || prev.codePostalArrivee || "",
          paysArrivee: adArr && typeof adArr === "object" ? adArr.pays || adArr.country || prev.paysArrivee || "" : getAdresseField(devis.paysArrivee, "pays") || prev.paysArrivee || ""
        }));
      }
    }
    if (sourceType === "facture" && form.factureID) {
      console.log("🔍 Recherche de facture avec ID:", form.factureID);
      console.log("🔍 Factures disponibles:", factureList.map(f => ({ id: f.factureID || f.invoice?.invoiceId || f.invoiceId || f._id, client: f.client?.name })));
      
      const facture = factureList.find(f =>
        f._id === form.factureID ||
        f.factureID === form.factureID ||
        f.invoice?.invoiceId === form.factureID
      );
      console.log("🔍 Facture trouvée:", facture);
      
      if (facture) {
        const adDep = extractAddressFromFacture(facture, 'depart');
        const adArr = extractAddressFromFacture(facture, 'arrivee');
        console.log("🔍 Adresse départ facture extraite:", adDep);
        console.log("🔍 Adresse arrivée facture extraite:", adArr);
        
        setForm(prev => {
          const newForm = {
            ...prev,
            adresseDepart: adDep?.adresse || adDep?.address || prev.adresseDepart || "",
            villeDepart: adDep?.ville || adDep?.city || prev.villeDepart || "",
            codePostalDepart: adDep?.codePostal || adDep?.postal_code || prev.codePostalDepart || "",
            paysDepart: adDep?.pays || adDep?.country || prev.paysDepart || "",
            adresseArrivee: adArr?.adresse || adArr?.address || prev.adresseArrivee || "",
            villeArrivee: adArr?.ville || adArr?.city || prev.villeArrivee || "",
            codePostalArrivee: adArr?.codePostal || adArr?.postal_code || prev.codePostalArrivee || "",
            paysArrivee: adArr?.pays || adArr?.country || prev.paysArrivee || ""
          };
          
          console.log("🔍 Nouveau formulaire après pré-remplissage:", newForm);
          return newForm;
        });
      } else {
        console.log("❌ Aucune facture trouvée avec l'ID:", form.factureID);
      }
    }
  }, [form.devisID, form.factureID, sourceType, devisList, factureList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mise à jour automatique du sourceType selon la sélection
    if (name === "devisID" && value) {
      setSourceType("devis");
      setForm((prev) => ({ ...prev, [name]: value, factureID: "" }));
    } else if (name === "factureID" && value) {
      setSourceType("facture");
      setForm((prev) => ({ ...prev, [name]: value, devisID: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.ordreTransport || !form.adresseDepart) {
      setError("Le numéro d'ordre et l'adresse de départ sont obligatoires.");
      return;
    }
    // Sécurise la gestion du statut
    let statusToSend = form.status;
    if (!Object.keys(STATUSES).includes(statusToSend)) {
      statusToSend = "PENDING";
    }
    try {
      let societe = null;
      if (!editOrder) {
        // Priorité partenaire du devis/facture
        if (form.devisID) {
          const devis = devisList.find(d => d._id === form.devisID || d.devisID === form.devisID || d.quotation?.quotationId === form.devisID);
          if (devis) {
            societe = buildSocieteFromAny(devis.transporteur) ||
                      buildSocieteFromAny(devis.commissionnaire) ||
                      buildSocieteFromAny(devis.client);
          }
        } else if (form.factureID) {
          const facture = factureList.find(f => f._id === form.factureID || f.factureID === form.factureID || f.invoice?.invoiceId === form.factureID);
          console.log("🔍 Recherche société pour soumission - facture:", facture);
          if (facture) {
            // Priorité : transporteur > commissionnaire > client
            if (facture.transporteur) {
              societe = buildSocieteFromAny(facture.transporteur);
            } else if (facture.commissionnaire) {
              societe = buildSocieteFromAny(facture.commissionnaire);
            } else if (facture.client) {
              societe = buildSocieteFromAny(facture.client);
            }
            console.log("🔍 Société déterminée pour soumission:", societe);
          }
        }
        // Fallback sur transporteur/commissionnaire si pas de partenaire dans le devis/facture
        if (!societe && partnerType === "transporteur" && form.transporteur) {
          const t = transporteurs.find(t => t._id === form.transporteur);
          if (t) societe = buildSocieteFromAny(t);
        } else if (!societe && partnerType === "commissionnaire" && form.commissionnaire) {
          const c = commissionnaires.find(c => c._id === form.commissionnaire);
          if (c) societe = buildSocieteFromAny(c);
        }
        // Fallback sur externalClient uniquement si rien d'autre
        if (!societe && externalClient) {
          societe = buildSocieteFromAny(externalClient);
        }
      } else if (editOrder && societeEdit) {
        societe = societeEdit;
      }
      // Nettoyage des champs "Autre" si non utilisés
      let typeMarchandise = form.typeMarchandise;
      let typeMarchandiseAutre = form.typeMarchandiseAutre;
      if (typeMarchandise !== "Autre") typeMarchandiseAutre = undefined;
      let typeCamion = form.typeCamion;
      let typeCamionAutre = form.typeCamionAutre;
      if (typeCamion !== "Autre") typeCamionAutre = undefined;
      const dataToSend = {
        ordreTransport: form.ordreTransport,
        adresseDepart: form.adresseDepart,
        villeDepart: form.villeDepart,
        codePostalDepart: form.codePostalDepart,
        paysDepart: form.paysDepart,
        dateChargementDepart: form.dateChargementDepart,
        heureChargementDepart: form.heureChargementDepart,
        adresseArrivee: form.adresseArrivee,
        villeArrivee: form.villeArrivee,
        codePostalArrivee: form.codePostalArrivee,
        paysArrivee: form.paysArrivee,
        dateDechargementArrivee: form.dateDechargementArrivee,
        heureDechargementArrivee: form.heureDechargementArrivee,
        typeMarchandise,
        typeMarchandiseAutre,
        typeCamion,
        typeCamionAutre,
        poids: form.poids,
        volume: form.volume,
        nombrePalettes: form.nombrePalettes,
        prix: form.prix,
        status: statusToSend,
        societe: societe,
        devisID: form.devisID,
        factureID: form.factureID,
        sourceType: sourceType
      };
      setLastDataSent(dataToSend);
      console.log('DATA TO SEND (ordre de transport):', dataToSend);
      if (editOrder && editOrder._id) {
        console.log('PUT update - id:', editOrder._id);
        console.log('PUT update - dataToSend:', dataToSend);
        const response = await axios.put(`http://localhost:5000/api/transportOrder/update/${editOrder._id}`, dataToSend);
        if (response.data && response.data.message) {
          setSuccess(response.data.message);
        } else {
          setSuccess("Mise à jour effectuée.");
        }
      } else {
        const response = await axios.post("http://localhost:5000/api/transportOrder/add", dataToSend);
        if (response.data && response.data.message) {
          setSuccess(response.data.message);
        } else {
          setSuccess("Création effectuée.");
        }
      }
      if (onOrderAdded) onOrderAdded();
      if (onClose) onClose();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError(editOrder ? "Erreur lors de la mise à jour de l'ordre !" : "Erreur lors de la création de l'ordre !");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-center">{editOrder ? "Modifier l'ordre de transport" : "Nouvel ordre de transport"}</h2>
        <div className="overflow-y-auto flex-1 pr-2">
          {editOrder && (editOrder.devisID || editOrder.factureID) && (
            <div className="mb-4 text-center text-sm text-blue-700 font-semibold">
              {editOrder.devisID && <span>Devis source : {editOrder.devisID}</span>}
              {editOrder.factureID && <span>Facture source : {editOrder.factureID}</span>}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Numéro d'ordre *</label>
              <input
                type="text"
                name="ordreTransport"
                value={form.ordreTransport}
                readOnly
                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Sélecteur de devis ou facture au tout début */}
            {!editOrder && (
              <>
                <div className="md:col-span-2">
                  <label className="block font-medium">Source de l'ordre *</label>
                  <div className="flex gap-4 mb-2">
                    <label>
                      <input type="radio" name="sourceType" value="devis" checked={sourceType === "devis"} onChange={() => { setSourceType("devis"); setForm(f => ({ ...f, factureID: "" })); }} />
                      <span className="ml-2">Devis</span>
                    </label>
                    <label>
                      <input type="radio" name="sourceType" value="facture" checked={sourceType === "facture"} onChange={() => { setSourceType("facture"); setForm(f => ({ ...f, devisID: "" })); }} />
                      <span className="ml-2">Facture</span>
                    </label>
                  </div>
                </div>
                {sourceType === "devis" && (
                  <div className="md:col-span-2">
                    <label className="block font-medium">Sélectionner un devis *</label>
                    <select name="devisID" value={form.devisID} onChange={handleChange} required className="w-full border rounded p-2">
                      <option value="">Sélectionner...</option>
                      {devisList.map(d => {
                        const id = d.devisID || d.quotation?.quotationId || d.quotationId || d._id;
                        const partenaire = getDevisPartnerName(d);
                        return (
                          <option key={d._id || id} value={id}>
                            {id}{partenaire ? ` - ${partenaire}` : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {sourceType === "facture" && (
                  <div className="md:col-span-2">
                    <label className="block font-medium">Sélectionner une facture *</label>
                    <select name="factureID" value={form.factureID} onChange={handleChange} required className="w-full border rounded p-2">
                      <option value="">Sélectionner...</option>
                      {factureList.map(f => {
                        const id = f.factureID || f.invoice?.invoiceId || f.invoiceId || f._id;
                        // Amélioration de l'affichage du partenaire
                        let partenaire = "";
                        if (f.transporteur) {
                          if (f.transporteur.nom_de_entreprise) partenaire = f.transporteur.nom_de_entreprise;
                          else if (f.transporteur["Nom d'entreprise"]) partenaire = f.transporteur["Nom d'entreprise"];
                          else if (f.transporteur.name && f.transporteur.name.trim() !== "") partenaire = f.transporteur.name;
                          else if (f.transporteur.representant && f.transporteur.representant.trim() !== "") partenaire = f.transporteur.representant;
                          else partenaire = "Transporteur";
                        } else if (f.commissionnaire) {
                          if (f.commissionnaire.nom_de_entreprise) partenaire = f.commissionnaire.nom_de_entreprise;
                          else if (f.commissionnaire.nom_de_entreprise_du_comisionaire) partenaire = f.commissionnaire.nom_de_entreprise_du_comisionaire;
                          else if (f.commissionnaire["Nom d'entreprise"]) partenaire = f.commissionnaire["Nom d'entreprise"];
                          else if (f.commissionnaire.name && f.commissionnaire.name.trim() !== "") partenaire = f.commissionnaire.name;
                          else if (f.commissionnaire.representant && f.commissionnaire.representant.trim() !== "") partenaire = f.commissionnaire.representant;
                          else partenaire = "Commissionnaire";
                        } else if (f.client) {
                          if (f.client.nom_de_entreprise) partenaire = f.client.nom_de_entreprise;
                          else if (f.client["Nom d'entreprise"]) partenaire = f.client["Nom d'entreprise"];
                          else if (f.client.name && f.client.name.trim() !== "") partenaire = f.client.name;
                          else if (f.client.representant && f.client.representant.trim() !== "") partenaire = f.client.representant;
                          else partenaire = "Client";
                        }
                        
                        // Ajout des informations d'adresse si disponibles
                        let adresseInfo = "";
                        if (f.adresseDepart?.ville) {
                          adresseInfo = ` (${f.adresseDepart.ville})`;
                        } else if (f.route?.depart) {
                          adresseInfo = ` (${f.route.depart})`;
                        }
                        
                        return (
                          <option key={f._id || id} value={id}>
                            {id}{partenaire ? ` - ${partenaire}` : ''}{adresseInfo}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </>
            )}
            {/* Bloc infos entreprise harmonisé */}
            <div className="md:col-span-2 my-4">
              {companyLoading ? (
                <div className="text-center text-gray-500 py-4">Chargement des informations de l'entreprise...</div>
              ) : companyInfo && companyInfo.length > 0 ? (
                <div className="rounded-xl shadow border border-gray-200 bg-white p-6 flex flex-col gap-4">
                  <div className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Mon entreprise</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                    <div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Nom</div>
                      <div className="text-base font-bold text-gray-900">{companyInfo[0].name}</div>
                    </div>
                    {companyInfo[0].director_name && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Directeur</div>
                        <div className="text-base text-gray-800">{companyInfo[0].director_name}</div>
                      </div>
                    )}
                    {companyInfo[0].email && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Email</div>
                        <div className="text-base text-gray-800">{companyInfo[0].email}</div>
                      </div>
                    )}
                    {companyInfo[0].phone && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Téléphone</div>
                        <div className="text-base text-gray-800">{companyInfo[0].phone}</div>
                      </div>
                    )}
                    {companyInfo[0].address && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Adresse</div>
                        <div className="text-base text-gray-800">{companyInfo[0].address}</div>
                      </div>
                    )}
                    {(companyInfo[0].postal_code || companyInfo[0].city) && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Ville / Code postal</div>
                        <div className="text-base text-gray-800">{companyInfo[0].postal_code} {companyInfo[0].city}</div>
                      </div>
                    )}
                    {companyInfo[0].country && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Pays</div>
                        <div className="text-base text-gray-800">{companyInfo[0].country}</div>
                      </div>
                    )}
                    {companyInfo[0].taxID && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">N° TVA</div>
                        <div className="text-base text-gray-800">{companyInfo[0].taxID}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            {/* Bloc société partenaire harmonisé */}
            <div className="md:col-span-2 my-4">
              {/* Détermination de la société partenaire à afficher */}
              {(() => {
                let societe = null;
                let titre = "Société partenaire";
                if (editOrder && societeEdit) {
                  societe = societeEdit;
                  if (editOrder.transporteur) titre = "Transporteur";
                  if (editOrder.commissionnaire) titre = "Commissionnaire";
                } else if (!editOrder) {
                  // Mode devis/facture
                  if (sourceType === "devis" && form.devisID) {
                    const devis = devisList.find(d => d._id === form.devisID || d.devisID === form.devisID || d.quotation?.quotationId === form.devisID);
                    if (devis) {
                      societe = devis.transporteur || devis.commissionnaire || devis.client;
                      if (devis.transporteur) titre = "Transporteur (devis)";
                      else if (devis.commissionnaire) titre = "Commissionnaire (devis)";
                      else if (devis.client) titre = "Client (devis)";
                    }
                  } else if (sourceType === "facture" && form.factureID) {
                    const facture = factureList.find(f => f._id === form.factureID || f.factureID === form.factureID || f.invoice?.invoiceId === form.factureID);
                    console.log("🔍 Recherche société partenaire - facture trouvée:", facture);
                    console.log("🔍 sourceType:", sourceType);
                    console.log("🔍 form.factureID:", form.factureID);
                    if (facture) {
                      console.log("🔍 Facture transporteur:", facture.transporteur);
                      console.log("🔍 Facture commissionnaire:", facture.commissionnaire);
                      console.log("🔍 Facture client:", facture.client);
                      
                      // Logs détaillés pour voir la structure des données
                      if (facture.transporteur) {
                        console.log("🔍 Détail transporteur:", {
                          nom_de_entreprise: facture.transporteur.nom_de_entreprise,
                          name: facture.transporteur.name,
                          representant: facture.transporteur.representant,
                          email: facture.transporteur.email,
                          phone: facture.transporteur.phone,
                          street: facture.transporteur.street,
                          city: facture.transporteur.city,
                          zipCode: facture.transporteur.zipCode,
                          country: facture.transporteur.country,
                          taxID: facture.transporteur.taxID,
                          siret: facture.transporteur.siret,
                          registrationNumber: facture.transporteur.registrationNumber
                        });
                      }
                      if (facture.commissionnaire) {
                        console.log("🔍 Détail commissionnaire:", {
                          nom_de_entreprise: facture.commissionnaire.nom_de_entreprise,
                          nom_de_entreprise_du_comisionaire: facture.commissionnaire.nom_de_entreprise_du_comisionaire,
                          name: facture.commissionnaire.name,
                          representant: facture.commissionnaire.representant,
                          email: facture.commissionnaire.email,
                          phone: facture.commissionnaire.phone,
                          street: facture.commissionnaire.street,
                          city: facture.commissionnaire.city,
                          zipCode: facture.commissionnaire.zipCode,
                          country: facture.commissionnaire.country,
                          taxID: facture.commissionnaire.taxID,
                          siret: facture.commissionnaire.siret,
                          registrationNumber: facture.commissionnaire.registrationNumber
                        });
                      }
                      
                      // Priorité : transporteur > commissionnaire > client
                      if (facture.transporteur) {
                        societe = facture.transporteur;
                        titre = "Transporteur (facture)";
                        console.log("✅ Transporteur sélectionné:", societe);
                      } else if (facture.commissionnaire) {
                        societe = facture.commissionnaire;
                        titre = "Commissionnaire (facture)";
                        console.log("✅ Commissionnaire sélectionné:", societe);
                      } else if (facture.client) {
                        societe = facture.client;
                        titre = "Client (facture)";
                        console.log("✅ Client sélectionné:", societe);
                      }
                      console.log("🔍 Société partenaire déterminée:", societe);
                    } else {
                      console.log("❌ Aucune facture trouvée avec l'ID:", form.factureID);
                    }
                  }
                  // Mode sélection directe - seulement si pas de partenaire trouvé dans devis/facture
                  if (!societe && form.transporteur) {
                    societe = transporteurs.find(t => t._id === form.transporteur);
                    titre = "Transporteur";
                  } else if (!societe && form.commissionnaire) {
                    societe = commissionnaires.find(c => c._id === form.commissionnaire);
                    titre = "Commissionnaire";
                  }
                }
                if (!societe) {
                  console.log("❌ Aucun partenaire trouvé pour l'affichage");
                  return <div className="text-center text-gray-500 py-4">Aucun partenaire sélectionné.</div>;
                }
                console.log("✅ Partenaire trouvé pour l'affichage:", societe);
                console.log("✅ Titre:", titre);
                const s = buildSocieteFromAny(societe);
                console.log("✅ Société construite:", s);
                console.log("🔍 SIRET extrait:", s.siret);
                console.log("🔍 Données source complètes:", societe);
                console.log("🔍 Données extraites complètes:", {
                  name: s.name,
                  representant: s.representant,
                  email: s.email,
                  phone: s.phone,
                  street: s.street,
                  zipCode: s.zipCode,
                  city: s.city,
                  country: s.country,
                  taxID: s.taxID,
                  siret: s.siret
                });
                return (
                  <div className="rounded-xl shadow border border-blue-200 bg-white p-6 flex flex-col gap-4">
                    <div className="text-lg font-bold text-blue-800 mb-2 border-b border-blue-100 pb-2">{titre}</div>
                    
                    {/* Informations principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Nom d'entreprise</div>
                        <div className="text-base font-bold text-gray-900">{s.name}</div>
                      </div>
                      {s.representant && (
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Représentant</div>
                          <div className="text-base text-gray-800">{s.representant}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">SIRET</div>
                        <div className="text-base text-gray-800 font-medium">
                          {s.siret ? s.siret : <span className="text-gray-400 italic">Non renseigné</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">N° TVA</div>
                        <div className="text-base text-gray-800 font-medium">
                          {s.taxID ? s.taxID : <span className="text-gray-400 italic">Non renseigné</span>}
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    {(s.email || s.phone) && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Contact</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                          {s.email && (
                            <div>
                              <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Email</div>
                              <div className="text-base text-gray-800">{s.email}</div>
                            </div>
                          )}
                          {s.phone && (
                            <div>
                              <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Téléphone</div>
                              <div className="text-base text-gray-800">{s.phone}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Adresse - Toujours affichée */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Adresse</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                        {s.street ? (
                          <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Rue</div>
                            <div className="text-base text-gray-800">{s.street}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Rue</div>
                            <div className="text-base text-gray-400 italic">Non renseignée</div>
                          </div>
                        )}
                        {(s.zipCode || s.city) ? (
                          <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Ville / Code postal</div>
                            <div className="text-base text-gray-800">{s.zipCode} {s.city}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Ville / Code postal</div>
                            <div className="text-base text-gray-400 italic">Non renseigné</div>
                          </div>
                        )}
                        {s.country ? (
                          <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Pays</div>
                            <div className="text-base text-gray-800">{s.country}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Pays</div>
                            <div className="text-base text-gray-400 italic">Non renseigné</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations complémentaires */}
                    {(s.website || s.industry || s.description || s.linkedin || s.twitter) && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Informations complémentaires</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                          {s.website && (
                            <div>
                              <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Site web</div>
                              <div className="text-base text-gray-800">{s.website}</div>
                            </div>
                          )}
                          {s.industry && (
                            <div>
                              <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Secteur d'activité</div>
                              <div className="text-base text-gray-800">{s.industry}</div>
                            </div>
                          )}
                          {s.linkedin && (
                            <div>
                              <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">LinkedIn</div>
                              <div className="text-base text-gray-800">{s.linkedin}</div>
                            </div>
                          )}
                          {s.twitter && (
                            <div>
                              <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Twitter</div>
                              <div className="text-base text-gray-800">{s.twitter}</div>
                            </div>
                          )}
                        </div>
                        {s.description && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Description</div>
                            <div className="text-base text-gray-800">{s.description}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div>
              <label className="block font-medium">Type de marchandise</label>
              <select
                name="typeMarchandise"
                value={form.typeMarchandise}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Sélectionner...</option>
                {GOODS_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {form.typeMarchandise === "Autre" && (
                <input
                  type="text"
                  name="typeMarchandiseAutre"
                  placeholder="Précisez le type de marchandise"
                  value={form.typeMarchandiseAutre || ""}
                  onChange={e => setForm(prev => ({ ...prev, typeMarchandiseAutre: e.target.value }))}
                  className="w-full border rounded p-2 mt-2"
                />
              )}
            </div>
            <div>
              <label className="block font-medium">Type de camion</label>
              <select
                name="typeCamion"
                value={form.typeCamion}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Sélectionner...</option>
                {TRUCK_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {form.typeCamion === "Autre" && (
                <input
                  type="text"
                  name="typeCamionAutre"
                  placeholder="Précisez le type de camion"
                  value={form.typeCamionAutre || ""}
                  onChange={e => setForm(prev => ({ ...prev, typeCamionAutre: e.target.value }))}
                  className="w-full border rounded p-2 mt-2"
                />
              )}
            </div>
            <div>
              <label className="block font-medium">Poids</label>
              <input type="text" name="poids" value={form.poids} onChange={handleChange} className="w-full border rounded p-2" placeholder="ex: 1500 kg" />
            </div>
            <div>
              <label className="block font-medium">Volume</label>
              <input type="text" name="volume" value={form.volume} onChange={handleChange} className="w-full border rounded p-2" placeholder="ex: 12 m³" />
            </div>
            <div>
              <label className="block font-medium">Nombre de palettes</label>
              <input type="number" name="nombrePalettes" value={form.nombrePalettes} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-medium">Prix (€)</label>
              <input type="number" name="prix" value={form.prix} onChange={handleChange} className="w-full border rounded p-2" />
            </div>

            {/* Départ */}
            <AdresseFields prefix="Depart" form={form} handleChange={handleChange} required={true} title="Départ" />

            {/* Arrivée */}
            <AdresseFields prefix="Arrivee" form={form} handleChange={handleChange} required={false} title="Arrivée" />

            {/* Statut */}
            <div className="md:col-span-2">
              <label className="block font-medium">Statut</label>
              <select name="status" value={form.status || 'PENDING'} onChange={handleChange} className="w-full border rounded p-2">
                {Object.entries(STATUSES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                {STATUSES[form.status]?.description}
              </div>
            </div>

            {error && <div className="md:col-span-2 text-red-500">{error}</div>}
            {success && <div className="md:col-span-2 text-green-600 font-semibold">{success}</div>}
            {lastDataSent && success && (
              <div className="md:col-span-2 mt-6 p-4 bg-gray-50 border border-gray-200 rounded shadow-sm">
                <div className="font-semibold text-gray-700 mb-2">Résumé des données envoyées :</div>
                <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">{JSON.stringify(lastDataSent, null, 2)}</pre>
              </div>
            )}
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editOrder ? "Mettre à jour" : "Créer"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTransportOrder; 