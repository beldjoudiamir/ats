// Fichier routes/myRoutes.js
const express = require("express");
const router = express.Router();
const { handleGet, handlePost, handlePut, handleDelete, insertTestClientMessages, insertTestDevisMessages } = require("../utils/routeHandlers.js");
const multer = require('multer');
const path = require('path');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../utils/middleware.js");
const { getCompanyPhone } = require("../controllers/clientController");
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Correction du chemin pour pointer vers le bon dossier uploads du frontend
    cb(null, path.resolve(__dirname, '../../../frontEnd/public/uploads/'));
  },
  filename: function (req, file, cb) {
    // Remplace les espaces par des underscores pour éviter les problèmes d'URL
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});
const upload = multer({ storage: storage });

module.exports = (collection, collection2, collection3, collection4, collection5, collection6, collection7, collection8, collection9, collection10) => {
  // Route GET pour récupérer les données
  router.get("/myCompanyInfo", (req, res) => handleGet(collection, req, res));

  // Route POST pour ajouter des informations
  router.post("/myCompanyInfo/add", async (req, res) => {
    try {
      const existing = await collection.findOne({});
      if (existing) {
        return res.status(409).json({ error: "Une fiche entreprise existe déjà. Veuillez la modifier." });
      }
      return handlePost(collection, req, res, ["name", "description"]);
    } catch (err) {
      return res.status(500).json({ error: "Erreur lors de la vérification d'unicité." });
    }
  });

  // Route PUT pour modifier des informations
  router.put("/myCompanyInfo/update/:id", async (req, res) => {
    console.log('🚀 PUT myCompanyInfo/update - DÉBUT DE LA REQUÊTE');
    console.log('🚀 PUT myCompanyInfo/update - URL:', req.url);
    console.log('🚀 PUT myCompanyInfo/update - Méthode:', req.method);
    
    try {
      const { id } = req.params;
      const updatedData = req.body;
      
      console.log('📋 PUT myCompanyInfo/update - ID reçu:', id);
      console.log('📋 PUT myCompanyInfo/update - Type de ID:', typeof id);
      console.log('📋 PUT myCompanyInfo/update - Body reçu:', JSON.stringify(updatedData, null, 2));
      console.log('📋 PUT myCompanyInfo/update - Type de body:', typeof updatedData);
      
      // Validation de l'ID
      console.log('🔍 PUT myCompanyInfo/update - Validation de l\'ID...');
      if (!ObjectId.isValid(id)) {
        console.error('❌ PUT myCompanyInfo/update - ID invalide:', id);
        return res.status(400).json({ error: "ID invalide" });
      }
      console.log('✅ PUT myCompanyInfo/update - ID valide');
      
      // Vérification des champs requis
      console.log('🔍 PUT myCompanyInfo/update - Vérification des champs requis...');
      const requiredFields = ["name", "description"];
      const missingFields = requiredFields.filter(field => !updatedData[field]);
      if (missingFields.length > 0) {
        console.error('❌ PUT myCompanyInfo/update - Champs manquants:', missingFields);
        return res.status(400).json({ error: `Champs requis manquants: ${missingFields.join(", ")}` });
      }
      console.log('✅ PUT myCompanyInfo/update - Tous les champs requis présents');
      
      // Vérifier que l'entreprise existe
      console.log('🔍 PUT myCompanyInfo/update - Recherche de l\'entreprise...');
      const existingCompany = await collection.findOne({ _id: new ObjectId(id) });
      console.log('📋 PUT myCompanyInfo/update - Entreprise trouvée:', existingCompany ? 'OUI' : 'NON');
      if (!existingCompany) {
        console.error('❌ PUT myCompanyInfo/update - Aucune entreprise trouvée avec ID:', id);
        return res.status(404).json({ error: "Entreprise non trouvée" });
      }
      console.log('✅ PUT myCompanyInfo/update - Entreprise trouvée');
      
      // Mise à jour des données
      console.log('🔍 PUT myCompanyInfo/update - Début de la mise à jour...');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      
      console.log('📋 PUT myCompanyInfo/update - Résultat updateOne:', JSON.stringify(result, null, 2));
      
      if (result.matchedCount === 0) {
        console.error('❌ PUT myCompanyInfo/update - Aucun document trouvé avec cet ID');
        return res.status(404).json({ error: "Aucun document trouvé avec cet ID" });
      }
      
      console.log('✅ PUT myCompanyInfo/update - Mise à jour réussie');
      console.log('🚀 PUT myCompanyInfo/update - Envoi de la réponse...');
      
      res.json({ 
        success: true, 
        message: "Informations modifiées avec succès",
        updatedData 
      });
      
      console.log('✅ PUT myCompanyInfo/update - REQUÊTE TERMINÉE AVEC SUCCÈS');
      
    } catch (err) {
      console.error('💥 PUT myCompanyInfo/update - ERREUR CRITIQUE:');
      console.error('💥 PUT myCompanyInfo/update - Message d\'erreur:', err.message);
      console.error('💥 PUT myCompanyInfo/update - Type d\'erreur:', err.constructor.name);
      console.error('💥 PUT myCompanyInfo/update - Stack trace:', err.stack);
      console.error('💥 PUT myCompanyInfo/update - Code d\'erreur:', err.code);
      console.error('💥 PUT myCompanyInfo/update - Nom d\'erreur:', err.name);
      
      res.status(500).json({ 
        error: "Erreur lors de la modification des informations", 
        details: err.message,
        stack: err.stack
      });
      
      console.log('💥 PUT myCompanyInfo/update - REQUÊTE TERMINÉE AVEC ERREUR');
    }
  });

  // Route DELETE pour supprimer des informations
  router.delete("/myCompanyInfo/delete/:id", (req, res) => handleDelete(collection, req, res));

  // Route estimate pour récupérer les données //

  router.get("/estimate", (req, res) => handleGet(collection5, req, res));
  router.post("/estimate/add", async (req, res) => {
    try {
      console.log('Devis reçu du front :', JSON.stringify(req.body, null, 2)); // DEBUG temporaire
      
      // Le frontend envoie { client: {...} } ou { transporteur: {...} } ou { commissionnaire: {...} }
      // On doit extraire ces données correctement
      const {
        devisID,
        companyInfo,
        client,
        transporteur,
        commissionnaire,
        items,
        totalHT,
        tvaRate,
        tva,
        totalTTC,
        route,
        adresseDepart,
        adresseArrivee,
        status,
        message,
        ...otherFields
      } = req.body;

      // Construction de l'objet à insérer avec gestion correcte des partenaires
      const estimateData = {
        devisID: devisID || '',
        companyInfo: companyInfo || {},
        items: items || [],
        totalHT: totalHT || 0,
        tvaRate: tvaRate || 0,
        tva: tva || 0,
        totalTTC: totalTTC || 0,
        route: route || {},
        adresseDepart: adresseDepart || {},
        adresseArrivee: adresseArrivee || {},
        status: status || 'Brouillon',
        message: message || '',
        date: new Date().toISOString()
      };

      // Gestion des partenaires (client, transporteur, commissionnaire)
      if (client) {
        estimateData.client = client;
      }
      if (transporteur) {
        estimateData.transporteur = transporteur;
      }
      if (commissionnaire) {
        estimateData.commissionnaire = commissionnaire;
      }

      // Si aucun partenaire spécifique n'est défini, on cherche dans les autres champs
      if (!client && !transporteur && !commissionnaire) {
        // Le frontend peut avoir envoyé le partenaire dans un champ dynamique
        Object.keys(req.body).forEach(key => {
          if (key === 'client' || key === 'transporteur' || key === 'commissionnaire') {
            estimateData[key] = req.body[key];
          }
        });
      }

      console.log('Données à insérer :', JSON.stringify(estimateData, null, 2)); // DEBUG temporaire
      
      const result = await collection5.insertOne(estimateData);
      console.log('Devis inséré avec ID:', result.insertedId); // DEBUG temporaire

      // Envoyer un email de notification à l'administrateur
      try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (emailUser && emailPass && emailUser !== 'your-email@gmail.com' && emailPass !== 'your-app-password') {
          const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
              user: emailUser,
              pass: emailPass
            }
          });

          // Préparer les informations du client/transporteur/commissionnaire
          const partner = estimateData.client || estimateData.transporteur || estimateData.commissionnaire;
          const partnerType = estimateData.client ? 'Client' : estimateData.transporteur ? 'Transporteur' : 'Commissionnaire';
          const partnerName = partner?.name || partner?.nom_de_entreprise_du_comisionaire || '-';
          const partnerEmail = partner?.email || '-';
          const partnerPhone = partner?.phone || '-';

          // Préparer les détails du devis
          const itemsList = estimateData.items?.map(item => 
            `<tr><td>${item.description || '-'}</td><td>${item.quantity || 1}</td><td>${item.price || 0} €</td><td>${(item.quantity || 1) * (item.price || 0)} €</td></tr>`
          ).join('') || '<tr><td colspan="4">Aucun article</td></tr>';

          const mailOptions = {
            from: emailUser,
            to: emailUser, // L'administrateur reçoit la notification
            subject: `Nouveau devis créé - ${estimateData.devisID || 'Sans numéro'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h2 style="color: #333; text-align: center;">ATS Transport - Nouveau devis créé</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Informations du devis</h3>
                  <p><strong>Numéro de devis :</strong> ${estimateData.devisID || '-'}</p>
                  <p><strong>Statut :</strong> <span style="color: ${estimateData.status === 'Accepté' ? 'green' : estimateData.status === 'Refusé' ? 'red' : 'orange'}">${estimateData.status || 'Brouillon'}</span></p>
                  <p><strong>Date de création :</strong> ${new Date(estimateData.date).toLocaleString('fr-FR')}</p>
                </div>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">${partnerType}</h3>
                  <p><strong>Nom :</strong> ${partnerName}</p>
                  <p><strong>Email :</strong> <a href="mailto:${partnerEmail}">${partnerEmail}</a></p>
                  <p><strong>Téléphone :</strong> <a href="tel:${partnerPhone}">${partnerPhone}</a></p>
                </div>

                ${estimateData.route ? `
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Itinéraire</h3>
                  <p><strong>Départ :</strong> ${estimateData.route.depart || '-'}</p>
                  <p><strong>Arrivée :</strong> ${estimateData.route.arrivee || '-'}</p>
                </div>
                ` : ''}

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Articles</h3>
                  <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                      <tr style="background-color: #e9ecef;">
                        <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Description</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #dee2e6;">Quantité</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #dee2e6;">Prix unitaire</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #dee2e6;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsList}
                    </tbody>
                  </table>
                </div>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Totaux</h3>
                  <p><strong>Total HT :</strong> ${estimateData.totalHT || 0} €</p>
                  <p><strong>TVA (${estimateData.tvaRate || 0}%) :</strong> ${estimateData.tva || 0} €</p>
                  <p><strong>Total TTC :</strong> <strong style="color: #333; font-size: 18px;">${estimateData.totalTTC || 0} €</strong></p>
                </div>

                ${estimateData.message ? `
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Message</h3>
                  <p style="white-space: pre-wrap; line-height: 1.6;">${estimateData.message}</p>
                </div>
                ` : ''}

                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #999; font-size: 12px;">
                    Ce devis a été créé depuis votre interface d'administration.
                  </p>
                </div>
              </div>
            `
          };

          await transporter.sendMail(mailOptions);
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de notification pour le devis:', emailError);
        // On continue même si l'email échoue, le devis est quand même sauvegardé
      }

      res.status(201).json({ 
        success: true, 
        message: "Devis créé avec succès",
        id: result.insertedId 
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout du devis:', error);
      res.status(500).json({ error: "Erreur lors de la création du devis" });
    }
  });
  router.put("/estimate/update/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Récupérer l'ancien devis pour comparer les changements
      const oldEstimate = await collection5.findOne({ _id: new ObjectId(id) });
      if (!oldEstimate) {
        return res.status(404).json({ error: "Devis non trouvé" });
      }

      // Mettre à jour le devis
      const result = await collection5.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      // Si le statut a changé, envoyer un email de notification
      if (updateData.status && updateData.status !== oldEstimate.status) {
        try {
          const emailUser = process.env.EMAIL_USER;
          const emailPass = process.env.EMAIL_PASS;

          if (emailUser && emailPass && emailUser !== 'your-email@gmail.com' && emailPass !== 'your-app-password') {
            const transporter = nodemailer.createTransporter({
              service: 'gmail',
              auth: {
                user: emailUser,
                pass: emailPass
              }
            });

            // Préparer les informations du client/transporteur/commissionnaire
            const partner = updateData.client || updateData.transporteur || updateData.commissionnaire || oldEstimate.client || oldEstimate.transporteur || oldEstimate.commissionnaire;
            const partnerType = (updateData.client || oldEstimate.client) ? 'Client' : (updateData.transporteur || oldEstimate.transporteur) ? 'Transporteur' : 'Commissionnaire';
            const partnerName = partner?.name || partner?.nom_de_entreprise_du_comisionaire || '-';
            const partnerEmail = partner?.email || '-';

            const statusColor = updateData.status === 'Accepté' ? 'green' : updateData.status === 'Refusé' ? 'red' : 'orange';

            const mailOptions = {
              from: emailUser,
              to: emailUser,
              subject: `Statut du devis mis à jour - ${updateData.devisID || oldEstimate.devisID || 'Sans numéro'}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333; text-align: center;">ATS Transport - Statut du devis mis à jour</h2>
                  
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Informations du devis</h3>
                    <p><strong>Numéro de devis :</strong> ${updateData.devisID || oldEstimate.devisID || '-'}</p>
                    <p><strong>Ancien statut :</strong> ${oldEstimate.status || 'Non défini'}</p>
                    <p><strong>Nouveau statut :</strong> <span style="color: ${statusColor}; font-weight: bold;">${updateData.status}</span></p>
                    <p><strong>Date de mise à jour :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                  </div>

                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">${partnerType}</h3>
                    <p><strong>Nom :</strong> ${partnerName}</p>
                    <p><strong>Email :</strong> <a href="mailto:${partnerEmail}">${partnerEmail}</a></p>
                  </div>

                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Montants</h3>
                    <p><strong>Total HT :</strong> ${updateData.totalHT || oldEstimate.totalHT || 0} €</p>
                    <p><strong>Total TTC :</strong> <strong>${updateData.totalTTC || oldEstimate.totalTTC || 0} €</strong></p>
                  </div>

                  <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #999; font-size: 12px;">
                      Le statut de ce devis a été mis à jour depuis votre interface d'administration.
                    </p>
                  </div>
                </div>
              `
            };

            await transporter.sendMail(mailOptions);
          }
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email de notification pour la mise à jour du devis:', emailError);
          // On continue même si l'email échoue, la mise à jour est quand même effectuée
        }
      }

      res.json({ 
        success: true, 
        message: "Devis mis à jour avec succès" 
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du devis:', error);
      res.status(500).json({ error: "Erreur lors de la mise à jour du devis" });
    }
  });
  router.delete("/estimate/delete/:id", (req, res) => handleDelete(collection5, req, res));

  // Route invoice pour récupérer les données //

  router.get("/invoice", (req, res) => handleGet(collection6, req, res));
  router.post("/invoice/add", (req, res) => handlePost(collection6, req, res, []));
  router.put("/invoice/update/:id", (req, res) => handlePut(collection6, req, res, []));
  router.delete("/invoice/delete/:id", (req, res) => handleDelete(collection6, req, res));

  // Route transport Order pour récupérer les données //

  router.get("/transportOrder", (req, res) => handleGet(collection3, req, res));
  router.post("/transportOrder/add", (req, res) => handlePost(collection3, req, res, ["ordreTransport", "adresseDepart"]));
  router.put("/transportOrder/update/:id", (req, res) => handlePut(collection3, req, res, ["ordreTransport", "adresseDepart"]));
  router.delete("/transportOrder/delete/:id", (req, res) => handleDelete(collection3, req, res));

      // Route conditions de transport pour récupérer les données //

  router.get("/conditionsTransport", (req, res) => handleGet(collection4, req, res));
  router.post("/conditionsTransport/add", (req, res) => handlePost(collection4, req, res, []));
  router.put("/conditionsTransport/update/:id", (req, res) => handlePut(collection4, req, res, [])); 
  router.delete("/conditionsTransport/delete/:id", (req, res) => handleDelete(collection4, req, res));

  // Route transport Quote Request pour récupérer les données //

  router.get("/transportQuoteRequest", (req, res) => handleGet(collection7, req, res));
  router.post("/transportQuoteRequest/add", (req, res) => handlePost(collection7, req, res, []));
  router.put("/transportQuoteRequest/update/:id", (req, res) => handlePut(collection7, req, res, []));
  router.delete("/transportQuoteRequest/delete/:id", (req, res) => handleDelete(collection7, req, res));

  // Route received Message pour récupérer les données //

  router.get("/receivedMessage", (req, res) => handleGet(collection8, req, res));
  router.post("/receivedMessage/add", async (req, res) => {
    try {
      const { name, email, phone, message, date } = req.body;
      
      // Validation des champs requis
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Nom, email et message sont requis" });
      }

      // Sauvegarder le message en base
      const messageData = {
        name,
        email,
        phone: phone || '',
        message,
        date: date || new Date().toISOString()
      };

      const result = await collection8.insertOne(messageData);

      // Envoyer un email de notification à l'administrateur
      try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (emailUser && emailPass && emailUser !== 'your-email@gmail.com' && emailPass !== 'your-app-password') {
          const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
              user: emailUser,
              pass: emailPass
            }
          });

          const mailOptions = {
            from: emailUser,
            to: emailUser, // L'administrateur reçoit la notification
            subject: `Nouveau message de contact - ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; text-align: center;">ATS Transport - Nouveau message de contact</h2>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Détails du message</h3>
                  <p><strong>Nom :</strong> ${name}</p>
                  <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                  ${phone ? `<p><strong>Téléphone :</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
                  <p><strong>Date :</strong> ${new Date(date).toLocaleString('fr-FR')}</p>
                  <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
                    <p><strong>Message :</strong></p>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #999; font-size: 12px;">
                    Ce message a été envoyé depuis le formulaire de contact de votre site web.
                  </p>
                </div>
              </div>
            `
          };

          await transporter.sendMail(mailOptions);
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de notification:', emailError);
        // On continue même si l'email échoue, le message est quand même sauvegardé
      }

      res.status(201).json({ 
        success: true, 
        message: "Message envoyé avec succès",
        id: result.insertedId 
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout du message:', error);
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
  });
  router.put("/receivedMessage/update/:id", (req, res) => handlePut(collection8, req, res, []));
  router.delete("/receivedMessage/delete/:id", (req, res) => handleDelete(collection8, req, res));

  // Route listeCommissionnaire pour récupérer les données //

  router.get("/listeCommissionnaire", (req, res) => handleGet(collection9, req, res));
  router.post("/listeCommissionnaire/add", (req, res) => handlePost(collection9, req, res, ["nom_de_entreprise_du_comisionaire"])); 
  router.put("/listeCommissionnaire/update/:id", (req, res) => handlePut(collection9, req, res, ["nom_de_entreprise_du_comisionaire"]));
  router.delete("/listeCommissionnaire/delete/:id", (req, res) => handleDelete(collection9, req, res));

  // Route de connexion utilisateur (login)
  router.post("/users/login", async (req, res) => {
    // Récupère l'email, le mot de passe et rememberMe du body
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }
    try {
      // Recherche l'utilisateur dans la collection users (collection10)
      const user = await collection10.findOne({ mail: email });
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      if (!user.password) {
        return res.status(401).json({ error: "Mot de passe non défini pour cet utilisateur" });
      }
      // Vérifie le mot de passe hashé
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }
      
      // Définir la durée d'expiration du token selon "Se souvenir de moi"
      const expiresIn = rememberMe ? "30d" : "8h"; // 30 jours si coché, 8h sinon
      
      // Génère un JWT pour l'utilisateur connecté
      const token = jwt.sign(
        { userId: user._id, email: user.mail, role: user.role },
        process.env.JWT_SECRET || "dev_secret_key",
        { expiresIn: expiresIn }
      );
      res.json({ token, user: { id: user._id, name: user.name, email: user.mail, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  });

  // Route d'inscription utilisateur (register) - accessible à tous
  router.post("/users/register", async (req, res) => {
    // Récupère les infos du body (le rôle est forcé à "user" par défaut)
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nom, email et mot de passe requis" });
    }
    try {
      // Vérifie l'unicité de l'email
      const existing = await collection10.findOne({ mail: email });
      if (existing) {
        return res.status(409).json({ error: "Un utilisateur avec cet email existe déjà." });
      }
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        name,
        mail: email,
        password: hashedPassword,
        role // Toujours "user" côté front, mais à sécuriser côté back si besoin
      };
      await collection10.insertOne(user);
      res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  });

  // Route d'ajout d'utilisateur depuis le dashboard (admin uniquement)
  router.post("/users/add", verifyToken, async (req, res) => {
    // Vérifie que l'utilisateur est admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé - Admin requis" });
    }
    const { name, mail, password, role = "user" } = req.body;
    if (!name || !mail || !password) {
      return res.status(400).json({ error: "Nom, email et mot de passe requis" });
    }
    try {
      // Vérifie l'unicité de l'email
      const existing = await collection10.findOne({ mail });
      if (existing) {
        return res.status(409).json({ error: "Un utilisateur avec cet email existe déjà." });
      }
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        name,
        mail,
        password: hashedPassword,
        role
      };
      await collection10.insertOne(user);
      res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
  });

  // Exemple de route sécurisée (nécessite un JWT valide)
  router.get("/users/protected", verifyToken, (req, res) => {
    res.json({
      message: "Accès autorisé à la route sécurisée !",
      user: req.user
    });
  });

  // Liste des utilisateurs (accessible à tous les utilisateurs connectés)
  router.get("/users", verifyToken, async (req, res) => {
    try {
      // Retourne tous les utilisateurs (accessible à tous)
      const users = await collection10.find({}).toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  // Modification d'un utilisateur (admin uniquement)
  router.put("/users/update/:id", verifyToken, async (req, res) => {
    // Vérifie que l'utilisateur est admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé" });
    }
    const { id } = req.params;
    const updatedData = { ...req.body };
    if (updatedData._id) delete updatedData._id;
    if (updatedData.password === "") delete updatedData.password;
    // Si le mot de passe est fourni, on le hash avant update
    if (updatedData.password) {
      const bcrypt = require("bcrypt");
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    try {
      const result = await collection10.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json({ message: "Utilisateur mis à jour" });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la modification de l'utilisateur" });
    }
  });

  // Suppression d'un utilisateur (admin uniquement)
  router.delete("/users/delete/:id", verifyToken, async (req, res) => {
    // Vérifie que l'utilisateur est admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé" });
    }
    const { id } = req.params;
    try {
      const result = await collection10.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  });

  // Nouvelle route pour récupérer le numéro de téléphone de l'entreprise
  router.get("/myCompanyInfo/phone", (req, res) => getCompanyPhone(collection, req, res));

  // Route d'upload du logo avec logs détaillés
  router.post('/upload/logo', async (req, res) => {
    try {
      upload.single('logo')(req, res, function (err) {
        if (err) {
          console.error('Erreur Multer:', err);
          return res.status(500).json({ error: "Erreur lors de l'upload du logo", details: err.message });
        }
        if (!req.file) {
          console.error('Aucun fichier reçu');
          return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
      });
    } catch (err) {
      console.error('Erreur serveur upload:', err);
      res.status(500).json({ error: 'Erreur serveur upload', details: err.message });
    }
  });

  // Route PATCH pour mettre à jour le logo de l'entreprise
  router.patch('/myCompanyInfo/logo/:id', async (req, res) => {
    const { id } = req.params;
    let { logo } = req.body;
    
    console.log('PATCH logo - ID reçu:', id);
    console.log('PATCH logo - Body reçu:', req.body);
    console.log('PATCH logo - Logo value:', logo);
    
    // Si logo est undefined ou null, on le force à "" (suppression)
    if (logo === undefined || logo === null) logo = "";
    
    try {
      // Validation de l'ID
      if (!ObjectId.isValid(id)) {
        console.error('PATCH logo - ID invalide:', id);
        return res.status(400).json({ error: "ID invalide" });
      }
      
      // Vérifier d'abord si l'entreprise existe
      const existingCompany = await collection.findOne({ _id: new ObjectId(id) });
      console.log('PATCH logo - Entreprise existante:', existingCompany ? 'Oui' : 'Non');
      
      if (!existingCompany) {
        console.error('PATCH logo - Aucune entreprise trouvée avec ID:', id);
        return res.status(404).json({ error: "Entreprise non trouvée" });
      }
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { logo } }
      );
      
      console.log('PATCH logo - Résultat update:', result);
      
      res.json({ success: true, logo });
    } catch (err) {
      console.error('PATCH logo - Erreur complète:', err);
      console.error('PATCH logo - Stack trace:', err.stack);
      res.status(500).json({ error: "Erreur lors de la mise à jour du logo", details: err.message });
    }
  });

  // Route d'upload du tampon
  router.post('/upload/stamp', upload.single('stamp'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
  });

  // Route PATCH pour mettre à jour le tampon de l'entreprise
  router.patch('/myCompanyInfo/stamp/:id', async (req, res) => {
    const { id } = req.params;
    let { stamp } = req.body;
    
    console.log('PATCH stamp - ID reçu:', id);
    console.log('PATCH stamp - Body reçu:', req.body);
    console.log('PATCH stamp - Stamp value:', stamp);
    
    // Si stamp est undefined ou null, on le force à "" (suppression)
    if (stamp === undefined || stamp === null) stamp = "";
    
    try {
      // Validation de l'ID
      if (!ObjectId.isValid(id)) {
        console.error('PATCH stamp - ID invalide:', id);
        return res.status(400).json({ error: "ID invalide" });
      }
      
      // Vérifier d'abord si l'entreprise existe
      const existingCompany = await collection.findOne({ _id: new ObjectId(id) });
      console.log('PATCH stamp - Entreprise existante:', existingCompany ? 'Oui' : 'Non');
      
      if (!existingCompany) {
        console.error('PATCH stamp - Aucune entreprise trouvée avec ID:', id);
        return res.status(404).json({ error: "Entreprise non trouvée" });
      }
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { stamp } }
      );
      
      console.log('PATCH stamp - Résultat update:', result);
      
      res.json({ success: true, stamp });
    } catch (err) {
      console.error('PATCH stamp - Erreur complète:', err);
      console.error('PATCH stamp - Stack trace:', err.stack);
      res.status(500).json({ error: "Erreur lors de la mise à jour du tampon", details: err.message });
    }
  });

  // Route pour companyClient (liste des transporteurs)
  router.get("/companyClient", (req, res) => handleGet(collection2, req, res));

  // Alias pour companyInfo (déjà existant sous /myCompanyInfo)
  router.get("/companyInfo", (req, res) => handleGet(collection, req, res));

  return router;
};
