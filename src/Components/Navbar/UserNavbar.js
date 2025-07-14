import React, { useEffect, useState } from 'react';
import { membershipState } from '../../Enums';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../../APIFunctions/User';
import { useBackgroundColor } from '../context/BackgroundContext';

export default function UserNavbar(props) {
  const { user } = useUser();
  const { backgroundColorVersion } = useBackgroundColor();
  const { authenticated } = useAuth();
  const [backgroundColor, setBackgroundColor] = useState('');

  async function getBackgroundColor() {
    const response = await getUserById(user._id, user.token);
    if(response.responseData && response.responseData.backgroundColor) {
      setBackgroundColor(response.responseData.backgroundColor);
    }
  }

  useEffect(() => {
    const run = async () => {
      await getBackgroundColor();
    } ;
    if(authenticated && user && user.token && user._id) {
      run();
    }
  }, [authenticated, user, backgroundColorVersion]);

  // using w3c guidelines
  function getIconTextColor(color) {
    if(typeof color !== 'string') {
      throw new TypeError('color must be a string');
    }
    if(color == '' || color == '#2a323c') {
      return '#FFFFFF';
    }
    // get rgb values 0-255
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    // linearize the colors
    const colors = [r / 255.0, g / 255.0, b / 255.0];
    const c = colors.map((color) => {
      if(color <= 0.04045) {
        return color / 12.92;
      }
      return Math.pow(((color + 0.055) / 1.055), 2.4);
    });
    // luminance value
    const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    // threshold of 0.179
    if(L > 0.179) {
      return '#000000';
    }
    return '#FFFFFF';
  }

  let initials = '';
  if (user && user.firstName && user.lastName) {
    initials = user.firstName[0] + user.lastName[0];
  }
  const unauthedRoutes = [
    { title: 'About', route: '/about' },
    { title: 'Projects', route: '/projects' },
    { title: 'Spartan Compass', route: '/spartan-compass' }
  ];

  const authedRoutes = [
    { title: 'Printing', route: '/2DPrinting' },
    { title: 'Chat', route: '/messaging' },
  ];

  const authentication = [
    { title: 'Sign Up', route: '/register' },
    { title: 'Sign In', route: '/login' },
  ];

  const getRoutesForNavbar = () => {
    let routesList = unauthedRoutes;
    if (user && user.accessLevel >= membershipState.MEMBER) {
      routesList = authedRoutes;
    }
    return (
      <>
        {routesList.map((link) => {
          return (
            <li key={link.route}><a href={link.route}>{link.title}</a></li>
          );
        })}
        {user && user.accessLevel >= membershipState.OFFICER && (
          <li>
            <a href='/user-manager'>
              Admin
            </a>
          </li>
        )}
      </>
    );
  };

  const getSignedOutDropdownRoutes = () => {
    const routesList = [...unauthedRoutes, ...authentication];
    return (
      <>
        {routesList.map((link) => {
          return (
            <li key={link.route}><a href={link.route}>{link.title}</a></li>
          );
        })}
      </>
    );
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a href='/'>
          <img id='logo-image' src='/favicon.ico'
            alt={'sce-logo'} style={{ width: '70px' }} />
        </a>
      </div>

      <div className="hidden navbar-center sm:flex">
        <ul className="menu menu-horizontal">
          {getRoutesForNavbar()}
        </ul>
      </div>

      <div className="navbar-end">
        {authenticated && user ? (
          <>
            <div className="dropdown dropdown-end sm:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">Services</div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                {getRoutesForNavbar()}
              </ul>
            </div>

            <div className="dropdown dropdown-bottom dropdown-end">
              <summary tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                <div className="w-12 rounded-full bg-neutral text-neutral-content" style={{backgroundColor: backgroundColor}}>
                  <span style={{color: getIconTextColor(backgroundColor)}}>{initials}</span>
                </div>
              </summary>
              <div className='p-2 shadow menu dropdown-content z-[1] bg-base-100 w-52'>
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div>{user.firstName} {user.lastName}</div>
                  <div className="font-medium truncate">{user.email}</div>
                </div>
                <ul className='p-2 shadow menu rounded-b-xl dropdown-content z-[1] bg-base-100  w-52'>
                  <li>
                    <a href='/profile'>
                      Profile
                    </a>
                  </li>
                  <li>
                    <button onClick={() => props.handleLogout()}>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="dropdown dropdown-end sm:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                <button className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </button>
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                {getSignedOutDropdownRoutes()}
              </ul>
            </div>

            <div className="hidden sm:flex">
              <ul className="px-1 menu menu-horizontal">
                <li>
                  <a href='/login'>
                    Sign In
                  </a>
                </li>
                <li>
                  <a href='/register'>
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
