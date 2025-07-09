import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAutoRefresh from "./hooks/useAutoRefresh.js";
import Loader from "../components/Loader";

import {
  Bars3Icon,
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  TruckIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  WindowIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

// eslint-disable-next-line react/prop-types
const SidebarItem = ({ icon: Icon, label, to, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 rounded-lg transition-colors ${
          isActive
            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
        {badge !== undefined && badge !== null && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
};

// eslint-disable-next-line react/prop-types
export default function MainDashboard({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Stabiliser les endpoints pour éviter les re-renders
  const endpoints = useMemo(() => [
    'clients',
    'estimate',
    'invoice',
    'listeCommissionnaire',
    'transportOrder',
    'receivedMessage'
  ], []);
  
  const { data, loading, error } = useAutoRefresh(endpoints, 30000); // 30 secondes

  // Calcul des compteurs à partir des données automatiquement mises à jour
  const counts = useMemo(() => ({
    transporteurs: Array.isArray(data.clients) ? data.clients.length : 0,
    devis: Array.isArray(data.estimate) ? data.estimate.length : 0,
    factures: Array.isArray(data.invoice) ? data.invoice.length : 0,
    commissionnaires: Array.isArray(data.listeCommissionnaire) ? data.listeCommissionnaire.length : 0,
    ordres: Array.isArray(data.transportOrder) ? data.transportOrder.length : 0,
    messages: Array.isArray(data.receivedMessage) ? data.receivedMessage.length : 0,
  }), [data]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Nettoyer toutes les informations utilisateur
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("rememberMe");
    
    navigate("/connexion");
    window.location.reload();
  };

  if (loading) {
    return <Loader size="large" color="gray" />;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="px-3 py-4 overflow-y-auto h-full mt-6">
          <ul className="space-y-2 font-medium">
            
            <SidebarItem icon={HomeIcon} label="Tableau de bord" to="/dashboard/full" />
            <SidebarItem icon={BuildingOfficeIcon} label="Notre entreprise" to="/NotreEntreprise" />
            <SidebarItem icon={DocumentIcon} label="Conditions de Transport" to="/dashboard/conditions-transport" />
            <SidebarItem icon={GlobeAltIcon} label="Liste commissionnaire" to="/listeCommissionnaire" badge={counts.commissionnaires} />
            <SidebarItem icon={UsersIcon} label="Liste transporteur" to="/clients" badge={counts.transporteurs} />
            <SidebarItem icon={WindowIcon} label="Devis" to="/nosDevis" badge={counts.devis} />
            <SidebarItem icon={DocumentTextIcon} label="Factures" to="/factures" badge={counts.factures} />
            <SidebarItem icon={TruckIcon} label="Ordre de transport" to="/transport" badge={counts.ordres} />
            <SidebarItem icon={ChatBubbleLeftIcon} label="Messagerie" to="/messagerie" badge={counts.messages} />
            <SidebarItem icon={UserGroupIcon} label="Gestion des utilisateurs" to="/utilisateurs" />
            <SidebarItem icon={GlobeAltIcon} label="Accueil" to="/" />
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 dark:text-red-400 hover:underline w-full bg-transparent border-none p-2 rounded-lg"
                style={{ cursor: "pointer" }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 sm:ml-64">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Content area - les pages du dashboard s'afficheront ici */}
        <div className="min-h-screen bg-gray-50" style={{ zoom: "85%" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
