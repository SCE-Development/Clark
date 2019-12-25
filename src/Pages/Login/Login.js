import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Layout from '../../Components/Layout/Layout'
import LoginInput from './LoginInput'
import './Login.css'

export default function Login (props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  function checkToken () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    // Logout if token is present
    if (token) {
      window.localStorage.removeItem('jwtToken')
      window.location.reload()
    }
  }

  useEffect(() => {
    checkToken()
    // eslint-disable-next-line
  }, [])

  function handleSubmit (e) {
    e.preventDefault()
    axios
      .post('/api/user/login', { email, password })
      .then(result => {
        this.props.setAuthenticated(true)
        window.localStorage.setItem('jwtToken', result.data.token)
        updateLastLoginDate(result.data.token)
      })
      .catch(error => {
        setErrorMsg(error.response.data.message)
      })
  }

  function updateLastLoginDate (token) {
    axios
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
    <Layout>
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
    </Layout>
  )
}
