import React from 'react';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import { useUser } from '../context/UserContext';

function NavBarWrapper({
  enableAdminNavbar = false,
  component: Component,
  ...appProps
}) {
  const { user, setUser } = useUser();

  // Test that UserContext is working
  console.log('NavBarWrapper - UserContext data:', { user, setUser: typeof setUser });

  function handleLogout() {
    appProps.setAuthenticated(false);
    setUser(null);
    window.localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  // basically if we are on an admin page, make the navbar
  // appear on the side with instead of on top. Wrapping
  // the component with the below div allows the navbar
  // to appear on the side in a clean way. See below for more info
  // https://flowbite.com/docs/components/sidebar/#default-sidebar
  function maybeWrapComponentForAdminNavbar() {
    if (enableAdminNavbar) {
      return (
        <div className="p-4">
          <Component {...appProps} />
        </div>
      );
    }
    return <Component {...appProps} />;
  }

  if (enableAdminNavbar) {
    return (
      <AdminNavbar {...appProps} handleLogout={handleLogout} >
        <Component {...appProps} />
      </AdminNavbar>
    );
  }

  return (
    <>
      {enableAdminNavbar ? (
        <AdminNavbar {...appProps} handleLogout={handleLogout} />
      ) : (
        <UserNavbar {...appProps} handleLogout={handleLogout} />
      )}
      {maybeWrapComponentForAdminNavbar()}
    </>
  );
}

export default NavBarWrapper;
