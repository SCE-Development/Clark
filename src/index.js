import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import './index.css'
import axios from 'axios'

import Routing from './Routing'

function App (props) {
  const [authenticated, setAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [user, setUser] = useState()

  async function getAuthStatus () {
    setIsAuthenticating(true)
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    // Immediately direct to /login if no jwtToken token present
    if (!token) {
      setAuthenticated(false)
      setIsAuthenticating(false)
      return
    }

    // Verify if token is valid
    // As user persmissions are created, the verify auth should be more extensive
    // and return views as the permissions defines
    await axios
      .post('/api/user/verify', { token })
      .then(res => {
        setUser(res.data)
        setAuthenticated(true)
        // If the user doesn't have sufficient privilages, send them to their profile page
        if (res.data.accessLevel < 1 && props.history) {
          props.history.push('/profile')
        }
      })
      .catch(err => {
        if (props.history) props.history.push('/login')
        setAuthenticated(false)
      })
    setIsAuthenticating(false)
  }

  useEffect(() => {
    getAuthStatus()
    // eslint-disable-next-line
  }, [])

  return (
    !isAuthenticating && (
      <div className='App'>
        {/* // navbar heres */}
        <Routing appProps={{ authenticated, setAuthenticated, user }} />
      </div>
    )
  )
}

export default withRouter(App)

ReactDOM.render(<App />, document.getElementById('root'))
