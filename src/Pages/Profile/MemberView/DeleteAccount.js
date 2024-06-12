import React, { useEffect, useState } from 'react';
import { deleteUserByID } from '../../../APIFunctions/User';

export default function DeleteAccountModal(props) {
  const { bannerCallback = (message, color) => { }, confirmClassAddons } = props;
  const [users, setUsers] = useState([]);
  const [queryResult, setQueryResult] = useState([]);

  async function deleteUser(user) {
    const deleteAccountResponse = await deleteUserByID(
      user._id,
      props.user.token
    );
    if (!deleteAccountResponse.error) {
      if (user._id === props.user._id) {
        // logout
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
      }
      setUsers(
        users.filter(
          child => !child._id.includes(user._id)
        )
      );
      setQueryResult(
        queryResult.filter(
          child => !child._id.includes(user._id)
        )
      );
    }
  }

  return (<>
    <dialog id="delete-account-modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Are you sure you want to delete your account? All your data will be removed from our database.</h3>
        <div className="modal-action">
          <form method="dialog">
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                className={`btn bg-red-600 hover:bg-red-700 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${confirmClassAddons} sm:ml-3 sm:w-auto`}
                onClick={() => {
                  deleteUser(props.user);
                }}
              >
                Delete
              </button>
              <button
                className="btn mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  </>
  );
}
