import React from "react";
import PropTypes from "prop-types";

const CommissionnaireActions = ({ commissionnaire, onEdit, onDelete }) => (
  <>
    <button
      onClick={() => onEdit(commissionnaire)}
      className="px-1 py-0.5 text-white bg-blue-600 rounded text-[6px] sm:text-[8px] hover:bg-blue-700"
    >
      Modifier
    </button>
    <button
      onClick={() => onDelete(commissionnaire)}
      className="px-1 py-0.5 text-white bg-red-600 rounded text-[6px] sm:text-[8px] hover:bg-red-700"
    >
      Supprimer
    </button>
  </>
);

CommissionnaireActions.propTypes = {
  commissionnaire: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommissionnaireActions; 