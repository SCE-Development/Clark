import React from 'react'

import UserNavbar from './UserNavbar'
import AdminNavbar from './AdminNavbar'

function NavBarWrapper ({
  enableAdminNavbar = false,
  component: Component,
  ...appProps
}) {
  function handleLogout () {
    appProps.setAuthenticated(false)
    window.localStorage.removeItem('jwtToken')
    window.location.reload()
  }

  return (
    <div>
      {enableAdminNavbar ? (
        <AdminNavbar {...appProps} handleLogout={handleLogout} />
      ) : (
        <UserNavbar {...appProps} handleLogout={handleLogout} />
      )}
      <Component />
    </div>
  )
}

export default NavBarWrapper
