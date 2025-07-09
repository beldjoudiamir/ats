import React from "react";
import PropTypes from "prop-types";
import CommissionnaireActions from "./CommissionnaireActions";

const CommissionnaireTable = ({ commissionnaires, onEdit, onDelete, onDetails }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-[8px] sm:text-[10px] text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-[900px]">
      <thead className="text-[6px] sm:text-[8px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th className="px-1 py-1 w-20 sm:w-24">Entreprise</th>
          <th className="px-1 py-1 w-16 sm:w-20">Représentant</th>
          <th className="px-1 py-1 w-16 sm:w-20">SIRET</th>
          <th className="px-1 py-1 w-16 sm:w-20">TVA</th>
          <th className="px-1 py-1 w-20 sm:w-24">Adresse</th>
          <th className="px-1 py-1 w-12 sm:w-16">Ville</th>
          <th className="px-1 py-1 w-10 sm:w-12">CP</th>
          <th className="px-1 py-1 w-12 sm:w-16">Pays</th>
          <th className="px-1 py-1 w-16 sm:w-20">Téléphone</th>
          <th className="px-1 py-1 w-20 sm:w-24">Email</th>
          <th className="px-1 py-1 w-16 sm:w-20">Actions</th>
        </tr>
      </thead>
      <tbody>
        {commissionnaires.map((info) => (
          <tr key={info._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <td className="px-1 py-1 truncate">{info.nom_de_entreprise_du_comisionaire}</td>
            <td className="px-1 py-1 truncate">{info.representant}</td>
            <td className="px-1 py-1 truncate">{info.siret || '-'}</td>
            <td className="px-1 py-1 truncate">{info.tva || '-'}</td>
            <td className="px-1 py-1 truncate">{info.adresse}</td>
            <td className="px-1 py-1 truncate">{info.ville}</td>
            <td className="px-1 py-1 truncate">{info.code_postal}</td>
            <td className="px-1 py-1 truncate">{info.pays}</td>
            <td className="px-1 py-1 truncate">{info.phone}</td>
            <td className="px-1 py-1 truncate">{info.email}</td>
            <td className="px-1 py-1 flex space-x-1">
              <button
                onClick={() => onDetails(info)}
                className="px-1 py-0.5 text-white bg-green-600 rounded text-[6px] sm:text-[8px] hover:bg-green-700"
              >
                Détails
              </button>
              <CommissionnaireActions
                commissionnaire={info}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

CommissionnaireTable.propTypes = {
  commissionnaires: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
};

export default CommissionnaireTable; 