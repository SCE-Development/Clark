import React from 'react';
import { useSCE } from '../context/SceContext';

export default function UserNavBar(props) {
  const { user, setAuthenticated } = useSCE();
  const getLinkClassName = (path) => {
    const weAreAtGivenPath = path === window.location.pathname;
    let className = 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white';
    if (weAreAtGivenPath) {
      className += ' bg-gray-100 dark:bg-gray-700 group';
    } else {
      className += ' hover:bg-gray-100 dark:hover:bg-gray-700 group';
    }
    return className;
  };

  function handleLogout() {
    setAuthenticated(false);
    window.localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  const topNavbarLinks = [
    {
      title: 'Home',
      route: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      title: 'Edit Profile',
      route: `/user/edit/${user._id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      ),
    },
  ];

  const adminLinks = [
    {
      title: 'User Manager',
      route: '/user-manager',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

      ),
    },
    {
      title: 'URL Shortener',
      route: '/short',
      fill: 'none',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>

      ),
    },
    {
      title: 'LED Sign',
      route: '/led-sign',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
        </svg>

      ),
    },
    {
      title: 'Advertisement Admin',
      route: '/advertisement-admin',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path fill="currentColor" d="M19 7c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v2h-4v2h4c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2V9h4V7zM9 7v10h4c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm2 2h2v6h-2zM3 7c-1.1 0-2 .9-2 2v8h2v-4h2v4h2V9c0-1.1-.9-2-2-2zm0 2h2v2H3z"/>
        </svg>
      ),
    },
    {
      title: 'Card Reader',
      route: '/card-reader',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14 13h5v-2h-5zm0-3h5V8h-5zm-9 6h8v-.55q0-1.125-1.1-1.787T9 13t-2.9.663T5 15.45zm4-4q.825 0 1.413-.587T11 10t-.587-1.412T9 8t-1.412.588T7 10t.588 1.413T9 12m-5 8q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20z"/>
        </svg>
      )
    },
    {
      title: 'Audit Logs',
      route: '/audit-logs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5.616 20q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h4.7q-.136-.766.367-1.383Q11.184 2 12.01 2t1.328.617T13.685 4h4.7q.666 0 1.14.475T20 5.615v12.77q0 .666-.475 1.14t-1.14.475zM8 16.27h5q.213 0 .356-.145t.144-.356t-.144-.356t-.356-.144H8q-.213 0-.356.144q-.144.144-.144.357t.144.356t.356.143M8 12.5h8q.213 0 .356-.144t.144-.357t-.144-.356T16 11.5H8q-.213 0-.356.144t-.144.357t.144.356T8 12.5m0-3.77h8q.213 0 .356-.143q.144-.144.144-.357t-.144-.356T16 7.731H8q-.213 0-.356.144t-.144.357t.144.356T8 8.73m4-4.289q.325 0 .538-.212t.212-.538t-.213-.537T12 2.942t-.537.213t-.213.537t.213.538t.537.212"/>
        </svg>
      )
    },
    {
      title: 'LeetCode Leaderboard',
      route: '/leetcode',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99" />
        </svg>
      ),
    },
  ];

  const renderRoutesForNavbar = (navbarLinks) => {
    return (
      <>
        {navbarLinks.map((link) => {
          return (
            <li key={link.route}>
              <a href={link.route} className={getLinkClassName(link.route)}>
                {link.icon}
                <span className="ms-3">{link.title}</span>
              </a>
            </li>
          );
        })}
      </>
    );
  };

  return (
    <div className="drawer lg:drawer-open" tabIndex={0}>
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16">
              </path>
            </svg>
          </label>
        </div>
        {props.children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
          Signed in as {user.email}
          <ul className="menu min-h-full bg-base-200 text-base-content">
            {renderRoutesForNavbar(topNavbarLinks)}
          </ul>
          <div className="divider divider-neutral"></div>
          <ul className="menu min-h-full bg-base-200 text-base-content">
            {renderRoutesForNavbar(adminLinks)}
          </ul>
          <div className="divider divider-neutral"></div>

          <div href="/" className={getLinkClassName('/')} onClick={() => handleLogout()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
            </svg>
            <span className="ms-3">
              Log Out
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
