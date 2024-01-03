import React, { useEffect, useState } from 'react';

import { setUserEmailPreference, getUserData } from '../../APIFunctions/User';

export default function EmailPreferencesPage(props) {
  const BLUE = '#2d75eb';
  const GREEN = '#1cc75b';
  const RED = '#cf533a';
  const [isOptedIntoEmails, setIsOptedIntoEmails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [buttonColor, setButtonColor] = useState(BLUE);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [message, setMessage] = useState('Submit');

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userEmailParam = urlParams.get('user');
      setUserEmail(userEmailParam);
      if (!userEmailParam) {
        window.location = window.location.origin;
      } else {
        const response = await getUserData(urlParams.get('user'));
        if (!response.error) {
          setUserFirstName(response.responseData.firstName);
          setUserLastName(response.responseData.lastName);
          setIsOptedIntoEmails(response.responseData.emailOptIn);
        } else {
          setErrorLoading(true);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const response = await setUserEmailPreference(
      userEmail,
      isOptedIntoEmails
    );
    if (!response.error) {
      setMessage('Yay! You changed your email preference!');
      setButtonColor(GREEN);
      setTimeout(() => {
        setButtonColor(BLUE);
        setMessage('Submit');
      }, 3000);
    } else {
      setButtonColor(RED);
      setMessage('Unable to submit your preference, try reloading? :(');
    }
  };

  if (errorLoading) {
    return (
      <div className='email-preferences'>
        {/*
          dumb hacks because the navbar otherwise covers up the below content
        */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <h3 className='text-2xl'>
            The email page was unable to load at this time.
          </h3>
          <h4>

            If the problem persists after reloading this page, please contact us on Discord
            (

            <span className='text-blue-600 hover:underline'>
              <a href='https://discord.gg/KZCKCEz5YA'>
                invite link
              </a>
            </span>
            )
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className='email-preferences'>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        {!loading && <>
          <h1 className='text-3xl'>
            Hello {userFirstName} {userLastName},
          </h1>
          <p className='text-xl'>
            What would you like to hear about?
          </p>
          <div className='flex flex-col items-center justify-center mt-10'>
            <div class="flex mb-4">
              <input
                id="default-radio-1"
                type="radio"
                checked={isOptedIntoEmails}
                name="default-radio"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={() => setIsOptedIntoEmails(true)}
              />
              <label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {' '}I would like to continue to recieve club update emails from SCE
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="default-radio-2"
                type="radio"
                checked={!isOptedIntoEmails}
                name="default-radio"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={() => setIsOptedIntoEmails(false)}
              />
              <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {' '}No thanks, I would like to unsubscribe from all emails (best choice)
              </label>
            </div>
            <button
              className='btn text-black mt-5'
              style={{
                backgroundColor: buttonColor,
              }}
              onClick={handleSave}
            >
              {message}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}
