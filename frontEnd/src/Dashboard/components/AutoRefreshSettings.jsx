import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AutoRefreshSettings = ({ 
  currentInterval, 
  onIntervalChange, 
  isOpen, 
  onClose 
}) => {
  const [interval, setInterval] = useState(currentInterval);

  useEffect(() => {
    setInterval(currentInterval);
  }, [currentInterval]);

  const handleSave = () => {
    onIntervalChange(interval);
    onClose();
  };

  const intervalOptions = [
    { value: 10000, label: '10 secondes' },
    { value: 30000, label: '30 secondes' },
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' },
    { value: 600000, label: '10 minutes' },
    { value: 0, label: 'Désactivé' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Paramètres de mise à jour automatique
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalle de mise à jour
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {intervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {interval === 0 ? (
              <p>La mise à jour automatique sera désactivée.</p>
            ) : (
              <p>
                Les données seront mises à jour automatiquement toutes les{' '}
                {Math.round(interval / 1000)} secondes.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoRefreshSettings; 