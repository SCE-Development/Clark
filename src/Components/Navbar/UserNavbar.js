import React from 'react';
import { membershipState } from '../../Enums';
import { useUser } from '../context/UserContext';

const dessertAdminRoute = {
  title: 'Animal Admin',
  route: '/animal-admin',
  icon: (
    <svg id='Mouse_Animal_24' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
      <g transform="matrix(0.83 0 0 0.83 12 12)" >
        <path style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeDashoffset: 0,
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          fill: "white",
          fillRule: "nonzero",
          opacity: 1,
          }} transform=" translate(-12, -12.28)" d="M 17.5 2 C 15.625 2 13.748766 2.9525313 13.134766 5.0195312 C 13.039766 5.3645312 12.972656 5.7207031 12.972656 6.0957031 C 12.972656 6.5087031 13.034297 6.9156875 13.154297 7.3046875 L 11.244141 7.8964844 C 11.063141 7.3154844 10.974609 6.7087031 10.974609 6.0957031 C 10.974609 5.7227031 11.012172 5.3589062 11.076172 5.0039062 C 11.049172 5.0029063 11.027 5 11 5 C 7.2858296 5 3.336471 7.4356812 3.0292969 14.160156 C 2.5107459 14.31381 1.993634 14.573843 1.5 14.96875 C 0.69724125 15.610957 0 16.666667 0 18 C 0 19.5 1.1489888 20.85435 2.9335938 21.449219 C 4.7181987 22.044087 7.174104 21.996653 10.316406 20.949219 C 12.778062 20.128667 14.609186 19.931407 15.960938 20.214844 C 17.312689 20.498281 18.271328 21.209726 19.167969 22.554688 L 20.832031 21.445312 C 19.728672 19.790274 18.242092 18.650126 16.371094 18.257812 C 14.500095 17.865499 12.330938 18.168332 9.6835938 19.050781 C 6.8258962 20.003347 4.7818013 19.955913 3.5664062 19.550781 C 2.3510112 19.14565 2 18.5 2 18 C 2 17.333333 2.3027588 16.889043 2.75 16.53125 C 3.1972412 16.173457 3.8333333 16 4 16 L 24 16 L 24 14.763672 L 23.894531 14.552734 C 23.013531 12.790734 21.820969 10.882547 20.792969 9.5605469 C 21.562969 8.7385469 22 7.652 22 6.5 C 22 4.018 19.981 2 17.5 2 z M 16 10 C 16.552 10 17 10.448 17 11 C 17 11.552 16.552 12 16 12 C 15.448 12 15 11.552 15 11 C 15 10.448 15.448 10 16 10 z" stroke-linecap="round" />
      </g>
    </svg>
  ),
};


export default function UserNavbar(props) {
  const { user } = useUser();
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
        {props.authenticated && user ? (
          <>
            <div className="dropdown dropdown-end sm:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">Services</div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                {getRoutesForNavbar()}
              </ul>
            </div>

            <div className="dropdown dropdown-bottom dropdown-end">
              <summary tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                <div className="w-12 rounded-full bg-neutral text-neutral-content">
                  <span>{initials}</span>
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
