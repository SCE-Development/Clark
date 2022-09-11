import React, { useState, useEffect } from 'react';
import { healthCheck, updateSignText } from '../../APIFunctions/LedSign';
import { Spinner, Input, Button, Container } from 'reactstrap';
import './led-sign.css';
import Header from '../../Components/Header/Header';
import ConfirmationModal
  from '../../Components/DecisionModal/ConfirmationModal.js';

function LedSign(props) {
  const [signHealthy, setSignHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('Example Text');
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

  async function handleStop(){
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
    } else if (stopRequestSuccesful){
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

  function renderSignHealth() {
    if (loading) {
      return <Spinner />;
    } else if (signHealthy) {
      return <span className='sign-available'> Sign is up.</span>;
    } else {
      return <span className='sign-unavailable'> Sign is down!</span>;
    }
  }

  return (
    <div>
      <Header {...headerProps} />
      <div className="sign-wrapper">
        <Container>
          <h2 className="sign-status">
            Sign Status:
            {renderSignHealth()}
          </h2>
        </Container>
        <Container className='mock-sign'>
          <h1>LED Sign Preview</h1>
          <div className="mock-signBorder"
            style={{backgroundColor: borderColor}}>
          </div>
          <div className="mock-signBackground"
            style={{backgroundColor: backgroundColor}}>
            <h1 id="mock-signText"
              style={{color: textColor}} placeholder="Sign Text">
              {text}</h1>
          </div>
          <div className="mock-signBorder"
            style={{backgroundColor: borderColor}}>
          </div>
        </Container>
        {inputArray.map((input, index) => {
          return (
            <div key={index} className="full-width">
              <label>{input.title}</label>
              <Input disabled={loading || !signHealthy} {...input} />
            </div>
          );
        })}
        <div className="turn-off-sign-wrapper">
          <Button
            id="led-sign-send"
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
