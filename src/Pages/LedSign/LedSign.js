import React, { useState, useEffect } from 'react'
import { healthCheck, updateSignText } from '../../APIFunctions/LedSign'
import { Spinner, Input, Button, Container } from 'reactstrap'
import './led-sign.css'

function LedSign (props) {
  const [signHealthy, setSignHealthy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [brightness, setBrightness] = useState(50)
  const [scrollSpeed, setScrollSpeed] = useState(50)
  const [backgroundColor, setBackgroundColor] = useState('#0000ff')
  const [textColor, setTextColor] = useState('#00ff00')
  const [borderColor, setBorderColor] = useState('#ff0000')
  const [awaitingSignResponse, setAwaitingSignResponse] = useState(false)
  const [requestSuccessful, setRequestSuccessful] = useState()

  const inputArray = [
    {
      title: 'Sign Text:',
      placeholder: 'Enter Text',
      defaultValue: '',
      type: 'text',
      onChange: e => setText(e.target.value)
    },
    {
      title: 'Background Color',
      defaultValue: '#0000ff',
      type: 'color',
      onChange: e => setBackgroundColor(e.target.value)
    },
    {
      title: 'Text Color',
      defaultValue: '#00ff00',
      type: 'color',
      onChange: e => setTextColor(e.target.value)
    },
    {
      title: 'Border Color',
      defaultValue: '#ff0000',
      type: 'color',
      onChange: e => setBorderColor(e.target.value)
    },
    {
      title: 'Brightness:',
      defaultValue: '50',
      min: '0',
      max: '100',
      step: '1',
      type: 'range',
      onChange: e => setBrightness(e.target.value)
    },
    {
      title: 'Scroll Speed:',
      defaultValue: '50',
      min: '0',
      max: '100',
      step: '1',
      type: 'range',
      onChange: e => setScrollSpeed(e.target.value)
    }
  ]

  async function handleSend () {
    setAwaitingSignResponse(true)
    const signResponse = await updateSignText({
      text,
      brightness,
      scrollSpeed,
      backgroundColor,
      textColor,
      borderColor
    })
    setRequestSuccessful(!signResponse.error)
    setAwaitingSignResponse(false)
  }

  function renderRequestStatus () {
    if (awaitingSignResponse || requestSuccessful === undefined) {
      return <></>
    } else if (requestSuccessful) {
      return <p className='sign-available'>Sign successfully updated!</p>
    } else {
      return (
        <p className='sign-unavailable'>The request failed. Try again later.</p>
      )
    }
  }

  useEffect(() => {
    async function checkSignHealth () {
      setLoading(true)
      const status = await healthCheck(props.user.name)
      if (status && !status.error) {
        setSignHealthy(true)
      } else {
        setSignHealthy(false)
      }
      setLoading(false)
    }
    checkSignHealth(props.user.name)
    // eslint-disable-next-line
  }, [])

  function renderSignHealth () {
    if (loading) {
      return <Spinner />
    } else if (signHealthy) {
      return <span className='sign-available'> Sign is up.</span>
    } else {
      return <span className='sign-unavailable'> Sign is down!</span>
    }
  }

  return (
    <div className='sign-wrapper'>
      <Container>
        <h1 className='sign-status'>
          Sign Status:
          {renderSignHealth()}
        </h1>
      </Container>
      {inputArray.map((input, index) => {
        return (
          <div key={index} className='full-width'>
            <label>{input.title}</label>
            <Input disabled={loading || !signHealthy} {...input} />
          </div>
        )
      })}
      <Button
        id='led-sign-send'
        onClick={handleSend}
        disabled={loading || !signHealthy || awaitingSignResponse}
      >
        {awaitingSignResponse ? <Spinner /> : 'Send'}
      </Button>
      {renderRequestStatus()}
    </div>
  )
}

export default LedSign
