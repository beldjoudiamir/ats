import React from "react";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">Page non trouvée ou accès interdit.</p>
    <a href="/login" className="mt-4 text-blue-600 hover:underline">Retour à la connexion</a>
  </div>
);

export default NotFound; 