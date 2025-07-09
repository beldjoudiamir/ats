import React from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const AutoRefreshIndicator = ({ 
  lastUpdate, 
  loading, 
  error, 
  onRefresh, 
  currentInterval = 30000,
  showRefreshButton = true,
  showSettingsButton = true,
  onOpenSettings
}) => {
  const formatTime = (date) => {
    if (!date) return 'Jamais';
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusIcon = () => {
    if (loading) {
      return <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (error) {
      return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Mise à jour...';
    if (error) return 'Erreur de connexion';
    return 'Connecté';
  };

  const getIntervalText = () => {
    if (currentInterval === 0) return 'Désactivé';
    return `${Math.round(currentInterval / 1000)}s`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      <span>•</span>
      <span>Dernière MAJ: {formatTime(lastUpdate)}</span>
      <span>•</span>
      <span>Auto-refresh: {getIntervalText()}</span>
      
      {showRefreshButton && (
        <>
          <span>•</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </>
      )}

      {showSettingsButton && onOpenSettings && (
        <>
          <span>•</span>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            title="Paramètres de mise à jour automatique"
          >
            <Cog6ToothIcon className="w-3 h-3" />
            Paramètres
          </button>
        </>
      )}
    </div>
  );
};

export default AutoRefreshIndicator; 