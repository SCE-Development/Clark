import React, { useState, useEffect, useRef } from 'react';
import { membershipState } from '../../Enums';
import { useSCE } from '../context/SceContext';
import { getUserById } from '../../APIFunctions/User';
import { useBackgroundColor } from '../context/BackgroundColorContext';
import { getIconTextColor } from '../../APIFunctions/Profile';

export default function UserNavbar(props) {
  const { user, authenticated } = useSCE();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { backgroundColorVersion } = useBackgroundColor() || {};
  const [backgroundColor, setBackgroundColor] = useState('#2a323c');
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    let timeoutId;
    async function getBackgroundColor() {
      const response = await getUserById(user._id, user.token);
      if(response.responseData && response.responseData.backgroundColor) {
        setBackgroundColor(response.responseData.backgroundColor);
        if(transition == false) {
          timeoutId = setTimeout(() => {
            setTransition(true);
          }, 600);
        }
      } else {
        setTransition(true);
      }
    }
    if(authenticated && user && user.token && user._id) {
      getBackgroundColor();
    }
    return () => {
      if(timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [authenticated, user, backgroundColorVersion]);

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

  // useEffect hook to close dropdown if user clicks elsewhere on screen
  // this is so clicking your profile shows the dropdown on mobile safari
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
            <div className='relative inline-block dropdown-menu-wrapper' ref={dropdownRef}>
              <summary
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={`w-12 rounded-full bg-neutral text-neutral-content ${transition ? ' transition-colors ease-in duration-500' : ''}`} style={{backgroundColor: backgroundColor}}>
                  <span className={`${transition ? ' transition-colors ease-in duration-500' : ''}`} style={{color: getIconTextColor(backgroundColor)}}>{initials}</span>
                </div>
              </summary>
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 p-2 shadow menu bg-base-100 w-52 z-[1] rounded-xl'>
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>{user.firstName} {user.lastName}</div>
                    <div className="font-medium truncate">{user.email}</div>
                  </div>
                  <ul className='mt-2 right-0 p-2 menu rounded-b-xl z-[1] bg-base-100'>
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
              )}
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
