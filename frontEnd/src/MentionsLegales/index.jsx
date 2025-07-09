import React, { useState, useEffect } from 'react';
import { getCompanyInfo } from '../Dashboard/api/apiService';

export default function MentionsLegales() {
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
        <div className="text-gray-600">Chargement des mentions légales...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Mentions Légales
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
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
              {company?.website && (
                <p className="text-gray-800 mb-2">
                  <strong>Site web :</strong> {company.website}
                </p>
              )}
              {company?.director_name && (
                <p className="text-gray-800 mb-2">
                  <strong>Directeur de publication :</strong> {company.director_name}
                </p>
              )}
              {company?.registrationNumber && (
                <p className="text-gray-800 mb-2">
                  <strong>SIRET :</strong> {company.registrationNumber}
                </p>
              )}
              {company?.taxID && (
                <p className="text-gray-800 mb-2">
                  <strong>Numéro de TVA :</strong> {company.taxID}
                </p>
              )}
            </div>
          </section>

          {/* Hébergeur */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-2">
                <strong>Hébergeur :</strong> HostPro.ua
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Description :</strong> Fiable et bien noté. Offre : Hébergement partagé, cloud, VPS, serveurs dédiés.
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Interface :</strong> Ukrainien
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Support client :</strong> 24/7
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Site web :</strong> <a href="https://hostpro.ua" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://hostpro.ua</a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="text-gray-800 mb-4">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
              <p className="text-gray-800">
                La reproduction sur support papier est autorisée, notamment dans un cadre pédagogique, sous réserve du respect des trois conditions suivantes :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-800 space-y-1">
                <li>Gratuité de la diffusion</li>
                <li>Respect de l'intégrité des documents reproduits</li>
                <li>Citation explicite du site {company?.website || 'de notre entreprise'} comme source</li>
              </ul>
            </div>
          </section>

          {/* Protection des données personnelles */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Protection des données personnelles</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p className="text-gray-800 mb-4">
                Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez nous contacter :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-1 mb-4">
                <li>Par email : {company?.email || 'Non renseigné'}</li>
                <li>Par téléphone : {company?.phone || 'Non renseigné'}</li>
                <li>Par courrier : {company?.address || 'Non renseigné'}</li>
              </ul>
              <p className="text-gray-800">
                Vous avez également le droit de déposer une plainte auprès de la CNIL si vous estimez que vos droits ne sont pas respectés.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Ce site utilise des cookies pour améliorer votre expérience de navigation. 
                Les cookies sont de petits fichiers texte stockés sur votre ordinateur.
              </p>
              <p className="text-gray-800 mb-4">
                Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé quand un cookie est envoyé.
              </p>
              <p className="text-gray-800">
                Les cookies utilisés sur ce site sont :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-800 space-y-1">
                <li>Cookies de session pour maintenir votre connexion</li>
                <li>Cookies de préférences pour mémoriser vos choix</li>
                <li>Cookies analytiques pour mesurer l'audience (si applicable)</li>
              </ul>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Responsabilité</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
                mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
              </p>
              <p className="text-gray-800 mb-4">
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler 
                par email à l'adresse {company?.email || 'Non renseigné'} en décrivant le problème de la manière la plus précise possible.
              </p>
              <p className="text-gray-800">
                Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. 
                En conséquence, {company?.name || 'notre entreprise'} ne saurait être tenu responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur 
                ou d'une quelconque perte de données consécutives au téléchargement.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Droit applicable</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Tout litige en relation avec l'utilisation du site {company?.website || 'de notre entreprise'} 
                est soumis au droit français. En dehors des cas où la loi ne le permet pas, 
                il est fait attribution exclusive de juridiction aux tribunaux compétents de [Ville du tribunal compétent].
              </p>
              <p className="text-gray-800">
                Les présentes mentions légales sont soumises au droit français. 
                En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français 
                conformément aux règles de droit en vigueur.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 