import React, { useState, useEffect } from 'react';
import { getCompanyInfo } from '../Dashboard/api/apiService';

export default function ConditionsUtilisation() {
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
        <div className="text-gray-600">Chargement des conditions d'utilisation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Conditions d'Utilisation
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
                Les présentes conditions d'utilisation régissent l'utilisation du site web et des services 
                proposés par {company?.name || 'Notre entreprise'}. En accédant à notre site et en utilisant nos services, 
                vous acceptez d'être lié par ces conditions.
              </p>
              <p className="text-gray-800">
                Ces conditions s'appliquent à tous les utilisateurs du site, qu'ils soient visiteurs, clients 
                ou utilisateurs enregistrés. Nous nous réservons le droit de modifier ces conditions à tout moment.
              </p>
            </div>
          </section>

          {/* Définitions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Définitions</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="list-disc list-inside text-gray-800 space-y-2">
                <li><strong>"Site"</strong> : Le site web {company?.website || 'de notre entreprise'} et ses sous-domaines</li>
                <li><strong>"Services"</strong> : L'ensemble des services de transport et logistique proposés</li>
                <li><strong>"Utilisateur"</strong> : Toute personne utilisant le site ou les services</li>
                <li><strong>"Client"</strong> : Utilisateur ayant souscrit à nos services</li>
                <li><strong>"Compte"</strong> : Espace personnel de l'utilisateur sur le site</li>
                <li><strong>"Contenu"</strong> : Toutes les informations, données, textes, images présents sur le site</li>
              </ul>
            </div>
          </section>

          {/* Acceptation des conditions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Acceptation des conditions</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                En accédant et en utilisant notre site, vous déclarez :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Avoir lu et compris les présentes conditions d'utilisation</li>
                <li>Accepter d'être lié par ces conditions</li>
                <li>Avoir la capacité légale de contracter</li>
                <li>Fournir des informations exactes et à jour</li>
              </ul>
              <p className="text-gray-800">
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.
              </p>
            </div>
          </section>

          {/* Description des services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Description des services</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                {company?.name || 'Notre entreprise'} propose les services suivants :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li><strong>Transport de marchandises</strong> : Transport routier, maritime, aérien</li>
                <li><strong>Services logistiques</strong> : Stockage, manutention, distribution</li>
                <li><strong>Gestion de flotte</strong> : Suivi et optimisation des transports</li>
                <li><strong>Services de commissionnaire</strong> : Intermédiation et organisation de transports</li>
                <li><strong>Outils en ligne</strong> : Devis, suivi, facturation électronique</li>
              </ul>
              <p className="text-gray-800">
                Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie de nos services 
                à tout moment, avec ou sans préavis.
              </p>
            </div>
          </section>

          {/* Inscription et compte utilisateur */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Inscription et compte utilisateur</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Pour accéder à certains services, vous devez créer un compte utilisateur :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Vous devez fournir des informations exactes et complètes</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Vous devez nous informer immédiatement de toute utilisation non autorisée</li>
                <li>Un seul compte par personne est autorisé</li>
                <li>Nous nous réservons le droit de refuser ou suspendre un compte</li>
              </ul>
              <p className="text-gray-800">
                Vous êtes entièrement responsable de toutes les activités effectuées sous votre compte.
              </p>
            </div>
          </section>

          {/* Utilisation acceptable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Utilisation acceptable</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Vous vous engagez à utiliser le site et les services de manière licite et appropriée :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Respecter les droits de propriété intellectuelle</li>
                <li>Ne pas utiliser le site à des fins illégales ou frauduleuses</li>
                <li>Ne pas tenter de perturber le fonctionnement du site</li>
                <li>Ne pas transmettre de virus ou de code malveillant</li>
                <li>Ne pas collecter des données personnelles sans autorisation</li>
                <li>Respecter la vie privée des autres utilisateurs</li>
              </ul>
              <p className="text-gray-800">
                Toute violation de ces règles peut entraîner la suspension ou la suppression de votre compte.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Propriété intellectuelle</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Le site et son contenu sont protégés par les droits de propriété intellectuelle :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Le contenu du site appartient à {company?.name || 'notre entreprise'}</li>
                <li>Les marques, logos et noms commerciaux sont protégés</li>
                <li>La reproduction sans autorisation est interdite</li>
                <li>Vous conservez les droits sur le contenu que vous soumettez</li>
              </ul>
              <p className="text-gray-800">
                Vous nous accordez une licence non exclusive d'utiliser le contenu que vous soumettez 
                pour la fourniture de nos services.
              </p>
            </div>
          </section>

          {/* Tarifs et paiement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Tarifs et paiement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Les tarifs de nos services sont disponibles sur demande et peuvent être modifiés :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Les prix sont exprimés en euros et hors taxes</li>
                <li>La TVA applicable est ajoutée selon la réglementation en vigueur</li>
                <li>Le paiement est exigible à la commande ou selon les conditions contractuelles</li>
                <li>Les moyens de paiement acceptés sont précisés lors de la commande</li>
                <li>En cas de retard de paiement, des pénalités peuvent s'appliquer</li>
              </ul>
              <p className="text-gray-800">
                Nous nous réservons le droit de modifier nos tarifs à tout moment, 
                avec un préavis de 30 jours pour les clients existants.
              </p>
            </div>
          </section>

          {/* Livraison et exécution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Livraison et exécution</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Nous nous engageons à exécuter nos services dans les meilleures conditions :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Les délais de livraison sont donnés à titre indicatif</li>
                <li>Nous ne sommes pas responsables des retards dus à des cas de force majeure</li>
                <li>Les marchandises sont transportées aux risques et périls du client</li>
                <li>Le client doit vérifier l'état des marchandises à la réception</li>
                <li>Les réserves doivent être formulées dans les délais légaux</li>
              </ul>
              <p className="text-gray-800">
                En cas de problème, nous nous engageons à rechercher une solution 
                dans les plus brefs délais.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Responsabilité</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Notre responsabilité est limitée dans les conditions suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Nous ne sommes responsables que des dommages directs prouvés</li>
                <li>Notre responsabilité est limitée au montant payé pour le service</li>
                <li>Nous ne sommes pas responsables des dommages indirects</li>
                <li>Les exclusions de responsabilité s'appliquent selon la loi</li>
              </ul>
              <p className="text-gray-800">
                Cette limitation ne s'applique pas en cas de faute intentionnelle 
                ou de dommages corporels.
              </p>
            </div>
          </section>

          {/* Protection des données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Protection des données</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                La protection de vos données personnelles est importante pour nous :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Nous respectons le RGPD et la loi Informatique et Libertés</li>
                <li>Vos données sont collectées et traitées de manière sécurisée</li>
                <li>Vous disposez des droits d'accès, rectification et suppression</li>
                <li>Notre politique de confidentialité détaille nos pratiques</li>
              </ul>
              <p className="text-gray-800">
                Pour plus d'informations, consultez notre politique de confidentialité 
                disponible sur notre site.
              </p>
            </div>
          </section>

          {/* Force majeure */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Force majeure</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Nous ne sommes pas responsables en cas de force majeure :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Événements naturels (inondations, tempêtes, séismes)</li>
                <li>Grèves, émeutes, troubles sociaux</li>
                <li>Interdictions gouvernementales ou administratives</li>
                <li>Pannes techniques majeures non imputables à notre fait</li>
                <li>Événements imprévisibles et insurmontables</li>
              </ul>
              <p className="text-gray-800">
                En cas de force majeure, l'exécution des obligations est suspendue 
                pendant la durée de l'événement.
              </p>
            </div>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Résiliation</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Les présentes conditions peuvent être résiliées :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Par vous à tout moment en fermant votre compte</li>
                <li>Par nous en cas de violation des conditions</li>
                <li>Par nous avec un préavis de 30 jours</li>
                <li>Immédiatement en cas de faute grave</li>
              </ul>
              <p className="text-gray-800">
                La résiliation n'affecte pas les obligations déjà contractées 
                et les clauses de survie.
              </p>
            </div>
          </section>

          {/* Droit applicable et juridiction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Droit applicable et juridiction</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Les présentes conditions sont régies par le droit français :
              </p>
              <ul className="list-disc list-inside text-gray-800 space-y-2 mb-4">
                <li>Le droit français s'applique à l'interprétation et l'exécution</li>
                <li>Les tribunaux français sont seuls compétents</li>
                <li>En cas de litige, nous privilégions une solution amiable</li>
                <li>La médiation peut être proposée avant toute action judiciaire</li>
              </ul>
              <p className="text-gray-800">
                Si certaines clauses sont déclarées nulles, les autres restent valides.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-4">
                Pour toute question concernant ces conditions d'utilisation, contactez-nous :
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