import React, { Component } from 'react'
import Layout from '../../Components/Layout/Layout'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class extends Component {
  constructor () {
    super()
    this.state = {
      email: '',
      password: '',
      message: ''
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
        this.setState({ message: '' })
        this.props.history.push('/dashboard')
      })
      .catch(error => {
        this.setState({
          message: error.response.data.message
        })
      })
  }

  render () {
    const { email, password, message } = this.state

    return (
      <Layout>
        <form onSubmit={this.handleSubmit}>
          <h1>Welcome</h1>

          {message !== '' && <span>{message}</span>}

          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={this.handleChange}
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={this.handleChange}
            required
          />

          <button type='submit'>Login</button>

          <p>
            <Link to='/register'>Create an account</Link>
          </p>
        </form>
      </Layout>
    )
  }
}
