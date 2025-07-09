import React, { useState, useEffect } from 'react';
import { getCompanyInfo } from '../Dashboard/api/apiService';

export default function PolitiqueConfidentialite() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyInfo()
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCompany(res.data[0]);
        }
      })
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement de la politique de confidentialité...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                {company?.name || 'Notre entreprise'} s'engage à protéger la vie privée et les données personnelles de ses utilisateurs. 
                Cette politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos informations personnelles 
                conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
              </p>
              <p className="text-gray-800">
                En utilisant notre site web et nos services, vous acceptez les pratiques décrites dans cette politique de confidentialité.
              </p>
            </div>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Responsable du traitement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-2">
                <strong>Raison sociale :</strong> {company?.name || 'Non renseigné'}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Adresse :</strong> {company?.address || 'Non renseigné'}
                {company?.city && `, ${company.city}`}
                {company?.postal_code && ` ${company.postal_code}`}
                {company?.country && `, ${company.country}`}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Téléphone :</strong> {company?.phone || 'Non renseigné'}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Email :</strong> {company?.email || 'Non renseigné'}
              </p>
              {company?.registrationNumber && (
                <p className="text-gray-800 mb-2">
                  <strong>SIRET :</strong> {company.registrationNumber}
                </p>
              )}
              {company?.director_name && (
                <p className="text-gray-800 mb-2">
                  <strong>Directeur de publication :</strong> {company.director_name}
                </p>
              )}
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Données personnelles collectées</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Nous collectons les types de données personnelles suivants :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
                <li><strong>Données de contact :</strong> numéro de téléphone, adresse postale</li>
                <li><strong>Données de connexion :</strong> adresse IP, logs de connexion, cookies</li>
                <li><strong>Données de navigation :</strong> pages visitées, temps passé sur le site</li>
                <li><strong>Données professionnelles :</strong> fonction, entreprise (si applicable)</li>
              </ul>
              <p className="text-gray-800">
                Ces données sont collectées directement auprès de vous lors de l'utilisation de nos services, 
                ou automatiquement lors de votre navigation sur notre site.
              </p>
            </div>
          </section>

          {/* Finalités du traitement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Finalités du traitement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Vos données personnelles sont traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Gestion des comptes utilisateurs</strong> et authentification</li>
                <li><strong>Fourniture de nos services</strong> de transport et logistique</li>
                <li><strong>Communication client</strong> et support technique</li>
                <li><strong>Amélioration de nos services</strong> et expérience utilisateur</li>
                <li><strong>Respect des obligations légales</strong> et réglementaires</li>
                <li><strong>Marketing et prospection</strong> (avec votre consentement)</li>
              </ul>
              <p className="text-gray-800">
                Le traitement de vos données est fondé sur l'exécution d'un contrat, 
                l'obligation légale, l'intérêt légitime ou votre consentement selon les cas.
              </p>
            </div>
          </section>

          {/* Destinataires des données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Destinataires des données</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Vos données personnelles peuvent être partagées avec :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Notre personnel autorisé</strong> pour la fourniture des services</li>
                <li><strong>Nos prestataires techniques</strong> (hébergement, maintenance)</li>
                <li><strong>Nos partenaires transporteurs</strong> pour l'exécution des missions</li>
                <li><strong>Les autorités compétentes</strong> en cas d'obligation légale</li>
              </ul>
              <p className="text-gray-800">
                Nous nous assurons que tous nos prestataires respectent les mêmes standards 
                de protection des données que nous.
              </p>
            </div>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Durée de conservation</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Nous conservons vos données personnelles uniquement le temps nécessaire 
                aux finalités pour lesquelles elles ont été collectées :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Données de compte :</strong> 3 ans après la dernière activité</li>
                <li><strong>Données de facturation :</strong> 10 ans (obligation comptable)</li>
                <li><strong>Logs de connexion :</strong> 12 mois</li>
                <li><strong>Cookies :</strong> 13 mois maximum</li>
                <li><strong>Données de prospection :</strong> 3 ans après le dernier contact</li>
              </ul>
              <p className="text-gray-800">
                À l'expiration de ces délais, vos données sont supprimées ou anonymisées.
              </p>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Vos droits</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Droit d'accès :</strong> connaître les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement pour des raisons légitimes</li>
                <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
              </ul>
              <p className="text-gray-800">
                Pour exercer ces droits, contactez-nous à l'adresse email : {company?.email || 'Non renseigné'}
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies et technologies similaires</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Notre site utilise des cookies et technologies similaires pour :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Cookies techniques :</strong> assurer le bon fonctionnement du site</li>
                <li><strong>Cookies d'authentification :</strong> maintenir votre session connectée</li>
                <li><strong>Cookies de préférences :</strong> mémoriser vos choix et paramètres</li>
                <li><strong>Cookies analytiques :</strong> mesurer l'audience et améliorer nos services</li>
              </ul>
              <p className="text-gray-800 mb-4">
                Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé 
                quand un cookie est envoyé. Cependant, certaines fonctionnalités du site 
                pourraient ne plus être disponibles.
              </p>
              <p className="text-gray-800">
                La durée de conservation des cookies est de 13 mois maximum.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Sécurité des données</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                pour protéger vos données personnelles contre :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>L'accès non autorisé</li>
                <li>La divulgation accidentelle</li>
                <li>La modification non autorisée</li>
                <li>La destruction ou la perte</li>
              </ul>
              <p className="text-gray-800">
                Ces mesures incluent le chiffrement des données, la sécurisation de nos serveurs, 
                la formation de notre personnel et des procédures d'accès strictes.
              </p>
            </div>
          </section>

          {/* Transferts hors UE */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Transferts de données hors UE</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Vos données personnelles sont principalement traitées au sein de l'Union Européenne. 
                En cas de transfert vers des pays tiers, nous nous assurons que :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Le pays de destination offre un niveau de protection adéquat</li>
                <li>Des garanties contractuelles appropriées sont mises en place</li>
                <li>Les transferts respectent les conditions du RGPD</li>
              </ul>
              <p className="text-gray-800">
                Vous pouvez nous contacter pour obtenir des informations sur les transferts 
                de données vers des pays tiers.
              </p>
            </div>
          </section>

          {/* Droit de plainte */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Droit de plainte</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Nous contacter directement pour résoudre le problème</li>
                <li>Déposer une plainte auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés)</li>
                <li>Saisir l'autorité de contrôle de votre pays de résidence</li>
              </ul>
              <p className="text-gray-800">
                <strong>CNIL :</strong> 3 Place de Fontenoy, 75007 Paris - www.cnil.fr
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Modifications de cette politique</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Nous nous réservons le droit de modifier cette politique de confidentialité 
                pour refléter les évolutions de nos pratiques ou les changements légaux.
              </p>
              <p className="text-gray-800 mb-4">
                En cas de modification substantielle, nous vous informerons par email 
                ou par un avis sur notre site web.
              </p>
              <p className="text-gray-800">
                Nous vous encourageons à consulter régulièrement cette page 
                pour rester informé de nos pratiques de protection des données.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Pour toute question concernant cette politique de confidentialité 
                ou pour exercer vos droits, contactez-nous :
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Par email :</p>
                  <a href={`mailto:${company?.email}`} className="text-blue-600 hover:text-blue-800">
                    {company?.email || 'Non renseigné'}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Par téléphone :</p>
                  <a href={`tel:${company?.phone}`} className="text-blue-600 hover:text-blue-800">
                    {company?.phone || 'Non renseigné'}
                  </a>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-gray-900 mb-2">Par courrier :</p>
                <p className="text-gray-800">
                  {company?.name || 'Notre entreprise'}<br />
                  {company?.address || 'Non renseigné'}
                  {company?.city && `, ${company.city}`}
                  {company?.postal_code && ` ${company.postal_code}`}
                  {company?.country && `, ${company.country}`}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 