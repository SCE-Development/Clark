import React, { useState } from 'react'
import { Input, Button } from 'reactstrap'
import './profile-modifier.css'
import axios from 'axios'

const pic = require('./getPicBySeason')
const bcrypt = require('bcrypt-nodejs')

export default function ProfileCard (props) {
  const [password, setPassword] = useState('New Password')
  const [confirmPass, setConfirmPass] = useState('Confirming New Password')
  const [user, setUser] = useState('')

  async function changePassword () {
    // hash pass
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword =
      password.trim() === '' ? user.password : bcrypt.hashSync(password, salt)

    if (password === confirmPass) {
      axios
        .post('/api/user/edit', {
          ...user,
          password: hashedPassword,
          queryEmail: user.email,
          token: user.token
        })
        .then(result => {
          if (result.status >= 200 && result.status < 300) {
            setPassword('')
            window.alert('Success!!')
          }
        })
        .catch(() => {})
    }
  }

  function buttonStyle () {
    let style = { marginTop: '10px' }
    password === confirmPass
      ? (style = {
        ...style,
        color: 'white'
      })
      : (style = {
        ...style,
        color: 'grey',
        cursor: 'not-allowed'
      })
    return style
  }

  return (
    <div id='enclose'>
      <img id='clip' alt='side' src={pic.getPictureByMonth()} />
      <img id='clip2' alt='side' src={pic.getPictureByMonth()} />
      <div id='profileBox'>
        {props.fields.map((field, ind) => (
          <h3 key={ind} id='innerTextTop'>
            <b>{field.title}:</b> {field.value}
          </h3>
        ))}
        <h3 id='innerTextTop'>
          New Password:{' '}
          <Input
            onChange={e => {
              setUser(props.user)
              setPassword(e.target.value)
            }}
            type='password'
          />
        </h3>
        <h3 id='innerTextTop'>
          Confirm Password:{' '}
          <Input
            onChange={e => {
              setUser(props.user)
              setConfirmPass(e.target.value)
            }}
            type='password'
          />
          <Button
            id='changePasswd'
            color='info'
            style={buttonStyle()}
            onClick={() => {
              changePassword()
            }}
          >
            Change Password
          </Button>
        </h3>
      </div>
    </div>
  )
}
