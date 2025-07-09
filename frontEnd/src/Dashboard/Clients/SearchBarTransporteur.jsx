import React from "react";
import PropTypes from "prop-types";
import { MagnifyingGlassIcon, TruckIcon } from "@heroicons/react/24/outline";

const SearchBarTransporteur = ({ value, onChange, onSearch, placeholder }) => (
  <form onSubmit={onSearch} className="flex items-center w-full gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg mt-2 p-2">
    <div className="relative w-full max-w-sm">
      <label htmlFor="transporteur-search" className="sr-only">Recherche</label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <TruckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="text"
        id="transporteur-search"
        value={value}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder || "Recherche rapide..."}
      />
    </div>
    <button
      type="submit"
      className="p-2.5 text-sm font-medium text-white bg-sky-700 rounded-lg border border-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <MagnifyingGlassIcon className="w-5 h-5" />
    </button>
  </form>
);

SearchBarTransporteur.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBarTransporteur; 