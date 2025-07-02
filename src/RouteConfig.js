import Overview from './Pages/Overview/Overview';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPasswordPage from './Pages/ForgotPassword/ResetPassword';
import Profile from './Pages/Profile/MemberView/Profile';
import LedSign from './Pages/LedSign/LedSign';
import EditUserInfo from './Pages/UserManager/EditUserInfo';
import MembershipApplication from './Pages/MembershipApplication/MembershipApplication.js';
import VerifyEmailPage from './Pages/MembershipApplication/VerifyEmail.js';
import Printing from './Pages/2DPrinting/2DPrinting.js';
import AdvertisementAdmin from './Pages/Advertisement/AdvertisementAdmin.js';
import AboutPage from './Pages/About/About';
import ProjectsPage from './Pages/Projects/Projects';
import URLShortenerPage from './Pages/URLShortener/URLShortener';
import EmailPreferencesPage from './Pages/EmailPreferences/EmailPreferences';
import sendUnsubscribeEmail from './Pages/Profile/admin/SendUnsubscribeEmail';
import Messaging from './Pages/Messaging/Messaging.js';
import Home from './Pages/Home/Home.js';
import CardReader from './Pages/CardReader/CardReader.js';

// Declare an enum for permission check
export const allowedIf = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  AUTHENTICATED: 'AUTHENTICATED',
  MEMBER: 'MEMBER',
  OFFICER_OR_ADMIN: 'OFFICER_OR_ADMIN',
};

export const officerSignedInRoutes = [
  // new for Overview
  {
    Component: Overview,
    path: '/user-manager',
    pageName: 'user manager',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true
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
    pageName: 'Led Sign',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true
  },
  {
    Component: EditUserInfo,
    path: '/user/edit/:id',
    pageName: 'Edit User Info',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true
  },
  {
    Component: URLShortenerPage,
    path: '/short',
    pageName: 'URL Shortener Page',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    inAdminNavbar: true,
    redirect: '/',
  },
  {
    Component: sendUnsubscribeEmail,
    path: '/unsub',
    pageName: 'Send Unsubscribe Email',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    inAdminNavbar: true,
    redirect: '/',
  },
  {
    Component: AdvertisementAdmin,
    path: '/advertisement-admin',
    pageName: 'Advertisement Admin',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true
  },
  // {
  //   Component: DessertAdminPage,
  //   path: '/dessert-admin',
  //   pageName: 'Dessert Admin',
  //   allowedIf: allowedIf.OFFICER_OR_ADMIN,
  //   redirect: '/',
  //   inAdminNavbar: true
  // },
  {
    Component: CardReader,
    path: '/card-reader',
    pageName: 'Card Reader',
    allowedIf: allowedIf.OFFICER_OR_ADMIN,
    redirect: '/',
    inAdminNavbar: true
  },
];

export const memberSignedInRoutes = [
  {
    Component: Printing,
    path: '/2DPrinting',
    pageName: '2D Printing',
    allowedIf: allowedIf.MEMBER,
    redirect: '/login'
  },
  {
    Component: Login,
    path: '/login*',
    pageName: 'Login',
    allowedIf: allowedIf.UNAUTHENTICATED,
    redirect: '/',
    queryParams: {
      redirect: 'redirect',
    },
  },
  {
    Component: ForgotPassword,
    path: '/forgot',
    pageName: 'Forgot Password',
    allowedIf: allowedIf.UNAUTHENTICATED,
    redirect: '/'
  },
  {
    Component: MembershipApplication,
    path: '/register',
    pageName: 'Sign Up',
    allowedIf: allowedIf.UNAUTHENTICATED,
    redirect: '/'
  },
  {
    Component: Profile,
    path: '/profile',
    pageName: 'Profile',
    allowedIf: allowedIf.AUTHENTICATED,
    redirect: '/login'
  },
  {
    Component: Messaging,
    path: '/messaging/:id?',
    pageName: 'Messaging',
    allowedIf: allowedIf.MEMBER,
    redirect: '/login'
  },
  // {
  //   Component: DessertPage,
  //   path: '/desserts',
  //   pageName: 'Desserts View Page',
  //   allowedIf: allowedIf.AUTHENTICATED,
  //   redirect: '/',
  //   inAdminNavbar: false
  // },
];

export const signedOutRoutes = [
  {
    Component: Home,
    path: '/',
    pageName: 'Home Page'
  },
  {
    Component: VerifyEmailPage,
    path: '/verify',
    pageName: 'Verify Email'
  },
  {
    Component: ResetPasswordPage,
    path: '/reset',
    pageName: 'Reset Password'
  },
  {
    Component: AboutPage,
    path: '/about',
    pageName: 'About Us'
  },
  {
    Component: ProjectsPage,
    path: '/projects',
    pageName: 'Projects'
  },
  {
    Component: EmailPreferencesPage,
    path: '/emailPreferences',
    pageName: 'Email Preferences'
  },
];

