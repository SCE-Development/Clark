import { useState } from 'react';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal';

export function CardDisplay({ cards, onDeleteCard }) {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  function handleDelete(card) {
    setCardToDelete(card);
    setToggleDelete(true);
  }

  function confirmDelete() {
    if (onDeleteCard && cardToDelete) {
      onDeleteCard(cardToDelete.cardBytes);
    }
    setToggleDelete(false);
    setCardToDelete(null);
  }

  function cancelDelete() {
    setToggleDelete(false);
    setCardToDelete(null);
  }

  return (
    <div>
      <ConfirmationModal
        headerText={`Delete "${cardToDelete?.alias}"?`}
        bodyText={`Are you sure you want to delete "${cardToDelete?.alias}"?`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        confirmClassAddons='bg-red-600 hover:bg-red-500'
        handleConfirmation={confirmDelete}
        open={toggleDelete}
        handleCancel={cancelDelete}
      />
      <div className='px-4'>
        <div className='px-6 border rounded-lg border-gray-300 dark:border-white/10'>
          <table className='table px-3'>
            <thead>
              <tr>
                <th className="text-base text-gray-700 dark:text-white/70">Alias</th>
                <th className="text-base text-gray-700 dark:text-white/70">Card Bytes</th>
                <th className="text-base text-gray-700 dark:text-white/70 text-center">Verified Count</th>
                <th className="text-base text-gray-700 dark:text-white/70">Created</th>
                <th className="text-base text-gray-700 dark:text-white/70">Last Verified</th>
                <th className="text-base text-gray-700 dark:text-white/70 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 ? (
                <tr>
                  <td colSpan={6} className='text-center text-gray-700 dark:text-white/70 py-6'>
                    No cards found.
                  </td>
                </tr>
              ) : cards.map(card => (
                <tr
                  className='break-all !rounded md:break-keep hover:bg-gray-100 dark:hover:bg-white/10'
                  key={card.cardBytes}
                >
                  <td>{card.alias}</td>
                  <td>{card.cardBytes}</td>
                  <td className="text-center">{card.verifiedCount}</td>
                  <td>{new Date(card.createdAt).toLocaleString()}</td>
                  <td>{new Date(card.lastVerified).toLocaleString()}</td>
                  <td>
                    <div className='flex items-center justify-center'>
                      <button
                        className='p-2 hover:bg-gray-200 dark:hover:bg-white/30 rounded-xl'
                        onClick={() => handleDelete(card)}
                        title="Delete"
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-5 h-5 text-red-600'>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
