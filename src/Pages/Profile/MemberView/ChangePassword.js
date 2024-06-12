import React, { useEffect, useState } from 'react';
import { editUser } from '../../../APIFunctions/User';

export default function ChangePasswordModal(props) {
  const { bannerCallback = (message, color) => { }, confirmClassAddons } = props;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const INPUT_CLASS_NAME = 'indent-2 block w-full rounded-md border-0 py-1.5   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  async function changePassword() {
    const apiResponse = await editUser(
      {
        ...props.user,
        password
      },
      props.user.token
    );

    if (!apiResponse.error) {
      bannerCallback('Password Updated', 'success');
    } else {
      bannerCallback('Unable to update password. Please try again or reach out to dev team if error persists.', 'error', 7000);
    }
    setPassword('');
    setConfirmPassword('');
  }

  return (<>
    <dialog id="change-password-modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reset Password</h3>
        <label htmlFor="new-password" className="block text-sm font-medium leading-6 mt-2">
            New Password
        </label>
        <div className="mt-2">
          <input
            value={password}
            id="new-password"
            name="new-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={INPUT_CLASS_NAME}
          />
        </div>
        <label htmlFor="confirm" className="block mt-2 text-sm font-medium leading-6 ">
            Confirm Password
        </label>
        <div className="mt-2">
          <input
            id="confirm"
            value={confirmPassword}
            name="confirm"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            className={INPUT_CLASS_NAME}
          />
        </div>

        <div className="form-control mt-1">
          <label className="label cursor-pointer">
            <span className="label-text">Show Password</span>
            <input
              type="checkbox"
              className="toggle"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          </label>
        </div>

        <div className="modal-action">

          <form method="dialog">
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                disabled={password != confirmPassword || !password}
                onClick={() => {
                  changePassword();
                }}
                className={`btn inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${confirmClassAddons} sm:ml-3 sm:w-auto`}
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setPassword('');
                  setConfirmPassword('');
                }}
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
