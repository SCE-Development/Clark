import React, { useEffect } from 'react';

export default function ConfirmationModal(props) {
  const { headerText, bodyText, handleConfirmation, open, handleCancel = () => {}, confirmClassAddons = '' } = props;

  const confirmText = props.confirmText || 'Confirm';
  const cancelText = props.cancelText || 'Cancel';

  useEffect(() => {
    if (open) {
      document.getElementById('confirmation-modal').showModal();
    }
  }, [open]);
  return (<>
    <dialog id="confirmation-modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{headerText}</h3>
        <p className="text-sm text-gray-500">
          {bodyText}
        </p>
        <div className="modal-action">

          <form method="dialog">
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button onClick={handleConfirmation} className={`btn inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${confirmClassAddons} sm:ml-3 sm:w-auto`}>
                {confirmText}
              </button>
              <button onClick={handleCancel} className="btn mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto">
                {cancelText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  </>
  );
}
