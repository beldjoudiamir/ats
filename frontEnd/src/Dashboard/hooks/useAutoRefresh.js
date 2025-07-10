import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api.js';

const useAutoRefresh = (endpoints, initialInterval = 30000) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentInterval, setCurrentInterval] = useState(initialInterval);
  const intervalRef = useRef(null);
  const endpointsRef = useRef(endpoints);

  // Mettre à jour la référence des endpoints
  useEffect(() => {
    endpointsRef.current = endpoints;
  }, [endpoints]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = endpointsRef.current.map(endpoint => 
        axios.get(`${API_BASE_URL}/api/${endpoint}`)
          .then(response => ({ [endpoint]: response.data }))
          .catch(err => ({ [endpoint]: [] }))
      );

      const results = await Promise.all(promises);
      const newData = results.reduce((acc, result) => ({ ...acc, ...result }), {});
      
      setData(newData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Pas de dépendances pour éviter les re-renders

  const setupInterval = useCallback(() => {
    // Nettoyer l'intervalle existant
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Créer un nouvel intervalle seulement si l'intervalle > 0
    if (currentInterval > 0) {
      intervalRef.current = setInterval(fetchData, currentInterval);
    }
  }, [currentInterval, fetchData]);

  // Premier chargement et configuration de l'intervalle
  useEffect(() => {
    fetchData();
    setupInterval();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Seulement au montage du composant

  // Mettre à jour l'intervalle quand il change
  useEffect(() => {
    setupInterval();
  }, [currentInterval, setupInterval]);

  const refreshNow = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateInterval = useCallback((newInterval) => {
    setCurrentInterval(newInterval);
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdate,
    currentInterval,
    refreshNow,
    updateInterval
  };
};

export default useAutoRefresh; 