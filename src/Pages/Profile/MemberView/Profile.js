
import React, { useEffect, useState } from 'react';
import { getSelfId } from '../../../APIFunctions/User';
import ChangePasswordModal from './ChangePassword';
import { membershipState, membershipStateToString } from '../../../Enums';

export default function Profile(props) {
  const [response, setResponse] = useState({});
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerColor, setBannerColor] = useState('');

  async function getUserFromApi() {
    const response = await getSelfId(props.user._id, props.user.token);
    setResponse(response.responseData);
    // console.debug("response is " + response.responseData);
  }
  useEffect(() => {
    getUserFromApi();
  }, []);

  function renderExpirationDate() {
    if (response.accessLevel >= membershipState.OFFICER) {
      return (
        <span>
          N/A due to {membershipStateToString(response.accessLevel)} account
        </span>
      );
    }
    return (
      <span>{new Date(response.membershipValidUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    );
  }

  return (
    <div className='bg-gradient-to-r from-gray-800 to-gray-600 min-h-[calc(100dvh-86px)] px-6'>
      {bannerMessage &&
      <div role="alert" className={`alert alert-${bannerColor} my-6`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <p>{bannerMessage}</p>
      </div>
      }
      <div className='h-6'/>
      <div className="bg-slate-300 p-6 shadow-sm rounded-lg w-full">
        <div className="flex justify-between items-center space-x-2 font-semibold text-gray-900 leading-8">
          <div className='flex space-x-3'>
            <svg className="mt-1 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="tracking-wide text-lg">{response.firstName} {response.lastName}</span>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() =>
                document.getElementById('change-password-modal').showModal()
              }
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="text-gray-700">
          <div className="grid text-sm">
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Email</div>
              <div className="px-4 py-2">
                <a className="text-blue-800" href="mailto:jane@example.com">{response.email}</a>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Pages printed this week (resets Sunday)</div>
              <div className="px-4 py-2">{response.pagesPrinted} pages</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Account Type</div>
              <div className="px-4 py-2">{membershipStateToString(response.accessLevel)}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Account Created</div>
              <div className="px-4 py-2">{new Date(response.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Membership Expiration</div>
              <div className="px-4 py-2">{renderExpirationDate()}</div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        user={{ ...props.user, token: props.user.token }}
        bannerCallback={(message, color, delay = 3000) => {
          setBannerMessage(message);
          setBannerColor(color);
          setTimeout(() => {
            setBannerMessage('');
            setBannerColor('');
          }, delay);
        }}
      />
    </div>
  );
}
