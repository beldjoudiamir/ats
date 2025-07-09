import React from "react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

export default function ConfirmModal({ show, onCancel, onConfirm, message }) {
  return (
    <Modal show={show} onClose={null}>
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirmer la suppression</h2>
        <p className="mb-4 text-gray-600 text-center">{message}</p>
        <div className="flex gap-4 mt-2">
          <Button
            onClick={onCancel}
            className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 rounded"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
} 