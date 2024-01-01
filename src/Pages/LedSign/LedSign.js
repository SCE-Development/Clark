import React, { useState, useEffect } from 'react';
import { healthCheck, updateSignText } from '../../APIFunctions/LedSign';
import { Spinner, Input, Button, Container } from 'reactstrap';


import ConfirmationModal
  from '../../Components/DecisionModal/ConfirmationModal.js';

function LedSign(props) {
  const [signHealthy, setSignHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [brightness, setBrightness] = useState(50);
  const [scrollSpeed, setScrollSpeed] = useState(25);
  const [backgroundColor, setBackgroundColor] = useState('#0000ff');
  const [textColor, setTextColor] = useState('#00ff00');
  const [borderColor, setBorderColor] = useState('#ff0000');
  const [awaitingSignResponse, setAwaitingSignResponse] = useState(false);
  const [awaitingStopSignResponse, setAwaitingStopSignResponse]
    = useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState();
  const [stopRequestSuccesful, setStopRequestSuccesful] = useState();
  const [shutdownToggle, setShutdownToggle] = useState(false);
  const colorInputs = [
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
  ];
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
      max: '50',
      step: '1',
      type: 'range',
      onChange: e => setScrollSpeed(e.target.value)
    }
  ];
  const headerProps = {
    title: 'LED Sign'
  };

  async function handleSend() {
    setAwaitingSignResponse(true);
    const signResponse = await updateSignText(
      {
        text,
        brightness,
        scrollSpeed,
        backgroundColor,
        textColor,
        borderColor,
        email: props.user.email,
        firstName: props.user.firstName,
      },
      props.user.token
    );
    setRequestSuccessful(!signResponse.error);
    setAwaitingSignResponse(false);
  }

  async function handleStop() {
    setAwaitingStopSignResponse(true);
    const signResponse = await updateSignText(
      {
        ledIsOff: true,
        email: props.user.email,
        firstName: props.user.firstName,
      },
      props.user.token
    );
    setStopRequestSuccesful(!signResponse.error);
    setAwaitingStopSignResponse(false);
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
  useEffect(() => {
    async function checkSignHealth() {
      setLoading(true);
      const status = await healthCheck(props.user.firstName);
      if (status && !status.error) {
        setSignHealthy(true);
        const { responseData } = status;
        if (responseData && responseData.text) {
          setText(responseData.text);
          setBrightness(responseData.brightness);
          setScrollSpeed(responseData.scrollSpeed);
          setBackgroundColor(responseData.backgroundColor);
          setTextColor(responseData.textColor);
          setBorderColor(responseData.borderColor);
        }
      } else {
        setSignHealthy(false);
      }
      setLoading(false);
    }
    checkSignHealth(props.user.firstName);
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

  return (
    <div>
      <div className="space-y-12 mt-10  gap-x-6 gap-y-8 w-full sm:grid-cols-6">
        <div className="flex border-b border-gray-900/10 pb-12 w-full">
          <div className="flex flex-col justify-center items-center sm:col-span-3 w-full">
            {
              inputArray.map((input) => (
                <div key={input.title} className="sm:col-span-2 sm:col-start-1 w-1/3 ">
                  <div className="mt-2 ">
                    <label htmlFor="copies" className="block text-sm font-medium leading-6">{input.title}</label>
                    <input
                      type={input.type}
                      value={input.value}
                      name="city"
                      id="city"
                      autocomplete="address-level2"
                      onChange={input.onChange}
                      className="indent-2 text-white block w-full rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              ))
            }

            <button className='btn w-1/3 bg-red-500 hover:bg-red-400 text-black mt-4' onClick={handleStop}>
              Stop
            </button>
            <button className='btn w-1/3 bg-green-500 hover:bg-green-400 text-black mt-2' onClick={handleSend}>
              Send
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default LedSign;
