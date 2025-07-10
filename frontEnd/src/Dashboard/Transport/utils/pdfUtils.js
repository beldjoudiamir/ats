import jsPDF from "jspdf";
import axios from "axios";
import "jspdf-autotable";
import API_BASE_URL from "../../../config/api.js";

export async function generateTransportOrderPDF(order, companyInfo = {}) {
  try {
    console.log("Début de la génération du PDF pour l'ordre:", order.ordreTransport);
    
    if (!order) {
      console.error("Erreur: order est requis pour générer le PDF");
      return;
    }

    // Récupérer les conditions de transport depuis l'API
    let conditionsTransport = null;
    try {
      console.log("Récupération des conditions de transport...");
      const conditionsResponse = await axios.get(`${API_BASE_URL}/api/conditionsTransport`);
      console.log("Réponse API conditions:", conditionsResponse.data);
      if (conditionsResponse.data && conditionsResponse.data.length > 0) {
        conditionsTransport = conditionsResponse.data[0]; // Prendre la première condition
        console.log("Conditions de transport trouvées:", conditionsTransport);
      } else {
        console.log("Aucune condition de transport trouvée");
      }
    } catch (error) {
      console.warn("Impossible de récupérer les conditions de transport:", error);
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = 297;
    const margin = 15;
    let y = margin;

    doc.setFillColor(227, 242, 253); // fond bleu clair
    doc.rect(0, 0, pageWidth, 210, "F");

    doc.setFont("helvetica", "");
    doc.setFontSize(16);
    doc.setTextColor(13, 71, 161);
    doc.text(`Ordre de Transport N° ${order.ordreTransport || ""}`, pageWidth / 2, y + 6, { align: "center" });

    y += 12;
    
    // --- Informations SIRET de l'ordre ---
    if (order.siret || order.taxID) {
      doc.setFontSize(10);
      doc.setTextColor(13, 71, 161);
      doc.text("Informations fiscales de l'ordre :", margin, y);
      doc.setFontSize(8);
      doc.setTextColor(33, 33, 33);
      let ySiret = y + 5;
      
      if (order.siret) {
        doc.text(`SIRET : ${order.siret}`, margin, ySiret);
        ySiret += 4;
      }
      if (order.taxID) {
        doc.text(`TVA : ${order.taxID}`, margin, ySiret);
        ySiret += 4;
      }
      
      y = ySiret + 5;
    }
    
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(8);

    // --- Blocs entreprise à gauche & transporteur à droite ---
    const blocW = 95, blocH = 32;
    const blocPadding = 6;
    const xBlocLeft = margin;
    const xBlocRight = pageWidth - blocW - margin;
    const yBloc = y;

    // Bloc entreprise
    doc.setFillColor(187, 222, 251);
    doc.roundedRect(xBlocLeft, yBloc, blocW, blocH, 3, 3, "F");
    let yLigne = yBloc + 5;
    if (companyInfo.name) {
      doc.text(companyInfo.name, xBlocLeft + 3, yLigne, { maxWidth: blocW - 6 });
      yLigne += 4;
    }
    const address = [companyInfo.address, companyInfo.city, companyInfo.postal_code, companyInfo.country].filter(Boolean).join(", ");
    if (address) {
      doc.text(address, xBlocLeft + 3, yLigne, { maxWidth: blocW - 6 });
      yLigne += 4;
    }
    const phone = companyInfo.phone || companyInfo.telephone || "";
    const email = companyInfo.email || "";
    const contactInfo = [phone && `Tél : ${phone}`, email && `Email : ${email}`].filter(Boolean).join(" - ");
    if (contactInfo) {
      doc.text(contactInfo, xBlocLeft + 3, yLigne, { maxWidth: blocW - 6 });
      yLigne += 4;
    }
    if (companyInfo.taxID && companyInfo.siret) {
      doc.text(`TVA : ${companyInfo.taxID} - SIRET : ${companyInfo.siret}`, xBlocLeft + 3, yLigne, { maxWidth: blocW - 6 });
      yLigne += 4;
    }

    // Bloc partenaire (transporteur)
    doc.setFillColor(255, 236, 140);
    doc.roundedRect(xBlocRight, yBloc, blocW, blocH, 3, 3, "F");
    let ySoc = yBloc + 5;
    const partenaire =
      (order.societe && order.societe.name && order.societe) ||
      (order.transporteur && order.transporteur.name && order.transporteur) ||
      (order.commissionnaire && (order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name) && order.commissionnaire) ||
      (order.client && order.client.name && order.client);

    if (partenaire) {
      const partenaireName = partenaire.name || partenaire.nom_de_entreprise_du_comisionaire || "";
      if (partenaireName) {
        doc.text(partenaireName, xBlocRight + 3, ySoc, { maxWidth: blocW - 6 });
        ySoc += 4;
      }
      
      // Amélioration de l'affichage de l'adresse
      const partenaireStreet = partenaire.street || partenaire.adresse || "";
      const partenaireCity = partenaire.city || partenaire.ville || "";
      const partenaireZipCode = partenaire.zipCode || partenaire.codePostal || "";
      const partenaireCountry = partenaire.country || partenaire.pays || "";
      
      if (partenaireStreet) {
        doc.text(partenaireStreet, xBlocRight + 3, ySoc, { maxWidth: blocW - 6 });
        ySoc += 4;
      }
      
      const partenaireCityZip = [partenaireZipCode, partenaireCity].filter(Boolean).join(" ");
      if (partenaireCityZip) {
        doc.text(partenaireCityZip, xBlocRight + 3, ySoc, { maxWidth: blocW - 6 });
        ySoc += 4;
      }
      
      if (partenaireCountry) {
        doc.text(partenaireCountry, xBlocRight + 3, ySoc, { maxWidth: blocW - 6 });
        ySoc += 4;
      }
      
      const partenaireContact = [partenaire.phone && `Tél : ${partenaire.phone}`, partenaire.email && `Email : ${partenaire.email}`].filter(Boolean).join(" - ");
      if (partenaireContact) {
        doc.text(partenaireContact, xBlocRight + 3, ySoc, { maxWidth: blocW - 6 });
        ySoc += 4;
      }
      
      // Amélioration de l'affichage des informations fiscales
      const partenaireTaxID = partenaire.taxID || partenaire.tva || "";
      const partenaireSiret = partenaire.siret || partenaire.registrationNumber || "";
      
      if (partenaireTaxID || partenaireSiret) {
        let fiscalInfo = "";
        if (partenaireTaxID) fiscalInfo += `TVA : ${partenaireTaxID}`;
        if (partenaireTaxID && partenaireSiret) fiscalInfo += " - ";
        if (partenaireSiret) fiscalInfo += `SIRET : ${partenaireSiret}`;
        doc.text(fiscalInfo, xBlocRight + 3, ySoc, { maxWidth: blocW - 6 });
        ySoc += 4;
      }
    }

    y += blocH + 6;

    // --- Blocs Départ & Arrivée ---
    const blocW2 = 120, blocH2 = 35;
    const xDep = margin;
    const xArr = pageWidth - blocW2 - margin;
    const yBloc2 = y;

    // Bloc Départ
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(xDep, yBloc2, blocW2, blocH2, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(56, 142, 60);
    doc.text("Départ", xDep + 4, yBloc2 + 5);
    doc.setFontSize(7);
    doc.setTextColor(33, 33, 33);
    let yDep = yBloc2 + 10;
    doc.text(`${order.villeDepart || ""} ${order.codePostalDepart || ""}, ${order.paysDepart || ""}`, xDep + 4, yDep);
    yDep += 4;
    doc.text(`Adresse : ${order.adresseDepart || ""}`, xDep + 4, yDep);
    yDep += 4;
    doc.text(`Date/Heure : ${order.dateChargementDepart || ""} ${order.heureChargementDepart || ""}`, xDep + 4, yDep);

    // Bloc Arrivée
    doc.setFillColor(255, 249, 196);
    doc.roundedRect(xArr, yBloc2, blocW2, blocH2, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(251, 140, 0);
    doc.text("Arrivée", xArr + 4, yBloc2 + 5);
    doc.setFontSize(7);
    doc.setTextColor(33, 33, 33);
    let yArr = yBloc2 + 10;
    doc.text(`${order.villeArrivee || ""} ${order.codePostalArrivee || ""}, ${order.paysArrivee || ""}`, xArr + 4, yArr);
    yArr += 4;
    doc.text(`Adresse : ${order.adresseArrivee || ""}`, xArr + 4, yArr);
    yArr += 4;
    doc.text(`Date/Heure : ${order.dateDechargementArrivee || ""} ${order.heureDechargementArrivee || ""}`, xArr + 4, yArr);

    y += blocH2 + 6;

    // --- Détails du transport ---
    doc.setFontSize(9);
    doc.setTextColor(13, 71, 161);
    doc.text("Détails du transport :", margin, y);
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(7);
    let yDet = y + 5;
    const colW = (pageWidth - 2 * margin - 20) / 3;
    const x1 = margin;
    const x2 = margin + colW + 10;
    const x3 = margin + 2 * (colW + 10);

    doc.text(`Type de marchandise : ${order.typeMarchandise || "-"}`, x1, yDet, { maxWidth: colW });
    doc.text(`Type de camion : ${order.typeCamion || "-"}`, x2, yDet, { maxWidth: colW });
    doc.text(`Poids : ${order.poids || "-"}`, x3, yDet, { maxWidth: colW });
    yDet += 6;
    doc.text(`Volume : ${order.volume || "-"}`, x1, yDet, { maxWidth: colW });
    doc.text(`Nombre de palettes : ${order.nombrePalettes || "-"}`, x2, yDet, { maxWidth: colW });
    doc.text(`Prix (€) : ${order.prix || "-"}`, x3, yDet, { maxWidth: colW });
    yDet += 6;
    
    // Informations fiscales du partenaire dans les détails
    const partenaireDetails = 
      (order.societe && order.societe.name && order.societe) ||
      (order.transporteur && order.transporteur.name && order.transporteur) ||
      (order.commissionnaire && (order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name) && order.commissionnaire) ||
      (order.client && order.client.name && order.client);
    
    if (partenaireDetails) {
      const partenaireSiret = partenaireDetails.siret || partenaireDetails.registrationNumber || "";
      const partenaireTaxID = partenaireDetails.taxID || partenaireDetails.tva || "";
      
      if (partenaireSiret || partenaireTaxID) {
        doc.text(`SIRET partenaire : ${partenaireSiret || "-"}`, x1, yDet, { maxWidth: colW });
        doc.text(`TVA partenaire : ${partenaireTaxID || "-"}`, x2, yDet, { maxWidth: colW });
        doc.text(`Statut : ${order.status || "-"}`, x3, yDet, { maxWidth: colW });
      } else {
        doc.text(`Statut : ${order.status || "-"}`, x1, yDet, { maxWidth: colW });
        doc.text(`Référence : ${order.reference || "-"}`, x2, yDet, { maxWidth: colW });
        doc.text(`Notes : ${order.notes || "-"}`, x3, yDet, { maxWidth: colW });
      }
    } else {
      doc.text(`Statut : ${order.status || "-"}`, x1, yDet, { maxWidth: colW });
      doc.text(`Référence : ${order.reference || "-"}`, x2, yDet, { maxWidth: colW });
      doc.text(`Notes : ${order.notes || "-"}`, x3, yDet, { maxWidth: colW });
    }

    y += 20;

    // --- Informations SIRET du transporteur/société ---
    const partenaireFiscal =
      (order.societe && order.societe.name && order.societe) ||
      (order.transporteur && order.transporteur.name && order.transporteur) ||
      (order.commissionnaire && (order.commissionnaire.nom_de_entreprise_du_comisionaire || order.commissionnaire.name) && order.commissionnaire) ||
      (order.client && order.client.name && order.client);

    if (partenaireFiscal) {
      doc.setFontSize(8);
      doc.setTextColor(13, 71, 161);
      doc.text("Informations complètes du partenaire :", margin, y);
      doc.setFontSize(7);
      doc.setTextColor(33, 33, 33);
      let yFiscal = y + 4;
      
      // Nom du partenaire
      const partenaireName = partenaireFiscal.name || partenaireFiscal.nom_de_entreprise_du_comisionaire || "";
      if (partenaireName) {
        doc.text(`Nom : ${partenaireName}`, margin, yFiscal);
        yFiscal += 3;
      }
      
      // Adresse complète
      const partenaireStreet = partenaireFiscal.street || partenaireFiscal.adresse || "";
      const partenaireCity = partenaireFiscal.city || partenaireFiscal.ville || "";
      const partenaireZipCode = partenaireFiscal.zipCode || partenaireFiscal.codePostal || "";
      const partenaireCountry = partenaireFiscal.country || partenaireFiscal.pays || "";
      
      if (partenaireStreet) {
        doc.text(`Adresse : ${partenaireStreet}`, margin, yFiscal);
        yFiscal += 3;
      }
      
      const partenaireCityZip = [partenaireZipCode, partenaireCity].filter(Boolean).join(" ");
      if (partenaireCityZip) {
        doc.text(`Ville : ${partenaireCityZip}`, margin, yFiscal);
        yFiscal += 3;
      }
      
      if (partenaireCountry) {
        doc.text(`Pays : ${partenaireCountry}`, margin, yFiscal);
        yFiscal += 3;
      }
      
      // Contact
      if (partenaireFiscal.phone || partenaireFiscal.email) {
        const contactInfo = [partenaireFiscal.phone && `Tél : ${partenaireFiscal.phone}`, partenaireFiscal.email && `Email : ${partenaireFiscal.email}`].filter(Boolean).join(" - ");
        if (contactInfo) {
          doc.text(`Contact : ${contactInfo}`, margin, yFiscal);
          yFiscal += 3;
        }
      }
      
      // Informations fiscales
      const partenaireTaxID = partenaireFiscal.taxID || partenaireFiscal.tva || "";
      const partenaireSiret = partenaireFiscal.siret || partenaireFiscal.registrationNumber || "";
      
      if (partenaireSiret) {
        doc.text(`SIRET : ${partenaireSiret}`, margin, yFiscal);
        yFiscal += 3;
      }
      if (partenaireTaxID) {
        doc.text(`TVA : ${partenaireTaxID}`, margin, yFiscal);
        yFiscal += 3;
      }
      
      y = yFiscal + 5;
    }

    // --- Informations de la source (devis/facture) ---
    if (order.devisID || order.factureID) {
      doc.setFontSize(8);
      doc.setTextColor(13, 71, 161);
      doc.text("Informations de la source :", margin, y);
      doc.setFontSize(7);
      doc.setTextColor(33, 33, 33);
      let ySource = y + 4;
      
      if (order.devisID) {
        doc.text(`Devis ID : ${order.devisID}`, margin, ySource);
        ySource += 3;
      }
      if (order.factureID) {
        doc.text(`Facture ID : ${order.factureID}`, margin, ySource);
        ySource += 3;
      }
      
      y = ySource + 5;
    }

    // Date en bas à gauche
    doc.setFontSize(7);
    doc.setTextColor(33, 33, 33);
    doc.text(`Date : ${order.dateChargementDepart || new Date().toLocaleDateString("fr-FR")}`, margin, 190);

    // Zone signature départ
    doc.setDrawColor(13, 71, 161);
    doc.setLineWidth(0.5);
    doc.rect(margin, 150, 70, 25, "D");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Tampon et signature départ", margin + 35, 165, { align: "center" });

    // Zone signature arrivée
    doc.rect(pageWidth - margin - 70, 150, 70, 25, "D");
    doc.text("Tampon et signature arrivée", pageWidth - margin - 35, 165, { align: "center" });

    // Ajouter une page pour les conditions de transport si elles existent
    if (conditionsTransport) {
      console.log("Ajout de la page des conditions de transport");
      addTransportConditionsPage(doc, conditionsTransport, companyInfo);
    } else {
      console.log("Aucune condition de transport à ajouter");
    }

    const filename = `ordre_transport_${order.ordreTransport || "sans_numero"}.pdf`;
    console.log("Sauvegarde du PDF:", filename);
    doc.save(filename);
    console.log("PDF généré avec succès!");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
  }
}

// Fonction pour ajouter une page avec les conditions de transport
function addTransportConditionsPage(doc, conditions, companyInfo = {}) {
  try {
    // Ajouter une nouvelle page
    doc.addPage();
    
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 12;
    const colWidth = (pageWidth - 2 * margin) / 2;
    let y = margin;

    // Fond bleu clair
    doc.setFillColor(227, 242, 253);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Titre de la page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(13, 71, 161);
    doc.text("CONDITIONS DE TRANSPORT", pageWidth / 2, y + 4, { align: "center" });
    y += 8;

    // Informations de l'entreprise en haut
    if (companyInfo.name) {
      doc.setFontSize(6);
      doc.setTextColor(33, 33, 33);
      doc.text(companyInfo.name, margin, y);
      y += 3;
    }

    // Fonction pour créer une section compacte
    const createCompactSection = (title, content, startY, isLeft = true) => {
      let currentY = startY;
      const lineHeight = 1.5;
      const fontSize = 4.5;
      const sectionSpacing = 1;
      const x = isLeft ? margin : margin + colWidth + 6;

      // Titre de section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.0);
      doc.setTextColor(13, 71, 161);
      doc.text(title, x, currentY);
      currentY += lineHeight;

      // Contenu
      if (content && content.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(33, 33, 33);
        const lines = doc.splitTextToSize(content, colWidth - 2);
        lines.forEach(line => {
          if (currentY + lineHeight > pageHeight - margin) return;
          doc.text(line, x + 1, currentY);
          currentY += lineHeight;
        });
      }
      return currentY + sectionSpacing;
    };

    // Affichage en 2 colonnes pour optimiser l'espace
    let yLeft = y;
    let yRight = y;

    // Colonne gauche
    yLeft = createCompactSection("1. RESPONSABILITÉS", "", yLeft, true);
    if (conditions.responsabilites?.transporteur) {
      yLeft = createCompactSection("1.1 Transporteur", conditions.responsabilites.transporteur, yLeft, true);
    }
    if (conditions.responsabilites?.client) {
      yLeft = createCompactSection("1.2 Client", conditions.responsabilites.client, yLeft, true);
    }

    yLeft = createCompactSection("2. CHARGEMENT/DÉCHARGEMENT", "", yLeft, true);
    if (conditions.delais?.chargement) {
      yLeft = createCompactSection("2.1 Chargement", conditions.delais.chargement, yLeft, true);
    }
    if (conditions.delais?.dechargement) {
      yLeft = createCompactSection("2.2 Déchargement", conditions.delais.dechargement, yLeft, true);
    }

    yLeft = createCompactSection("3. TARIFICATION", "", yLeft, true);
    if (conditions.tarification?.fraisSupplementaires) {
      yLeft = createCompactSection("3.1 Frais supp.", conditions.tarification.fraisSupplementaires, yLeft, true);
    }
    if (conditions.tarification?.penaliteRetard) {
      yLeft = createCompactSection("3.2 Pénalités", conditions.tarification.penaliteRetard, yLeft, true);
    }

    yLeft = createCompactSection("4. ASSURANCE", "", yLeft, true);
    if (conditions.assurance?.type) {
      yLeft = createCompactSection("4.1 Type", conditions.assurance.type, yLeft, true);
    }
    if (conditions.assurance?.exclusions) {
      yLeft = createCompactSection("4.2 Exclusions", conditions.assurance.exclusions, yLeft, true);
    }

    // Colonne droite
    yRight = createCompactSection("5. ANNULATION", "", yRight, false);
    if (conditions.annulation?.delaiAnnulation) {
      yRight = createCompactSection("5.1 Délai", conditions.annulation.delaiAnnulation, yRight, false);
    }
    if (conditions.annulation?.fraisAnnulation) {
      yRight = createCompactSection("5.2 Frais", conditions.annulation.fraisAnnulation, yRight, false);
    }

    yRight = createCompactSection("6. PAIEMENT", "", yRight, false);
    if (conditions.paiement?.modePaiement) {
      yRight = createCompactSection("6.1 Mode", conditions.paiement.modePaiement, yRight, false);
    }
    if (conditions.paiement?.delaiPaiement) {
      yRight = createCompactSection("6.2 Délai", conditions.paiement.delaiPaiement, yRight, false);
    }
    if (conditions.paiement?.penaliteRetard) {
      yRight = createCompactSection("6.3 Retard", conditions.paiement.penaliteRetard, yRight, false);
    }
    if (conditions.paiement?.acompte) {
      yRight = createCompactSection("6.4 Acompte", conditions.paiement.acompte, yRight, false);
    }

   

    yRight = createCompactSection("7. JURIDICTION", "", yRight, false);
    if (conditions.juridiction?.litiges) {
      yRight = createCompactSection("7.1 Litiges", conditions.juridiction.litiges, yRight, false);
    }

    // Pied de page
    doc.setFontSize(5);
    doc.setTextColor(120, 120, 120);
    doc.text("Conditions de transport - Page 2", pageWidth / 2, pageHeight - 6, { align: "center" });

  } catch (error) {
    console.error("Erreur lors de l'ajout des conditions sur une seule page:", error);
  }
}
