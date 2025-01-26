import React from 'react';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import SpeakerPlayBar from '../../Pages/Speaker/SpeakerPlayBar';

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

  // basically if we are on an admin page, make the navbar
  // appear on the side with instead of on top. Wrapping
  // the component with the below div allows the navbar
  // to appear on the side in a clean way. See below for more info
  // https://flowbite.com/docs/components/sidebar/#default-sidebar
  function maybeWrapComponentForAdminNavbar() {
    if (enableAdminNavbar) {
      console.log("enabled!!!");
      return (
        <div className="p-4">
          <Component {...appProps} />
          <SpeakerPlayBar
            isPlaying={true}
            handleForward={appProps.handleForward}
            handleRewind={appProps.handleRewind}
            togglePlayback={appProps.togglePlayback}
          />
        </div>
      );
    }
    return <Component {...appProps} />;
  }

  if (enableAdminNavbar) {
    console.log("OTHER THING HAPPENED");
    return (
      <div>
        <AdminNavbar {...appProps} handleLogout={handleLogout} >
          <Component {...appProps} />
        </AdminNavbar>
        <SpeakerPlayBar
            isPlaying={true}
            handleForward={appProps.handleForward}
            handleRewind={appProps.handleRewind}
            togglePlayback={appProps.togglePlayback}
          />
      </div>
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
