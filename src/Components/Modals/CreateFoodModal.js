import React from 'react';
import FoodForm from '../../Pages/SCEatsAdmin/FoodForm';

export default function CreateFoodModal( {setName, setType, setPhoto, setPrice, setQuantity, expiration, setExpiration, handleCreate } ) {
  return (
    <dialog id="my_modal_3" className="modal">
      <form method="dialog" className="modal-box w-1/2 max-w-md">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn label-text btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        <h3 className="font-bold text-lg">Create New Food</h3>
        <FoodForm
          setName={setName}
          setType={setType}
          setPhoto={setPhoto}
          setPrice={setPrice}
          setQuantity={setQuantity}
          expiration={expiration}
          setExpiration={setExpiration}
        />
        <button
          type="submit"
          className="rounded-md bg-indigo-600 mt-4 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => handleCreate()}
        >
          Save
        </button>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

