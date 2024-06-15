import React from 'react';

export default function UserNavBar(props) {
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
    props.setAuthenticated(false);
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
      route: `/user/edit/${props.user._id}`,
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
      title: 'Speakers',
      route: '/speakers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 7.5 16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0 0 12 6.75Zm-1.683 6.443-.005.005-.006-.005.006-.005.005.005Zm-.005 2.127-.005-.006.005-.005.005.005-.005.005Zm-2.116-.006-.005.006-.006-.006.005-.005.006.005Zm-.005-2.116-.006-.005.006-.005.005.005-.005.005ZM9.255 10.5v.008h-.008V10.5h.008Zm3.249 1.88-.007.004-.003-.007.006-.003.004.006Zm-1.38 5.126-.003-.006.006-.004.004.007-.006.003Zm.007-6.501-.003.006-.007-.003.004-.007.006.004Zm1.37 5.129-.007-.004.004-.006.006.003-.004.007Zm.504-1.877h-.008v-.007h.008v.007ZM9.255 18v.008h-.008V18h.008Zm-3.246-1.87-.007.004L6 16.127l.006-.003.004.006Zm1.366-5.119-.004-.006.006-.004.004.007-.006.003ZM7.38 17.5l-.003.006-.007-.003.004-.007.006.004Zm-1.376-5.116L6 12.38l.003-.007.007.004-.004.007Zm-.5 1.873h-.008v-.007h.008v.007ZM17.25 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 4.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
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
      title: 'Dessert Admin',
      route: '/dessert-admin',
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
          Signed in as {props.user.email}
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
