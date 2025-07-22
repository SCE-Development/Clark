import Overview from './Pages/Overview/Overview.js';
import Login from './Pages/Login/Login.js';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword.js';
import ResetPasswordPage from './Pages/ForgotPassword/ResetPassword.js';
import Profile from './Pages/Profile/MemberView/Profile.js';
import LedSign from './Pages/LedSign/LedSign.js';
import EditUserInfo from './Pages/UserManager/EditUserInfo.js';
import MembershipApplication from './Pages/MembershipApplication/MembershipApplication.js';
import VerifyEmailPage from './Pages/MembershipApplication/VerifyEmail.js';
import Printing from './Pages/2DPrinting/2DPrinting.js';
import AdvertisementAdmin from './Pages/Advertisement/AdvertisementAdmin.js';
import AboutPage from './Pages/About/About.js';
import ProjectsPage from './Pages/Projects/Projects.js';
import URLShortenerPage from './Pages/URLShortener/URLShortener.js';
import EmailPreferencesPage from './Pages/EmailPreferences/EmailPreferences.js';
import sendUnsubscribeEmail from './Pages/Profile/admin/SendUnsubscribeEmail.js';
import Messaging from './Pages/Messaging/Messaging.js';
import Home from './Pages/Home/Home.js';
import CardReader from './Pages/CardReader/CardReader.js';
import AuditLogsPage from './Pages/AuditLog/AuditLog.js';

// Declare an enum for permission check
export const allowedIf = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  AUTHENTICATED: 'AUTHENTICATED',
  MEMBER: 'MEMBER',
  OFFICER_OR_ADMIN: 'OFFICER_OR_ADMIN',
};

export const notAuthenticatedRoutes = [
  {
    Component: Login,
    path: '/login*',
    pageName: 'Login',
    allowedIf: allowedIf.UNAUTHENTICATED,
    redirect: '/',
    queryParams: {
      redirect: 'redirect',
    },
    hideFromShortcutSuggestions: false
  },
  {
    Component: ForgotPassword,
    path: '/forgot',
    pageName: 'Forgot Password',
    allowedIf: allowedIf.UNAUTHENTICATED,
    redirect: '/',
    hideFromShortcutSuggestions: false
  },
  {
    Component: MembershipApplication,
    path: '/register',
    pageName: 'Sign Up',
    allowedIf: allowedIf.UNAUTHENTICATED,
    redirect: '/',
    hideFromShortcutSuggestions: false
  },
];

const authenticatedRoutes = [
  {
    Component: Profile,
    path: '/profile',
    pageName: 'Profile',
    allowedIf: allowedIf.AUTHENTICATED,
    redirect: '/login',
    hideFromShortcutSuggestions: false
  },
];

export const memberRoutes = [
  {
    Component: Printing,
    path: '/2DPrinting',
    pageName: '2D Printing',
    allowedIf: allowedIf.MEMBER,
    redirect: '/login',
    hideFromShortcutSuggestions: false
  },
  {
    Component: Messaging,
    path: '/messaging/:id?',
    pageName: 'Messaging',
    allowedIf: allowedIf.MEMBER,
    redirect: '/login',
    hideFromShortcutSuggestions: true
  },
  ...authenticatedRoutes,
];

export const officerOrAdminRoutes = [
  // new for Overview
  {
    Component: Overview,
    path: '/user-manager',
    pageName: 'User Manager',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true,
    hideFromShortcutSuggestions: false
  },
  //
  // {
  //   Component: EmailPage,
  //   path: '/email-list',
  //   allowedIf: userIsOfficerOrAdmin,
  //   redirect: '/',
  //   inAdminNavbar: true
  // },
  {
    Component: LedSign,
    path: '/led-sign',
    pageName: 'LED Sign',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true,
    hideFromShortcutSuggestions: false
  },
  {
    Component: EditUserInfo,
    path: '/user/edit/:id',
    pageName: 'Edit User Info',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true,
    hideFromShortcutSuggestions: true
  },
  {
    Component: URLShortenerPage,
    path: '/short',
    pageName: 'URL Shortener Page',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    inAdminNavbar: true,
    redirect: '/',
    hideFromShortcutSuggestions: false
  },
  {
    Component: sendUnsubscribeEmail,
    path: '/unsub',
    pageName: 'Send Unsubscribe Email',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    inAdminNavbar: true,
    redirect: '/',
    hideFromShortcutSuggestions: false
  },
  {
    Component: AdvertisementAdmin,
    path: '/advertisement-admin',
    pageName: 'Advertisement Admin',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true,
    hideFromShortcutSuggestions: false
  },
  {
    Component: CardReader,
    path: '/card-reader',
    pageName: 'Card Reader',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true,
    hideFromShortcutSuggestions: false
  },
  {
    Component: AuditLogsPage,
    path: '/audit-logs',
    pageName: 'Audit Log',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true,
    hideFromShortcutSuggestions: false
  },
  ...memberRoutes,
];

export const signedOutRoutes = [
  {
    Component: Home,
    path: '/',
    pageName: 'Home Page',
    hideFromShortcutSuggestions: false
  },
  {
    Component: VerifyEmailPage,
    path: '/verify',
    pageName: 'Verify Email',
    hideFromShortcutSuggestions: true
  },
  {
    Component: ResetPasswordPage,
    path: '/reset',
    pageName: 'Reset Password',
    hideFromShortcutSuggestions: true
  },
  {
    Component: AboutPage,
    path: '/about',
    pageName: 'About Us',
    hideFromShortcutSuggestions: false
  },
  {
    Component: ProjectsPage,
    path: '/projects',
    pageName: 'Projects',
    hideFromShortcutSuggestions: false
  },
  {
    Component: EmailPreferencesPage,
    path: '/emailPreferences',
    pageName: 'Email Preferences',
    hideFromShortcutSuggestions: true
  },
];
