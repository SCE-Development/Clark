import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Layout from '../../Components/Layout/Layout'
import './Login.css'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: '',
      AnimationCSS1: {},
      AnimationCSS2: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    // Logout if token is present
    if (token) {
      window.localStorage.removeItem('jwtToken')
      window.location.reload()
    }
  }

  handleChange (e) {
    const state = { ...this.state }
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  handleSubmit (e) {
    e.preventDefault()

    const { email, password } = this.state

    axios
      .post('/api/user/login', { email, password })
      .then(result => {
        window.localStorage.setItem('jwtToken', result.data.token)
        this.updateLastLoginDate(email, result.data.token)
        this.setState({ message: '' })
      })
      .catch(error => {
        this.setState({
          message: error.response.data.message
        })
      })
  }

  updateLastLoginDate (email, token) {
    axios
      .post('/api/user/edit', {
        queryEmail: email,
        lastLogin: Date.now(),
        // This token must be passed in for authentication
        token: token
      })
      .then(() => {
        this.props.history.push('/dashboard')
      })
      .catch(err => {
        console.log(err)
      })
  }

  updateCSS (opt) {
    opt === 1
      ? this.setState({
        AnimationCSS1: {
          top: '-5px',
          borderBottom: '2px solid GREEN'
        }
      })
      : this.setState({ AnimationCSS1: {} })

    opt === 2
      ? this.setState({
        AnimationCSS2: {
          top: '-5px',
          borderBottom: '2px solid GREEN'
        }
      })
      : this.setState({ AnimationCSS2: {} })
  }

  inputBox (field) {
    return (
      <div
        style={field.style}
        onFocus={() => {
          this.updateCSS(field.css)
        }}
        onBlur={() => {
          this.updateCSS()
        }}
        className='txtb'
      >
        <span />
        <input
          type={field.type}
          name={field.type}
          placeholder={field.placeholder}
          value={field.value}
          onChange={this.handleChange}
          required
        />
      </div>
    )
  }

  render () {
    const {
      message,
      email,
      password,
      AnimationCSS1,
      AnimationCSS2
    } = this.state
    const fields = [
      {
        style: AnimationCSS1,
        css: 1,
        value: email,
        type: 'email',
        placeholder: 'Email'
      },
      {
        style: AnimationCSS2,
        css: 2,
        value: password,
        type: 'password',
        placeholder: 'Password'
      }
    ]

    return (
      <Layout>
        <form onSubmit={this.handleSubmit}>
          <div id='body'>
            <img id='img' src='images/SCE-glow.png' alt='SCE Logo' />

            {message !== '' && <span>{message}</span>}

            {fields.map(field => {
              return this.inputBox(field)
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
}
