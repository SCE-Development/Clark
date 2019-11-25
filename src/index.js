import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import './index.css'
import axios from 'axios'

import Routing from './Routing'
import 'bootstrap/dist/css/bootstrap.min.css'

function App (props) {
  const [authenticated, setAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [user, setUser] = useState()

  async function getAuthStatus () {
    setIsAuthenticating(true)
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    if (!token) {
      setAuthenticated(false)
      setIsAuthenticating(false)
      return
    }

    await axios
      .post('/api/user/verify', { token })
      .then(res => {
        setUser({ ...res.data, token })
        setAuthenticated(true)
      })
      .catch(err => {
        if (props.history) props.history.push('/login')
        setAuthenticated(false)
        console.log(err)
      })
    setIsAuthenticating(false)
  }

  useEffect(() => {
    getAuthStatus()
    // eslint-disable-next-line
  }, [])

  return (
    !isAuthenticating && (
      <div>
        <Routing appProps={{ authenticated, setAuthenticated, user }} />
      </div>
    )
  )
}

export default withRouter(App)

ReactDOM.render(<App />, document.getElementById('root'))
