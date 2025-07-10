import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyInfo } from "../Dashboard/api/apiService";
import { Bars3Icon, XMarkIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Loader from "../components/Loader";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Récupération logo + nom entreprise
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCompanyInfo().then(res => {
      if (res.data && res.data.length > 0) {
        setCompany(res.data[0]);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Erreur lors du chargement des informations de l'entreprise:", err);
      setLoading(false);
    });
  }, []);

  // Correction affichage logo (gère les espaces)
  let logoUrl = null;
  if (company && company.logo) {
    if (company.logo.startsWith("/")) {
      logoUrl = `${API_BASE_URL}${encodeURI(company.logo)}`;
    } else if (company.logo.startsWith("http")) {
      logoUrl = company.logo;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/connexion");
    window.location.reload();
  };

  // Menu principal
  const Menu = [
    { label: "Accueil", href: "/" },
    { label: "Devis", href: "/devis" },
    { label: "Contact", href: "/contact" },
  ];

  if (loading) {
    return <Loader size="medium" color="gray" />;
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
          {/* Logo et nom */}
          <Link
            to="/"
            className="flex items-center space-x-0 group"
          >
            {logoUrl ? (
              <div className="relative">
                <img
                  src={logoUrl}
                  className="h-12 w-auto sm:h-16 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                  alt={company && company.name ? company.name : "Logo entreprise"}
                  style={{ maxWidth: 'clamp(120px, 15vw, 220px)', minWidth: 'clamp(80px, 10vw, 180px)' }}
                  onError={e => { e.target.onerror = null; e.target.src = "/default-logo.png"; }}
                />
              </div>
            ) : (
              <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl lg:text-3xl">
                  {company?.name?.charAt(0) || "A"}
                </span>
              </div>
            )}
            <div className="flex flex-col -ml-4 sm:-ml-6 lg:-ml-8">
              <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300 leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                {company && company.name ? company.name : "Entreprise"}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide uppercase">
                {company && company.industry ? company.industry : "Secteur d'activité"}
              </span>
            </div>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {/* Navigation principale */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {Menu.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`relative px-2 lg:px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.href
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.href && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-100 transition-transform duration-300" />
                  )}
                </Link>
              ))}
            </div>

            {/* Contact et actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {company && company.phone && (
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-center space-x-1 lg:space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span className="hidden xl:inline">{company.phone}</span>
                </a>
              )}
              
              {!isLoggedIn ? (
                <Link
                  to="/connexion"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                >
                  Connexion
                </Link>
              ) : (
                <Link
                  to="/dashboard/full"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Menu mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 transition-colors duration-300 p-2"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {Menu.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${
                  location.pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              {company && company.phone && (
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-center space-x-2 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>{company.phone}</span>
                </a>
              )}
              
              {!isLoggedIn ? (
                <Link
                  to="/connexion"
                  className="block mt-2 mx-3 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              ) : (
                <Link
                  to="/dashboard/full"
                  className="block mt-2 mx-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
