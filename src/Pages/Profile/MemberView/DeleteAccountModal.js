import { deleteUserByID } from '../../../APIFunctions/User';

export default function DeleteAccountModal(props) {
  const { bannerCallback = () => {} } = props;

  async function deleteAccount() {
    const apiResponse = await deleteUserByID(
      props.user._id,
      props.user.token
    );

    if (!apiResponse.error) {
      bannerCallback('Account Deleted', 'success');
      setTimeout(() => {
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
      }, 2000);
    } else {
      bannerCallback(
        'Unable to delete account. Please try again or reach out to the dev team if this error persists.',
        'error',
        7000
      );
    }
  }

  return (
    <>
      <dialog
        id="delete-account-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Delete Account</h3>
          <h2>
            Are you sure you want to delete your account? All of your data will
            be removed from our database.
          </h2>
          <div className="modal-action">
            <form method="dialog">
              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    deleteAccount();
                  }}
                  className="btn btn-error inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                >
                  Yes, delete
                </button>
                <button className="btn mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto">
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
