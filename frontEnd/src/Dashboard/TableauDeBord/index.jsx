import Dashboard from "../mainDashboard.jsx";
import { useState, useMemo } from "react";
import useAutoRefresh from "../hooks/useAutoRefresh.js";
import AutoRefreshIndicator from "../components/AutoRefreshIndicator.jsx";
import AutoRefreshSettings from "../components/AutoRefreshSettings.jsx";
import {
  DocumentTextIcon,
  WindowIcon,
  TruckIcon,
  ChatBubbleLeftIcon,
  UsersIcon,
  GlobeAltIcon,
  ChartBarIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function Index() {
  const [showSettings, setShowSettings] = useState(false);
  
  // Stabiliser les endpoints pour éviter les re-renders
  const endpoints = useMemo(() => [
    'estimate',
    'invoice', 
    'transportOrder',
    'receivedMessage',
    'clients',
    'listeCommissionnaire',
    'conditionsTransport'
  ], []);
  
  const { 
    data, 
    loading, 
    error, 
    lastUpdate, 
    currentInterval,
    refreshNow, 
    updateInterval 
  } = useAutoRefresh(endpoints, 30000); // 30 secondes par défaut

  // Calcul des totaux à partir des données automatiquement mises à jour
  const totals = useMemo(() => ({
    devis: Array.isArray(data.estimate) ? data.estimate.length : 0,
    factures: Array.isArray(data.invoice) ? data.invoice.length : 0,
    ordres: Array.isArray(data.transportOrder) ? data.transportOrder.length : 0,
    messages: Array.isArray(data.receivedMessage) ? data.receivedMessage.length : 0,
    transporteurs: Array.isArray(data.clients) ? data.clients.length : 0,
    commissionnaires: Array.isArray(data.listeCommissionnaire) ? data.listeCommissionnaire.length : 0,
    conditionsTransport: Array.isArray(data.conditionsTransport) ? data.conditionsTransport.length : 0,
  }), [data]);

  const items = useMemo(() => [
    { label: "Total devis", value: totals.devis, icon: WindowIcon, link: "/nosDevis" },
    { label: "Total factures", value: totals.factures, icon: DocumentTextIcon, link: "/factures" },
    { label: "Total ordres de transport", value: totals.ordres, icon: TruckIcon, link: "/transport" },
    { label: "Total messages", value: totals.messages, icon: ChatBubbleLeftIcon, link: "/messagerie" },
    { label: "Total transporteurs", value: totals.transporteurs, icon: UsersIcon, link: "/clients" },
    { label: "Total commissionnaires", value: totals.commissionnaires, icon: GlobeAltIcon, link: "/listeCommissionnaire" },
    { label: "Conditions de transport", value: totals.conditionsTransport, icon: DocumentIcon, link: "/dashboard/conditions-transport" },
  ], [totals]);

  return (
    <Dashboard>
      <div className="max-w-3xl mx-auto px-1 py-8">
        {/* Header avec indicateur de mise à jour automatique */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1">
            <ChartBarIcon className="w-4 h-4 text-blue-600" />
            <h1 className="text-xs font-bold text-blue-900">Tableau de bord</h1>
          </div>
          <AutoRefreshIndicator
            lastUpdate={lastUpdate}
            loading={loading}
            error={error}
            onRefresh={refreshNow}
            currentInterval={currentInterval}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>

        {/* Section principale : cartes de totaux en grille responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mt-2 mb-8 min-h-[180px]">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="p-1 bg-white rounded shadow flex flex-col items-center justify-center gap-1 hover:shadow-md transition-shadow cursor-pointer"
            >
              <item.icon className="w-16 h-16 text-blue-500" />
              <div className="text-[11px] font-medium text-gray-700 text-center">{item.label}</div>
              <div className="text-[13px] font-bold text-blue-700">{item.value}</div>
            </Link>
          ))}
        </div>

        {/* Modal de paramètres */}
        <AutoRefreshSettings
          currentInterval={currentInterval}
          onIntervalChange={updateInterval}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </Dashboard>
  );
}

export default Index;
