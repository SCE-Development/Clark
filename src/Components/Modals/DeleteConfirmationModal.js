import React from 'react';

export default function DeleteConfirmationModal({ foodToDelete, deleteID, handleDelete, onClose }) {
  return (
    <dialog id="confirm_delete" className="modal">
      <form method="dialog" className="modal-box w-1/2 max-w-md">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        <h3 className="font-bold text-lg">Delete {foodToDelete.name}?</h3>
        <p className="py-4">This action cannot be undone!</p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => {
              handleDelete(deleteID);
              onClose();
            }}
          >
            Delete
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

