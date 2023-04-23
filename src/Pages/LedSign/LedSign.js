import React, { useState, useEffect } from 'react';
import { healthCheck, updateSignText } from '../../APIFunctions/LedSign';
import { Spinner, Input, Button, Container } from 'reactstrap';
import './led-sign.css';
import Header from '../../Components/Header/Header';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal.js';

function LedSign(props) {
  const [signHealthy, setSignHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('Welcome to SCE');
  const [brightness, setBrightness] = useState(50);
  const [scrollSpeed, setScrollSpeed] = useState(25);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#0004ff');
  const [awaitingSignResponse, setAwaitingSignResponse] = useState(false);
  const [awaitingStopSignResponse, setAwaitingStopSignResponse] =
    useState(false);
  const [requestSuccessful, setRequestSuccessful] = useState();
  const [stopRequestSuccesful, setStopRequestSuccesful] = useState();
  const [shutdownToggle, setShutdownToggle] = useState(false);
  const inputArray = [
    {
      title: 'Sign Text',
      placeholder: 'Enter Text',
      value: text,
      type: 'text',
      onChange: (e) => setText(e.target.value),
      maxLength: '50',
    },
    {
      title: 'Background Color',
      value: backgroundColor,
      type: 'color',
      onChange: (e) => setBackgroundColor(e.target.value),
    },
    {
      title: 'Text Color',
      value: textColor,
      type: 'color',
      onChange: (e) => setTextColor(e.target.value),
    },
    {
      title: 'Border Color',
      value: borderColor,
      type: 'color',
      onChange: (e) => setBorderColor(e.target.value),
    },
    {
      title: 'Brightness',
      value: brightness,
      className: 'sliders',
      min: '25',
      max: '75',
      step: '1',
      type: 'range',
      onChange: (e) => setBrightness(e.target.value),
    },
    {
      title: 'Scroll Speed',
      value: scrollSpeed,
      className: 'sliders',
      min: '0',
      max: '50',
      step: '1',
      type: 'range',
      onChange: (e) => setScrollSpeed(e.target.value),
    },
  ];
  const headerProps = {
    title: 'LED Sign',
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
    if (
      awaitingSignResponse ||
      (requestSuccessful === undefined && stopRequestSuccesful === undefined)
    ) {
      return <></>;
    } else if (requestSuccessful) {
      return <p className="sign-available">Sign successfully updated!</p>;
    } else if (stopRequestSuccesful) {
      return <p className="sign-available">Sign successfully stopped!</p>;
    } else {
      return (
        <p className="sign-unavailable">The request failed. Try again later.</p>
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
  }, []);

  function renderSignHealth() {
    if (loading) {
      return <Spinner />;
    } else if (signHealthy) {
      return <span className="sign-available">ON</span>;
    } else {
      return <span className="sign-unavailable">OFF</span>;
    }
  }

  return (
    <div>
      <Header {...headerProps} />
      <div className="sign-wrapper">
        <label>Preview</label>
        <div>
          <div
            className="mock-signBorderTop"
            style={{ backgroundColor: borderColor }}
          ></div>
          <div
            className="mock-signBackground"
            style={{ backgroundColor: backgroundColor }}
          >
            <marquee
              behavior="scroll"
              direction="left"
            >
              <h1 className="mock-signText" style={{ color: textColor }} placeholder="Sign Text">
                {text}
              </h1>
            </marquee>
          </div>
          <div
            className="mock-signBorderBot"
            style={{ backgroundColor: borderColor }}
          ></div>
        </div>
        {inputArray.map((input, index) => {
          return (
            <div key={index} className="full-width">
              <label>{input.title}</label>
              <br />
              <Input disabled={loading || !signHealthy} {...input} />
            </div>
          );
        })}
        <div className="turn-off-sign-wrapper">
          <Button
            id="led-sign-send"
            color="success"
            onClick={handleSend}
            disabled={loading || !signHealthy || awaitingSignResponse}
          >
            {awaitingSignResponse ? <Spinner /> : 'Send'}
          </Button>
          <Button
            id="led-sign-stop"
            color="danger"
            onClick={() => setShutdownToggle(true)}
          >
            {awaitingStopSignResponse ? <Spinner /> : 'Stop'}
          </Button>
          <label>
            Status&nbsp;
            {renderSignHealth()}
          </label>
        </div>

        {renderRequestStatus()}
      </div>
      <ConfirmationModal
        headerText={'Turn Off LED'}
        bodyText={'Are you sure you want to turn off the LED?'}
        confirmText={'Turn Off'}
        cancelText={'Cancel'}
        toggle={() => setShutdownToggle(!shutdownToggle)}
        handleConfirmation={() => {
          setRequestSuccessful();
          setShutdownToggle(!shutdownToggle);
          handleStop();
        }}
        open={shutdownToggle}
      />
    </div>
  );
}

export default LedSign;
