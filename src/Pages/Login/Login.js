import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import LoginInput from './LoginInput'
import './Login.css'

export default function Login (props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()
    await axios
      .post('/api/user/login', { email, password })
      .then(async result => {
        props.setAuthenticated(true)
        window.localStorage.setItem('jwtToken', result.data.token)
        await updateLastLoginDate(result.data.token)
        window.location.reload()
      })
      .catch(error => {
        setErrorMsg(error.response && error.response.data.message)
      })
  }

  async function updateLastLoginDate (token) {
    await axios
      .post('/api/user/edit', {
        queryEmail: email,
        lastLogin: Date.now(),
        // This token must be passed in for authentication
        token: token
      })
      .then(() => {
        props.history.push('/dashboard')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const fields = [
    {
      type: 'email',
      placeholder: 'Email',
      handleChange: e => setEmail(e.target.value)
    },
    {
      type: 'password',
      placeholder: 'Password',
      handleChange: e => setPassword(e.target.value)
    }
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div id='body'>
        <img id='img' alt='sce logo' src='images/SCE-glow.png' />
        {errorMsg && <span>{errorMsg}</span>}
        {fields.map((field, index) => {
          return <LoginInput key={index} field={field} />
        })}
        <button type='submit' id='loginBtn'>
          Login
        </button>
        <p id='SignUp'>
          <Link to='/register'>Create an account</Link>
        </p>
      </div>
    </form>
  )
}
