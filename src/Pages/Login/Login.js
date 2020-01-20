import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginInput from './LoginInput'
import { loginUser } from '../../APIFunctions/User'
import './login.css'

export default function Login (props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()
    const loginStatus = await loginUser(email, password)
    if (!loginStatus.error) {
      props.setAuthenticated(true)
      window.localStorage.setItem('jwtToken', loginStatus.token)
      window.location.reload()
    } else {
      setErrorMsg(
        loginStatus.responseData && loginStatus.responseData.data.message
      )
    }
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
