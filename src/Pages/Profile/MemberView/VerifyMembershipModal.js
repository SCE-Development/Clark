import React, { useEffect, useState } from 'react';
import { useSCE } from '../../../Components/context/SceContext';
import { verifyMembershipFromDb } from '../../../APIFunctions/MembershipPayment';
import { membershipState } from '../../../Enums';

const INPUT_CLASS_NAME = 'indent-2 block w-full rounded-md border-0 py-1.5 bg-white text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';

export default function VerifyMembershipModal(props) {
  const { bannerCallback = (message, color) => { }, confirmClassAddons, onVerificationSuccess = () => {} } = props;
  const [confirmationCode, setConfirmationCode] = useState('');
  const { user } = useSCE();

  async function verifyMembership() {
    const apiResponse = await verifyMembershipFromDb(
      user.token,
      confirmationCode,
    );
    if (apiResponse.error) {
      bannerCallback(`Unable to verify membership. Please try again later. Status Code: ${apiResponse.responseData || 500}`, 'red');
      return;
    }
    bannerCallback('Congrats, you confirmed your membership!');
    setConfirmationCode('');
    document.getElementById('verify-membership-modal').close();
    onVerificationSuccess();
  }

  function modalContent() {
    return (
      <>
        <p className="text-sm text-gray-500 mt-2">
          Please enter the confirmation code you received via email.
        </p>
        <label htmlFor="confirmation-code" className="block text-sm font-medium leading-6 mt-2">
          Confirmation Code
        </label>
        <div className="mt-2">
          <input
            value={confirmationCode}
            id="confirmation-code"
            name="confirmation-code"
            type="text"
            placeholder="Enter confirmation code"
            onChange={(e) => {
              setConfirmationCode(e.target.value);
            }}
            className={INPUT_CLASS_NAME}
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                disabled={!confirmationCode}
                onClick={async () => {
                  await verifyMembership();
                }}
                className={`btn inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${confirmClassAddons} sm:ml-3 sm:w-auto`}
              >
                Verify
              </button>
              <button
                onClick={() => {
                  setConfirmationCode('');
                }}
                className="btn mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (<>
    <dialog id="verify-membership-modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Verify Membership</h3>
        {modalContent()}
      </div>
    </dialog>
  </>
  );
}
