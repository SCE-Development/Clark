import React, { useState } from 'react';
import {
  ButtonDropdown,
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import DarkMode from './DarkMode';
import { membershipState } from '../../Enums';

export default function UserNavBar(props) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const unauthedRoutes = [{ title: 'About', route: '/about' },
    { title: 'Projects', route: '/projects' },
    { title: 'Events', route: '/events' }];

  const authedRoutes = [{ title: 'Printing', route: '/2DPrinting' }];

  const authentication = [{ title: 'Sign Up', route: '/register' },
    { title: 'Sign In', route: '/login' }];

  const toggler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <nav className='bg-black navbar'>
      <div className='navbar-start '>
        <img id='logo-image' src='favicon.ico' alt={'sce-logo'}
          className='navbar w-[70px] ' />
      </div>
      {/* desktop nav bar middle */}
      <div className='space-x-4 navbar-center sm:block'>
        <a href='/about' className='text-white btn btn-ghost'>
          <span className='!link !link-hover'>About</span>
        </a>
        <a href='/projects' className='text-white btn btn-ghost '>Projects</a>
        <a href='/events' className='text-white btn btn-ghost '>Events</a>
      </div>
      {/* desktop nav bar middle */}
      <div className='px-4 navbar-end'>
        <a href='/login' className='btn btn-ghost btn-primary btn-wide'>Login</a>
      </div>
      {/* mobile nav bar end */}
      {/* <div className='block px-4 sm:hidden navbar-end'>
        <a href='/login' className='btn btn-ghost btn-primary btn-wide'>Mobile</a>
      </div> */}
    </nav>
    // <div className={'user-nav'}>
    //   <Navbar expand='xl' className = "navbar">
    //     <NavbarBrand href='/'>
    //       <div>
    //         <img id='logo-image' src='favicon.ico'
    //           alt={'sce-logo'} style={{ width: '70px' }} />
    //       </div>
    //     </NavbarBrand>
    //     <NavbarToggler tag='h1'>
    //       <ButtonDropdown isOpen={menuIsOpen} toggle={toggler}>
    //         <DropdownToggle className='hamburger-button'>
    //           <span className='border'></span>
    //           <span className='border'></span>
    //           <span className='border'></span>
    //         </DropdownToggle>
    //         <DropdownMenu right>
    //           {props.user && props.user.accessLevel >=
    //             membershipState.MEMBER && (
    //             <DropdownItem  className='dropdown-submenu drp-item'>
    //               <DropdownItem className='drp-item' id='btndrp-text'>
    //                   Printing
    //               </DropdownItem>
    //               <DropdownMenu className='drp-menu'>
    //                 {authedRoutes.map((link, index) => {
    //                   return (
    //                     <DropdownItem
    //                       key={index}
    //                       className='drp-item'
    //                       href={link.route}
    //                     >
    //                       {link.title}
    //                     </DropdownItem>
    //                   );
    //                 })}
    //               </DropdownMenu>
    //             </DropdownItem>
    //           )}
    //           {/* Display unauthedRoutes in hamburger button */}
    //           {unauthedRoutes.map((link, index) => {
    //             return (
    //               <DropdownItem className='drp-item' key={index}>
    //                 <NavItem>
    //                   <NavLink id='btndrp-text' href={link.route}>
    //                     {link.title}
    //                   </NavLink>
    //                 </NavItem>
    //               </DropdownItem>
    //             );
    //           })}
    //           {/* account icon */}
    //           {props.authenticated && props.user ? (
    //             <div className='dropdown-submenu drp-item'>
    //               <DropdownItem className='drp-item' id='btndrp-text'>

    //                 {props.user.firstName}
    //               </DropdownItem>
    //               <DropdownMenu right className='drp-menu'>
    //                 <DropdownItem
    //                   className='authenticated-navlink drp-item'
    //                   href='/profile'
    //                 >
    //                   Profile
    //                 </DropdownItem>
    //                 {/* Display admin in hamburger if user is admin */}
    //                 {props.user.accessLevel >= membershipState.OFFICER && (
    //                   <DropdownItem className='drp-item' href='/dashboard'>
    //                     Admin
    //                   </DropdownItem>
    //                 )}
    //                 <DropdownItem className='drp-item'>
    //                   <div onClick={() => props.handleLogout()}>
    //                     <svg className='logout-image' viewBox='0 0 24 24'>
    //                       <path
    //                         d='M17,17.25V14H10V10H17V6.75L22.25,12L17,
    //                         17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,
    //                         2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z'
    //                       />
    //                     </svg>
    //                     Logout
    //                   </div>
    //                 </DropdownItem>
    //               </DropdownMenu>
    //             </div>
    //             // display sign in, sign up in hamburger if not logged in
    //           ) : (
    //             <NavItem className='drp-item'>
    //               {authentication.map((link, index) => {
    //                 return (
    //                   <DropdownItem className='drp-item' key={index}>
    //                     <NavItem>
    //                       <NavLink id='btndrp-text' href={link.route}>
    //                         {link.title}
    //                       </NavLink>
    //                     </NavItem>
    //                   </DropdownItem>
    //                 );
    //               })}
    //             </NavItem>
    //           )}
    //         </DropdownMenu>
    //       </ButtonDropdown>
    //     </NavbarToggler>

    //     <Collapse navbar>
    //       <Nav className='mx-auto d-flex sce-nav' navbar>
    //         <div className='navlink-items'>
    //           {/* Display user's first name in nav*/}
    //           {props.authenticated && props.user ? (
    //             <div className='profile'>
    //               <UncontrolledDropdown nav inNavbar>
    //                 <DropdownToggle className='text-white' nav caret>
    //                   {props.user.firstName}
    //                 </DropdownToggle>
    //                 <DropdownMenu right>
    //                   <DropdownItem className='drp-item'
    //                     href='/profile'>
    //                     Profile
    //                   </DropdownItem>
    //                   {/* Display admin if user is admin */}
    //                   {props.user.accessLevel >= membershipState.OFFICER && (
    //                     <DropdownItem className='drp-item' href='/dashboard'>
    //                       Admin
    //                     </DropdownItem>
    //                   )}
    //                   <DropdownItem className='drp-item'>
    //                     <div onClick={() => props.handleLogout()}>
    //                       <svg className='logout-image' viewBox='0 0 24 24'>
    //                         <path
    //                           d='M17,17.25V14H10V10H17V6.75L22.25,12L17,
    //                         17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,
    //                         2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z'
    //                         />
    //                       </svg>
    //                       Logout
    //                     </div>
    //                   </DropdownItem>
    //                 </DropdownMenu>
    //               </UncontrolledDropdown>
    //             </div>
    //           ) : (
    //             <NavItem className='mx-auto d-flex authentication'>
    //               <NavLink id='signin-btn' href='/login'>
    //                 Sign In
    //               </NavLink>
    //               <NavLink id='signup-btn' href='/register'>
    //                 Sign Up
    //               </NavLink>
    //             </NavItem>
    //           )}

    //           {/* Display titles when and when not logged in */}
    //           {unauthedRoutes.map((link, index) => {
    //             return (
    //               <NavItem key={index}>
    //                 <NavLink id='navlink-text'
    //                   className='routes'
    //                   href={link.route}>
    //                   {link.title}
    //                 </NavLink>
    //               </NavItem>
    //             );
    //           })}
    //           {/* Display printing in nav when logged in */}
    //           {props.user && props.user.accessLevel >= membershipState.MEMBER
    //             && (
    //               <UncontrolledDropdown nav inNavbar>
    //                 <DropdownToggle
    //                   className='authenticated-navlink'
    //                   id='navlink-text'
    //                   nav
    //                   caret
    //                 >
    //                   Services
    //                 </DropdownToggle>
    //                 <DropdownMenu right>
    //                   {authedRoutes.map((link, index) => {
    //                     return (
    //                       <DropdownItem
    //                         key={index}
    //                         className='drp-item'
    //                         href={link.route}
    //                       >
    //                         {link.title}
    //                       </DropdownItem>
    //                     );
    //                   })}
    //                 </DropdownMenu>
    //               </UncontrolledDropdown>
    //             )}
    //         </div>
    //       </Nav>
    //     </Collapse>
    //   </Navbar>
    // </div >
  );
}
