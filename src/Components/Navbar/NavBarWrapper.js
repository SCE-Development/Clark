import React from 'react';
import './navbar.css';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';

function NavBarWrapper({
  enableAdminNavbar = false,
  component: Component,
  ...appProps
}) {
  function handleLogout() {
    appProps.setAuthenticated(false);
    window.localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  return (
    <>
      {enableAdminNavbar ? (
        <AdminNavbar {...appProps} handleLogout={handleLogout} />
      ) : (
        <UserNavbar {...appProps} handleLogout={handleLogout} />
      )}
      <Component {...appProps} />
    </>
  );
}

export default NavBarWrapper;
