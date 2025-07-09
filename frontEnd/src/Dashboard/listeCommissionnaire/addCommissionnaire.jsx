
import PropTypes from 'prop-types';

const AddCommissionnaire = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-25 z-50 p-4 sm:p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un Commissionnaire</h2>
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4 w-full">
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom de l'entreprise"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

AddCommissionnaire.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddCommissionnaire;
