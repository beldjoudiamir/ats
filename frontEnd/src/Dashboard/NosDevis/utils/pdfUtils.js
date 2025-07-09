import jsPDF from "jspdf";

// Fonction pour charger une image et la convertir en base64
async function loadImageAsBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = function () {
      reject(new Error("Impossible de charger l'image"));
    };

    img.src = imageUrl;
  });
}

export async function generateDevisPDF(devis) {
  console.log("🔍 Données du devis reçues:", devis);
  console.log("🔍 Informations de l'entreprise:", devis.companyInfo);

  const doc = new jsPDF();

  // Ajouter le logo de l'entreprise
  if (devis.companyInfo?.logo) {
    try {
      let logoUrl = devis.companyInfo.logo;
      if (logoUrl.startsWith("/")) {
        logoUrl = `http://localhost:5000${logoUrl}`;
      }
      const logoBase64 = await loadImageAsBase64(logoUrl);
      doc.addImage(logoBase64, "JPEG", 10, 10, 40, 20);
    } catch (error) {
      console.error("Erreur logo:", error);
      doc.setFontSize(12);
      doc.setTextColor(13, 71, 161);
      doc.setFont("helvetica", "bold");
      doc.text(devis.companyInfo.name || "LOGO", 10, 20);
      doc.setDrawColor(13, 71, 161);
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 50, 25);
    }
  } else {
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text("[Logo]", 10, 25);
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Devis N° ${devis.devisID || ""}`, 120, 20);
  doc.setFontSize(10);
  doc.text(`Date : ${devis.date ? new Date(devis.date).toLocaleDateString() : new Date().toLocaleDateString()}`, 120, 30);

  // Infos entreprise
  let y = 40;
  if (devis.companyInfo) {
    doc.setFontSize(14);
    doc.text("Entreprise :", 15, y);
    doc.setFontSize(11);
    doc.text(`${devis.companyInfo.name || ""}`, 15, y + 6);
    doc.text(`${devis.companyInfo.address || ""}`, 15, y + 12);
    doc.text(`${devis.companyInfo.postal_code || ""} ${devis.companyInfo.city || ""}, ${devis.companyInfo.country || ""}`, 15, y + 18);
    doc.text(`Téléphone : ${devis.companyInfo.phone || ""}`, 15, y + 24);
    doc.text(`Email : ${devis.companyInfo.email || ""}`, 15, y + 30);
    doc.text(`TVA : ${devis.companyInfo.taxID || ""}`, 15, y + 36);
    const siret = devis.companyInfo.siret || devis.companyInfo.registrationNumber || devis.companyInfo.siren;
    if (siret) {
      doc.text(`SIRET : ${siret}`, 15, y + 42);
      y += 50;
    } else {
      y += 44;
    }
  }

  // Infos partenaire avec adresse complète
  let partenaire = devis.transporteur || devis.commissionnaire || devis.client;
  let titre = devis.transporteur ? "Transporteur :" : devis.commissionnaire ? "Commissionnaire :" : "Client :";

  if (partenaire) {
    doc.setFontSize(14);
    doc.text(titre, 120, 40);
    doc.setFontSize(11);
    doc.text(`${partenaire.nom_de_entreprise || partenaire.nom_de_entreprise_du_comisionaire || partenaire.name || ""}`, 120, 46);
    
    // Adresse complète du partenaire (gestion des différents formats)
    const adresse = partenaire.street || partenaire.adresse;
    const codePostal = partenaire.zipCode || partenaire.code_postal;
    const ville = partenaire.city || partenaire.ville;
    const pays = partenaire.country || partenaire.pays;
    
    if (adresse) {
      doc.text(`${adresse}`, 120, 52);
    }
    if (codePostal || ville) {
      doc.text(`${codePostal || ""} ${ville || ""}`, 120, 58);
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
    
    const partenaireSiret = partenaire.siret || partenaire.registrationNumber || partenaire.siren || partenaire.numeroSiret;
    if (partenaireSiret) {
      doc.text(`SIRET : ${partenaireSiret}`, 120, 88);
    }
  }

  // Départ/Arrivée avec adresses complètes
  y += 10;
  doc.setFontSize(13);
  doc.text("Départ :", 15, y);
  doc.setFontSize(11);
  
  // Adresse de départ complète
  if (devis.adresseDepart) {
    const depart = devis.adresseDepart;
    doc.text(`${depart.adresse || ""}`, 35, y);
    doc.text(`${depart.codePostal || ""} ${depart.ville || ""}`, 35, y + 6);
    doc.text(`${depart.pays || ""}`, 35, y + 12);
  } else {
    doc.text(`${devis.route?.depart || ""}`, 35, y);
  }
  
  doc.setFontSize(13);
  doc.text("Arrivée :", 90, y);
  doc.setFontSize(11);
  
  // Adresse d'arrivée complète
  if (devis.adresseArrivee) {
    const arrivee = devis.adresseArrivee;
    doc.text(`${arrivee.adresse || ""}`, 115, y);
    doc.text(`${arrivee.codePostal || ""} ${arrivee.ville || ""}`, 115, y + 6);
    doc.text(`${arrivee.pays || ""}`, 115, y + 12);
  } else {
    doc.text(`${devis.route?.arrivee || ""}`, 115, y);
  }
  
  y += 18; // Plus d'espace pour les adresses complètes

  // Message lié au devis avec bordure
  if (devis.message && devis.message.trim()) {
    doc.setFontSize(13);
    doc.text("Message lié au devis :", 15, y);
    doc.setFontSize(10);
    
    // Calculer la hauteur nécessaire pour le message
    const messageLines = doc.splitTextToSize(devis.message, 170); // Largeur maximale
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

  (devis.items || []).forEach(item => {
    doc.text(`${item.description || ""}`, 15, y);
    doc.text(`${item.quantity || 1}`.toString(), 90, y);
    doc.text(`${item.price || 0}`.toString(), 110, y);
    doc.text(`${devis.tvaRate || 0}%`, 140, y);
    const totalLigne = (item.quantity || 1) * (item.price || 0);
    doc.text(`${totalLigne.toFixed(2)}`, 170, y);
    y += 6;
  });

  y += 4;
  doc.line(15, y, 195, y);
  y += 8;

  // Totaux
  doc.setFontSize(12);
  doc.text(`Total HT : ${devis.totalHT?.toFixed(2) || "0.00"} €`, 140, y);
  y += 6;
  doc.text(`TVA (${devis.tvaRate || 0}%) : ${devis.tva?.toFixed(2) || "0.00"} €`, 140, y);
  y += 6;
  doc.setFontSize(13);
  doc.text(`Total TTC : ${devis.totalTTC?.toFixed(2) || "0.00"} €`, 140, y);

  // Footer
  doc.setFontSize(10);
  doc.text("Date et signature du client (Précédée de la mention ‘Bon pour accord’)", 15, 255);

  // Téléchargement
  doc.save(`devis_${devis.devisID || ""}.pdf`);
}
