import React from "react";
import PropTypes from "prop-types";

const TransporteurActions = ({ transporteur, onEdit, onDelete }) => (
  <>
    <button
      onClick={() => onEdit(transporteur)}
      className="px-1 py-0.5 text-white bg-blue-600 rounded text-[6px] sm:text-[8px] hover:bg-blue-700"
    >
      Modifier
    </button>
    <button
      onClick={() => onDelete(transporteur)}
      className="px-1 py-0.5 text-white bg-red-600 rounded text-[6px] sm:text-[8px] hover:bg-red-700"
    >
      Supprimer
    </button>
  </>
);

TransporteurActions.propTypes = {
  transporteur: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TransporteurActions; 