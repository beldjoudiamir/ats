import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyInfo } from "../Dashboard/api/apiService";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeAltIcon,
  ArrowUpIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import Loader from "../components/Loader";

export default function Index() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Récupérer les informations de l'entreprise
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await getCompanyInfo();
        if (response.data && response.data.length > 0) {
          setCompanyInfo(response.data[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'entreprise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  // Gestion du scroll pour le bouton "retour en haut"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatAddress = () => {
    if (!companyInfo) return "Adresse non renseignée";
    
    const parts = [
      companyInfo.address,
      companyInfo.postal_code,
      companyInfo.city,
      companyInfo.country
    ].filter(part => part && part.trim());
    
    return parts.length > 0 ? parts.join(", ") : "Adresse non renseignée";
  };

  if (loading) {
    return <Loader size="medium" color="white" />;
  }

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Motif décoratif subtil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative z-10">
        {/* Section principale */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Informations de l'entreprise */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  {companyInfo?.name || ''}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {companyInfo?.description || ""}
              </p>
              
              {/* Services rapides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" />
                  Transport sécurisé
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" />
                  Livraison express
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <GlobeAltIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" />
                  International
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <TruckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" />
                  Logistique complète
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Contact</h4>
              <div className="space-y-3 sm:space-y-4">
                {companyInfo?.phone && (
                  <div className="flex items-start">
                    <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <a 
                      href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                )}
                
                {companyInfo?.email && (
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <a 
                      href={`mailto:${companyInfo.email}`}
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                )}
                
                <div className="flex items-start">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-gray-300">
                    {formatAddress()}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation rapide */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Navigation</h4>
              <div className="space-y-2 sm:space-y-3">
                <Link 
                  to="/" 
                  className="block text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Accueil
                </Link>
                <Link 
                  to="/devis" 
                  className="block text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Demander un devis
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Contact
                </Link>
                <Link 
                  to={isLoggedIn ? "/dashboard/full" : "/connexion"}
                  className="block text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {isLoggedIn ? "Dashboard" : "Espace client"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-0 text-center md:text-left">
                © {new Date().getFullYear()} {companyInfo?.name || ''}. Tous droits réservés.
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <Link to="/mentions-legales" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Mentions légales
                </Link>
                <Link to="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Politique de confidentialité
                </Link>
                <Link to="/conditions-utilisation" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Conditions d'utilisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gray-800 hover:bg-gray-700 text-white p-2 sm:p-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Retour en haut"
        >
          <ArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </footer>
  );
}
