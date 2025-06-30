import Overview from '../../Pages/Overview/Overview.js';
import Login from '../../Pages/Login/Login.js';
import ForgotPassword from '../../Pages/ForgotPassword/ForgotPassword.js';
import ResetPasswordPage from '../../Pages/ForgotPassword/ResetPassword.js';
import Profile from '../../Pages/Profile/MemberView/Profile.js';
import LedSign from '../../Pages/LedSign/LedSign.js';
import EditUserInfo from '../../Pages/UserManager/EditUserInfo.js';

import Home from '../../Pages/Home/Home.js';
import MembershipApplication from
  '../../Pages/MembershipApplication/MembershipApplication.js';
import VerifyEmailPage from '../../Pages/MembershipApplication/VerifyEmail.js';
import Printing from '../../Pages/2DPrinting/2DPrinting.js';
import AdvertisementAdmin from '../../Pages/Advertisement/AdvertisementAdmin.js';

import AboutPage from '../../Pages/About/About.js';
import ProjectsPage from '../../Pages/Projects/Projects.js';
import URLShortenerPage from '../../Pages/URLShortener/URLShortener.js';

import EmailPreferencesPage from '../../Pages/EmailPreferences/EmailPreferences.js';

import sendUnsubscribeEmail from '../../Pages/Profile/admin/SendUnsubscribeEmail.js';
import Messaging from '../../Pages/Messaging/Messaging.js';

import { membershipState } from '../../Enums.js';

export function getSignedInRoutes(authenticated, user) {
  const userIsAuthenticated = authenticated;
  const userIsMember =
    userIsAuthenticated &&
    user &&
    user.accessLevel === membershipState.MEMBER;
  const userIsOfficerOrAdmin =
    userIsAuthenticated &&
    user &&
    user.accessLevel >= membershipState.OFFICER;

  const notAuthenticatedRoutes = [
    {
      Component: Login,
      path: '/login*',
      allowedIf: !userIsAuthenticated,
      redirect: '/',
      queryParams: {
        redirect: 'redirect',
      },
      pageName: "Login",
    },
    {
      Component: ForgotPassword,
      path: '/forgot',
      allowedIf: !userIsAuthenticated,
      redirect: '/',
      pageName: "Forgot Password",
    },
    {
      Component: MembershipApplication,
      path: '/register',
      allowedIf: !userIsAuthenticated,
      redirect: '/',
      pageName: "Membership Application",
    },
  ]
  
  const authenticatedRoutes = [
    {
      Component: Profile,
      path: '/profile',
      allowedIf: userIsAuthenticated,
      redirect: '/login',
      pageName: "Profile",
    },
  ]

  const memberRoutes = [
    {
      Component: Printing,
      path: '/2DPrinting',
      allowedIf: userIsMember || userIsOfficerOrAdmin,
      redirect: '/login',
      pageName: "Printing",
    },
    {
      Component: Messaging,
      path: '/messaging/:id?',
      allowedIf: userIsMember || userIsOfficerOrAdmin,
      redirect: '/login',
      pageName: "Messaging",
    },
    ...authenticatedRoutes,
  ]

  const officerOrAdminRoutes = [
    // new for Overview
    {
      Component: Overview,
      path: '/user-manager',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true,
      pageName: "User Manager",
    },
    //
    // {
    //   Component: EmailPage,
    //   path: '/email-list',
    //   allowedIf: userIsOfficerOrAdmin,
    //   redirect: '/',
    //   inAdminNavbar: true,
    //   pageName: "Email",
    // },
    {
      Component: LedSign,
      path: '/led-sign',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true,
      pageName: "Led Sign",
    },
    {
      Component: EditUserInfo,
      path: '/user/edit/:id',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true,
      pageName: "Edit User Info",
    },
    {
      Component: URLShortenerPage,
      path: '/short',
      allowedIf: userIsOfficerOrAdmin,
      inAdminNavbar: true,
      redirect: '/',
      pageName: "URL Shortner",
    },
    {
      Component: sendUnsubscribeEmail,
      path: '/unsub',
      allowedIf: userIsOfficerOrAdmin,
      inAdminNavbar: true,
      redirect: '/',
      pageName: "Send Unsubscribe Email",
    },
    {
      Component: AdvertisementAdmin,
      path: '/advertisement-admin',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true,
      pageName: "Advertisement Admin",
    },
    ...memberRoutes,
  ]

  return {
    notAuthenticatedRoutes,
    authenticatedRoutes,
    memberRoutes,
    officerOrAdminRoutes
  }
}

export const signedOutRoutes = [
  { Component: Home, path: '/', pageName: "Home" },
  { Component: VerifyEmailPage, path: '/verify', pageName: "Verify Email" },
  { Component: ResetPasswordPage, path: '/reset', pageName: "Reset Password" },
  { Component: AboutPage, path: '/about', pageName: "About" },
  { Component: ProjectsPage, path: '/projects', pageName: "Projects" },
  { Component: EmailPreferencesPage, path: '/emailPreferences', pageName: "Email Preferences" },
];