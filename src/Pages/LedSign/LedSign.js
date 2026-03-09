import React, { useState, useEffect } from 'react';
import { healthCheck, updateSignText } from '../../APIFunctions/LedSign';
import {
  getPermissionRequest,
  createPermissionRequest,
}from '../../APIFunctions/PermissionRequest';
import { useSCE } from '../../Components/context/SceContext';
import { membershipState } from '../../Enums';

import './ledsign.css';

function LedSign() {
  const { user } = useSCE();
  const [signHealthy, setSignHealthy] = useState(false);
  const [showInput, setInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [brightness, setBrightness] = useState(50);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState('#0000ff');
  const [textColor, setTextColor] = useState('#00ff00');
  const [borderColor, setBorderColor] = useState('#ff0000');
  const [expiration, setExpiration] = useState(null);
  const [existingExpirationFromSign, setExistingExpirationFromSign] = useState(null);
  const [awaitingSignResponse, setAwaitingSignResponse] = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState();
  const [stopRequestSuccesful, setStopRequestSuccesful] = useState();
  const [permissionRequest, setPermissionRequest] = useState(null);
  const [checkingPermission, setCheckingPermission] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);
  const inputArray = [
    {
      title: 'Sign Text:',
      placeholder: 'Enter Text',
      value: text,
      type: 'text',
      onChange: e => setText(e.target.value),
      maxLength: '50'
    },
    {
      title: 'Background Color',
      value: backgroundColor,
      type: 'color',
      onChange: e => setBackgroundColor(e.target.value)
    },
    {
      title: 'Text Color',
      value: textColor,
      type: 'color',
      onChange: e => setTextColor(e.target.value)
    },
    {
      title: 'Border Color',
      value: borderColor,
      type: 'color',
      onChange: e => setBorderColor(e.target.value)
    },
    {
      title: 'Brightness:',
      value: brightness,
      min: '25',
      max: '75',
      step: '1',
      type: 'range',
      onChange: e => setBrightness(e.target.value)
    },
    {
      title: 'Scroll Speed:',
      id: 'scroll-speed',
      value: scrollSpeed,
      min: '0',
      max: '10',
      step: '0.1',
      type: 'range',
      onChange: e => setScrollSpeed(Number(e.target.value) || 0)
    }
  ];

  function isExpired() {
    if (!expiration) {
      return false;
    }
    const currDate = new Date();
    const expireDateObject = new Date(expiration);
    return expireDateObject < currDate;
  }

  function getFormattedTime(maybeISOString = null) {
    let date = new Date();
    if (maybeISOString) {
      date = new Date(maybeISOString);
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  }

  async function handleExpiration() {
    setExpiration(null);
    setInput(!showInput);
  }

  async function handleSend() {
    let expirationToUse = null;
    if (expiration) {
      expirationToUse = new Date(expiration).toISOString();
    }

    setAwaitingSignResponse(true);
    let correctedScrollSpeed = 10 - scrollSpeed;
    const signResponse = await updateSignText(
      {
        text,
        brightness,
        scrollSpeed: correctedScrollSpeed,
        backgroundColor,
        textColor,
        borderColor,
        expiration: expirationToUse,
        email: user.email,
        firstName: user.firstName,
      },
      user.token
    );
    setRequestSuccessful(!signResponse.error);
    setAwaitingSignResponse(false);
  }

  async function handleStop() {
    const signResponse = await updateSignText(
      {
        ledIsOff: true,
        email: user.email,
        firstName: user.firstName,
      },
      user.token
    );
    setStopRequestSuccesful(!signResponse.error);
  }

  function renderRequestStatus() {
    if (awaitingSignResponse ||
      (requestSuccessful === undefined && stopRequestSuccesful === undefined)) {
      return <></>;
    } else if (requestSuccessful) {
      return <p className='sign-available'>Sign successfully updated!</p>;
    } else if (stopRequestSuccesful) {
      return <p className="sign-available">Sign successfully stopped!</p>;
    } else {
      return (
        <p className='sign-unavailable'>The request failed. Try again later.</p>
      );
    }
  }

  function maybeShowExpirationDate() {
    if (!existingExpirationFromSign) {
      return <></>;
    }
    const humanizedExpiration = new Date(existingExpirationFromSign)
      .toLocaleString('en-US', {
        timeZoneName: 'short' // e.g., "Pacific Standard Time"
      });
    return <p>The current sign message will expire on {humanizedExpiration}</p>;
  }

  function getExpirationButtonOrInput() {
    if (showInput) {
      return <>
        <div className='w-2/3 lg:w-1/2 flex items-center justify-items-center flex-col items-center sm:flex-row'>
          <input className='m-1 mt-6 w-full rounded-md text-center flex-1 sm:pt-1 pl-4' type="datetime-local" id="endTime" name="endTime" onChange={e => setExpiration(e.target.value)} />
          <button className='btn w-full bg-gray-600 hover:bg-gray-500 text-white mr-4 sm:w-1/3 ml-5 mt-5 mb-3' onClick={e => setInput(!showInput)}>
            Cancel Expiration
          </button>
        </div>
        {
          isExpired() && <div className="w-2/3 lg:w-1/2 text-left break-words">
            <p className='text-red-600 dark:text-red-400'>
              Your selected expiration is considered behind the current time of {getFormattedTime()}.
            </p>
            <p className='text-red-600 dark:text-red-400'>
              Submitting a message with this expiration will not update the sign.
            </p>
          </div>
        }
      </>;
    }

    return <button className='btn w-2/3 lg:w-1/2 bg-gray-500 hover:bg-gray-400 text-white mt-2' onClick={handleExpiration}>
      Set Expiration
    </button>;
  }

  useEffect(() => {
    async function checkSignHealth() {
      setLoading(true);
      if (user.accessLevel < membershipState.OFFICER) {
        setCheckingPermission(true);
        const result = await getPermissionRequest('LED_SIGN', user.token);
        if (!result.error && result.responseData) {
          setPermissionRequest(result.responseData);
        }
        setCheckingPermission(false);
      }
      const status = await healthCheck(user.firstName);
      if (status.error) {
        setSignHealthy(false);
      }
      setSignHealthy(true);
      const { responseData } = status;
      if (responseData !== null && Object.keys(responseData).length) {
        setText(responseData.text);
        setBrightness(responseData.brightness);
        setScrollSpeed(responseData.scrollSpeed);
        setBackgroundColor(responseData.backgroundColor);
        setTextColor(responseData.textColor);
        setBorderColor(responseData.borderColor);
        setExistingExpirationFromSign(responseData.expiration);
      }
      setLoading(false);
    }
    checkSignHealth();
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return (
      <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
      </svg>
    );
  } else if (!signHealthy) {
    return (
      <div className='flex justify-center items-center mt-10 w-full'>
        <div role="alert" className="w-1/2 text-center alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className=''>The LED sign is down. Reach out to SCE Development team if refreshing doesn't fix</p>
        </div>
      </div>
    );
  }

  function getAnimationDuration() {
    // the scrollSpeed input can be can be anywhere from 0 to 10. the
    // lower the duration is, the faster the text scrolls. we divide by
    // 10 to lower the duration so the preview scrolls faster instead of
    // using the scrollSpeed directly.
    return (11 - scrollSpeed);
  }

  async function handleRequestAccess() {
    setRequestingPermission(true);
    const result = await createPermissionRequest('LED_SIGN', user.token);
    if (!result.error) {
      setPermissionRequest(result.responseData);
    }
    setRequestingPermission(false);
  }

  function renderPermissionRequestUI() {
    if (user.accessLevel >= membershipState.OFFICER) {
      return null;
    }

    if (checkingPermission || requestingPermission) {
      return (
        <div className="w-2/3 lg:w-1/2 text-center py-4">
          <p>Loading...</p>
        </div>
      );
    }

    if (permissionRequest) {
      return (
        <div className="w-2/3 lg:w-1/2 text-center py-4 space-y-2 fade-in">
          <p className="text-gray-700 dark:text-gray-300">
            You requested access to the sign on {getFormattedTime(permissionRequest.createdAt)}.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Drop a message in Discord to speed up the process!
          </p>
        </div>
      );
    }

    return (
      <div className="w-2/3 lg:w-1/2 text-center py-4 space-y-2 fade-in">
        <p className="text-gray-700 dark:text-gray-300">
          You need permission to access the LED sign.
        </p>
        <button
          className="btn bg-blue-500 hover:bg-blue-400 text-white"
          onClick={handleRequestAccess}
          disabled={requestingPermission}
        >
          {requestingPermission ? 'Requesting...' : 'Request Access'}
        </button>
      </div>
    );
  }

  function renderSignControls() {
    return (
      <>
        <div className='w-2/3 lg:w-1/2'>
          <label className="block text-sm font-medium leading-6">Preview</label>
          <div className="mt-2">
            <div
              className="led-sign-preview-border-top"
              style={{ backgroundColor: borderColor }}
            ></div>
            <div
              className="led-sign-preview-background"
              style={{ backgroundColor: backgroundColor }}
            >
              <div className="led-sign-marquee-container">
                <div className="led-sign-marquee" style={{ animationDuration: `${getAnimationDuration()}s` }}>
                  <h1 className="led-sign-preview-text text-3xl" style={{ color: textColor }}>
                    {text.padEnd(28, ' ')}
                  </h1>
                </div>
              </div>
            </div>
            <div
              className="led-sign-preview-border-bottom"
              style={{ backgroundColor: borderColor }}
            ></div>
          </div>
        </div>

        {maybeShowExpirationDate()}
        {getExpirationButtonOrInput()}

        {inputArray.map(({ id, title, type, value, onChange, ...rest }) => (
          <div key={title} className="sm:col-span-2 sm:col-start-1 w-2/3 lg:w-1/2">
            <div className="mt-2">
              <label htmlFor={id} className="block text-sm font-medium leading-6">{title}</label>
              <input
                type={type}
                value={value}
                id={id}
                onChange={onChange}
                className="indent-2 text-black dark:text-white block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...rest}
              />
            </div>
          </div>
        ))}

        <button className='btn w-2/3 lg:w-1/2 bg-red-500 hover:bg-red-400 text-black mt-4' onClick={handleStop}>
          Stop
        </button>
        <button className='btn w-2/3 lg:w-1/2 bg-green-500 hover:bg-green-400 text-black mt-2' onClick={handleSend}>
          Send
        </button>
        {renderRequestStatus()}
      </>
    );
  }

  return (
    <div className="flex justify-center items-center mt-10 w-full">
      <div className="space-y-12 gap-x-6 gap-y-8 w-full flex flex-col items-center">
        {user.accessLevel >= membershipState.OFFICER
          ? renderSignControls()
          : renderPermissionRequestUI()
        }
      </div>
    </div>
  );
}

export default LedSign;
