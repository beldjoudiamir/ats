import jsPDF from "jspdf";
import "jspdf-autotable";
import API_BASE_URL from "../../../config/api.js";

// Fonction pour charger une image et la convertir en base64
async function loadImageAsBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = function() {
      reject(new Error('Impossible de charger l\'image'));
    };
    
    img.src = imageUrl;
  });
}

export async function generateFacturePDF(facture) {
  console.log("🔍 Données de la facture reçues:", facture);
  
  // Récupération des conditions de transport pour les coordonnées bancaires
  let conditionsTransport = null;
  try {
    const response = await fetch(`${API_BASE_URL}/api/conditionsTransport`);
    if (response.ok) {
      const data = await response.json();
      conditionsTransport = data[0]; // Prendre le premier enregistrement
      console.log("✅ Conditions de transport récupérées:", conditionsTransport);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des conditions:", error);
  }
  console.log("🔍 Informations de l'entreprise:", facture.companyInfo);
  
  const doc = new jsPDF();
  
  // Ajouter le logo de l'entreprise en haut à gauche (même taille que navbar)
  if (facture.companyInfo && facture.companyInfo.logo) {
    console.log("🔍 Logo trouvé:", facture.companyInfo.logo);
    
    try {
      // Construire l'URL complète du logo
      let logoUrl = facture.companyInfo.logo;
      if (logoUrl && !logoUrl.startsWith('http')) {
        logoUrl = `${API_BASE_URL}${logoUrl}`;
      }
      
      console.log("🔍 URL du logo:", logoUrl);
      
      // Charger l'image et la convertir en base64
      const logoBase64 = await loadImageAsBase64(logoUrl);
      console.log("✅ Logo chargé avec succès");
      
      // Ajouter le logo au PDF (plus petit pour ne pas chevaucher les infos)
      doc.addImage(logoBase64, 'JPEG', 10, 10, 40, 20);
      
    } catch (error) {
      console.log("❌ Erreur lors du chargement du logo:", error);
      // Fallback : afficher le nom de l'entreprise
      doc.setFontSize(12);
      doc.setTextColor(13, 71, 161);
      doc.setFont("helvetica", "bold");
      doc.text(facture.companyInfo.name || "LOGO", 10, 20);
      
      // Ajouter une bordure pour simuler un logo
      doc.setDrawColor(13, 71, 161);
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 50, 25);
    }
  } else {
    // Placeholder si pas de logo
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text("[Logo]", 10, 25);
  }
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Facture N° ${facture.factureID || ''}`, 120, 20);
  doc.setFontSize(10);
  doc.text(`Date : ${facture.date ? new Date(facture.date).toLocaleDateString() : new Date().toLocaleDateString()}`, 120, 30);

  // Infos entreprise
  let y = 40;
  if (facture.companyInfo) {
    doc.setFontSize(14);
    doc.text("Entreprise :", 15, y);
    doc.setFontSize(11);
    doc.text(`${facture.companyInfo.name || ''}`, 15, y + 6);
    doc.text(`${facture.companyInfo.address || ''}`, 15, y + 12);
    doc.text(`${facture.companyInfo.postal_code || ''} ${facture.companyInfo.city || ''}, ${facture.companyInfo.country || ''}`, 15, y + 18);
    doc.text(`Téléphone : ${facture.companyInfo.phone || ''}`, 15, y + 24);
    doc.text(`Email : ${facture.companyInfo.email || ''}`, 15, y + 30);
    doc.text(`TVA : ${facture.companyInfo.taxID || ''}`, 15, y + 36);
    
    // Vérifier plusieurs champs possibles pour le SIRET
    const siret = facture.companyInfo.siret || facture.companyInfo.registrationNumber || facture.companyInfo.siren;
    console.log("🔍 SIRET trouvé:", siret);
    
    if (siret) {
      doc.text(`SIRET : ${siret}`, 15, y + 42);
      y += 50;
    } else {
      y += 44;
    }
  }

  // Infos partenaire à droite (transporteur > commissionnaire > client pour les factures)
  let partenaire = null;
  let titre = "";
  console.log("🔍 Recherche du partenaire dans la facture:");
  console.log("🔍 Transporteur:", facture.transporteur);
  console.log("🔍 Commissionnaire:", facture.commissionnaire);
  console.log("🔍 Client:", facture.client);
  
  if (facture.transporteur) {
    partenaire = facture.transporteur;
    titre = "Transporteur :";
    console.log("✅ Transporteur sélectionné");
  } else if (facture.commissionnaire) {
    partenaire = facture.commissionnaire;
    titre = "Commissionnaire :";
    console.log("✅ Commissionnaire sélectionné");
  } else if (facture.client) {
    partenaire = facture.client;
    titre = "Client :";
    console.log("✅ Client sélectionné");
  } else {
    console.log("❌ Aucun partenaire trouvé");
  }
  if (partenaire) {
    console.log("🔍 Partenaire trouvé:", partenaire);
    
    // Logo du partenaire (si disponible)
    if (partenaire.logo) {
      try {
        let partenaireLogoUrl = partenaire.logo;
        if (partenaireLogoUrl && !partenaireLogoUrl.startsWith('http')) {
          partenaireLogoUrl = `${API_BASE_URL}${partenaireLogoUrl}`;
        }
        const partenaireLogoBase64 = await loadImageAsBase64(partenaireLogoUrl);
        doc.addImage(partenaireLogoBase64, 'JPEG', 120, 10, 30, 15);
      } catch (error) {
        console.log("❌ Erreur lors du chargement du logo du partenaire:", error);
      }
    }
    
    doc.setFontSize(14);
    doc.text(titre, 120, 40);
    doc.setFontSize(11);
    doc.text(`${partenaire.nom_de_entreprise_du_comisionaire || partenaire.nom_de_entreprise || partenaire.name || ''}`, 120, 46);
    
    // Adresse complète du partenaire (gestion des différents formats)
    const adresse = partenaire.street || partenaire.adresse;
    const codePostal = partenaire.zipCode || partenaire.code_postal || partenaire.code_postal;
    const ville = partenaire.city || partenaire.ville;
    const pays = partenaire.country || partenaire.pays;
    
    if (adresse) {
      doc.text(`${adresse}`, 120, 52);
    }
    if (codePostal || ville) {
      doc.text(`${codePostal || ''} ${ville || ''}`, 120, 58);
    }
    if (pays) {
      doc.text(`${pays}`, 120, 64);
    }
    
    // Informations de contact
    if (partenaire.email) {
      doc.text(`Email : ${partenaire.email}`, 120, 70);
    }
    if (partenaire.phone) {
      doc.text(`Téléphone : ${partenaire.phone}`, 120, 76);
    }
    if (partenaire.taxID || partenaire.tva) {
      doc.text(`TVA : ${partenaire.taxID || partenaire.tva}`, 120, 82);
    }
    
    console.log("🔍 Vérification des champs SIRET du partenaire:");
    console.log("🔍 partenaire.siret:", partenaire.siret);
    console.log("🔍 partenaire.registrationNumber:", partenaire.registrationNumber);
    console.log("🔍 partenaire.siren:", partenaire.siren);
    console.log("🔍 partenaire.numeroSiret:", partenaire.numeroSiret);
    console.log("🔍 partenaire.registrationNumber:", partenaire.registrationNumber);
    
    const partenaireSiret = partenaire.siret || partenaire.registrationNumber || partenaire.siren || partenaire.numeroSiret;
    console.log("🔍 SIRET du partenaire trouvé:", partenaireSiret);
    console.log("🔍 Tous les champs du partenaire:", partenaire);
    
    if (partenaireSiret) {
      console.log("✅ Affichage du SIRET:", partenaireSiret);
      doc.text(`SIRET : ${partenaireSiret}`, 120, 88);
    } else {
      console.log("❌ Aucun SIRET trouvé pour le partenaire");
    }
  }

  // Infos Départ/Arrivée avec adresses complètes (seulement si des données existent)
  let hasDepartData = false;
  let hasArriveeData = false;
  
  // Vérifier s'il y a des données de départ
  if (facture.adresseDepart && (
    facture.adresseDepart.adresse || 
    facture.adresseDepart.ville || 
    facture.adresseDepart.codePostal || 
    facture.adresseDepart.pays
  )) {
    hasDepartData = true;
  } else if (facture.route?.depart && facture.route.depart.trim()) {
    hasDepartData = true;
  }
  
  // Vérifier s'il y a des données d'arrivée
  if (facture.adresseArrivee && (
    facture.adresseArrivee.adresse || 
    facture.adresseArrivee.ville || 
    facture.adresseArrivee.codePostal || 
    facture.adresseArrivee.pays
  )) {
    hasArriveeData = true;
  } else if (facture.route?.arrivee && facture.route.arrivee.trim()) {
    hasArriveeData = true;
  }
  
  // Afficher seulement s'il y a des données
  if (hasDepartData || hasArriveeData) {
    y += 10;
    doc.setFontSize(13);
    
    if (hasDepartData) {
      doc.text("Départ :", 15, y);
      doc.setFontSize(11);
      
      // Adresse de départ complète
      if (facture.adresseDepart) {
        const depart = facture.adresseDepart;
        if (depart.adresse) doc.text(`${depart.adresse}`, 35, y);
        if (depart.codePostal || depart.ville) doc.text(`${depart.codePostal || ''} ${depart.ville || ''}`, 35, y + 6);
        if (depart.pays) doc.text(`${depart.pays}`, 35, y + 12);
      } else {
        doc.text(`${facture.route?.depart || ''}`, 35, y);
      }
    }
    
    if (hasArriveeData) {
      doc.text("Arrivée :", 90, y);
      doc.setFontSize(11);
      
      // Adresse d'arrivée complète
      if (facture.adresseArrivee) {
        const arrivee = facture.adresseArrivee;
        if (arrivee.adresse) doc.text(`${arrivee.adresse}`, 115, y);
        if (arrivee.codePostal || arrivee.ville) doc.text(`${arrivee.codePostal || ''} ${arrivee.ville || ''}`, 115, y + 6);
        if (arrivee.pays) doc.text(`${arrivee.pays}`, 115, y + 12);
      } else {
        doc.text(`${facture.route?.arrivee || ''}`, 115, y);
      }
    }
    
    y += 18; // Plus d'espace pour les adresses complètes
  }

  // Message lié à la facture avec bordure
  if (facture.message && facture.message.trim()) {
    doc.setFontSize(13);
    doc.text("Message lié à la facture :", 15, y);
    doc.setFontSize(10);
    
    // Calculer la hauteur nécessaire pour le message
    const messageLines = doc.splitTextToSize(facture.message, 170); // Largeur maximale
    const messageHeight = messageLines.length * 4 + 8; // Hauteur du message + padding
    
    // Dessiner la bordure
    doc.setDrawColor(200, 200, 200); // Couleur grise pour la bordure
    doc.setLineWidth(0.5);
    doc.rect(10, y + 2, 180, messageHeight);
    
    // Afficher le message à l'intérieur de la bordure
    messageLines.forEach((line, index) => {
      if (y + 8 + (index * 4) < 280) { // Vérifier qu'on ne dépasse pas la page
        doc.text(line, 15, y + 8 + (index * 4));
      }
    });
    
    y += messageHeight + 6; // Espacement après le message avec bordure
  }

  // Tableau des articles (sans titre)
  doc.setFontSize(11);
  doc.text("Description", 15, y);
  doc.text("Qté", 90, y);
  doc.text("Prix (€)", 110, y);
  doc.text("TVA", 140, y);
  doc.text("Total (€)", 170, y);
  y += 4;
  doc.setLineWidth(0.1);
  doc.line(15, y, 195, y);
  y += 6;
  (facture.items || []).forEach((item, idx) => {
    doc.text(`${item.description || ''}`, 15, y);
    doc.text(`${item.quantity || 1}`.toString(), 90, y);
    doc.text(`${item.price || 0}`.toString(), 110, y);
    doc.text(`${facture.tvaRate || 0}%`, 140, y);
    const totalLigne = (item.quantity || 1) * (item.price || 0);
    doc.text(`${totalLigne.toFixed(2)}`, 170, y);
    y += 6;
  });
  y += 4;
  doc.line(15, y, 195, y);
  y += 8;
  // Totaux
  doc.setFontSize(12);
  doc.text(`Total HT : ${facture.totalHT ? facture.totalHT.toFixed(2) : '0.00'} €`, 140, y);
  y += 6;
  doc.text(`TVA (${facture.tvaRate || 0}%) : ${facture.tva ? facture.tva.toFixed(2) : '0.00'} €`, 140, y);
  y += 6;
  doc.setFontSize(13);
  doc.text(`Total TTC : ${facture.totalTTC ? facture.totalTTC.toFixed(2) : '0.00'} €`, 140, y);
  
  // Coordonnées bancaires et délai de paiement
  if (conditionsTransport && conditionsTransport.paiement) {
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(13, 71, 161);
    doc.text("Informations de paiement :", 15, y);
    doc.setFontSize(10);
    doc.setTextColor(33, 33, 33);
    
    // Délai de paiement
    if (conditionsTransport.paiement.delaiPaiement) {
      y += 6;
      doc.text(`Délai de paiement : ${conditionsTransport.paiement.delaiPaiement}`, 15, y);
    }
    
    // Coordonnées bancaires
    if (conditionsTransport.paiement.coordonneesBancaires) {
      const cb = conditionsTransport.paiement.coordonneesBancaires;
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(13, 71, 161);
      doc.text("Coordonnées bancaires :", 15, y);
      doc.setFontSize(10);
      doc.setTextColor(33, 33, 33);
      
      if (cb.nomBanque) {
        y += 5;
        doc.text(`Banque : ${cb.nomBanque}`, 15, y);
      }
      if (cb.iban) {
        y += 4;
        doc.text(`IBAN : ${cb.iban}`, 15, y);
      }
      if (cb.bic) {
        y += 4;
        doc.text(`BIC : ${cb.bic}`, 15, y);
      }
    }
    
    // Pénalités de retard (positionnée vers la fin de la page)
    if (conditionsTransport.paiement.penaliteRetard) {
      // Positionner la note vers la fin de la page (y = 250)
      doc.setFontSize(6);
      doc.setTextColor(0, 0, 0); // Noir
      doc.text(`Note : ${conditionsTransport.paiement.penaliteRetard}`, 15, 280);
    }
  }
  
  // Footer
  doc.setFontSize(10);
  //doc.text("Date et signature du client (Précédée de la mention 'Bon pour accord')", 15, 255);
  // Téléchargement
  doc.save(`facture_${facture.factureID || ''}.pdf`);
} 