import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';
import Overview from './Pages/Overview/Overview';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPasswordPage from './Pages/ForgotPassword/ResetPassword';
import Profile from './Pages/Profile/MemberView/Profile';
import LedSign from './Pages/LedSign/LedSign';
import SpeakerPage from './Pages/Speaker/Speaker';
import EditUserInfo from './Pages/UserManager/EditUserInfo';

import Home from './Pages/Home/Home.js';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import MembershipApplication from
  './Pages/MembershipApplication/MembershipApplication.js';
import VerifyEmailPage from './Pages/MembershipApplication/VerifyEmail.js';
import Printing from './Pages/2DPrinting/2DPrinting.js';

import { membershipState } from './Enums';

import AboutPage from './Pages/About/About';
import ProjectsPage from './Pages/Projects/Projects';
import URLShortenerPage from './Pages/URLShortener/URLShortener';

import EmailPreferencesPage from './Pages/EmailPreferences/EmailPreferences';

import sendUnsubscribeEmail from './Pages/Profile/admin/SendUnsubscribeEmail';

Enzyme.configure({ adapter: new Adapter() });

Object.defineProperty(window, 'localStorage', {
  value: global.localStorage,
  configurable: true,
  enumerable: true,
  writable: true
});

const adminAppProps = {
  user: { accessLevel: membershipState.ADMIN },
  authenticated: true
};

const officerAppProps = {
  user: { accessLevel: membershipState.OFFICER },
  authenticated: true
};

const memberAppProps = {
  user: { accessLevel: membershipState.MEMBER },
  authenticated: true
};

const nonMemberAppProps = {
  user: { accessLevel: membershipState.NON_MEMBER },
  authenticated: true
};

const unauthedAppProps = {
  authenticated: false
};
function getComponentFromRoute(route, props = adminAppProps) {
  return mount(
    <MemoryRouter initialEntries={[route]}>
      <Routing appProps={props} />
    </MemoryRouter>
  );
}


export default function Routing({ appProps }) {
  const userIsAuthenticated = appProps.authenticated;
  const userIsMember =
    userIsAuthenticated &&
    appProps.user &&
    appProps.user.accessLevel === membershipState.MEMBER;
  const userIsOfficerOrAdmin =
    userIsAuthenticated &&
    appProps.user &&
    appProps.user.accessLevel >= membershipState.OFFICER;
  const signedInRoutes = [
    // new for Overview
    {
      Component: Overview,
      path: '/user-manager',
      allowedIf: userIsOfficerOrAdmin,
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
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: SpeakerPage,
      path: '/speakers',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: Printing,
      path: '/2DPrinting',
      allowedIf: userIsMember || userIsOfficerOrAdmin,
      redirect: '/login'
    },
    {
      Component: Login,
      path: '/login*',
      allowedIf: !userIsAuthenticated,
      redirect: '/',
      queryParams: {
        redirect: 'redirect',
      },
    },
    {
      Component: ForgotPassword,
      path: '/forgot',
      allowedIf: !userIsAuthenticated,
      redirect: '/'
    },
    {
      Component: MembershipApplication,
      path: '/register',
      allowedIf: !userIsAuthenticated,
      redirect: '/'
    },
    {
      Component: Profile,
      path: '/profile',
      allowedIf: userIsAuthenticated,
      redirect: '/login'
    },
    {
      Component: EditUserInfo,
      path: '/user/edit/:id',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: URLShortenerPage,
      path: '/short',
      allowedIf: userIsOfficerOrAdmin,
      inAdminNavbar: true,
      redirect: '/',
    },
    {
      Component: sendUnsubscribeEmail,
      path: '/unsub',
      allowedIf: userIsOfficerOrAdmin,
      inAdminNavbar: true,
      redirect: '/',
    },
  ];
  const signedOutRoutes = [
    { Component: Home, path: '/' },
    { Component: VerifyEmailPage, path: '/verify' },
    { Component: ResetPasswordPage, path: '/reset' },
    { Component: AboutPage, path: '/about'},
    { Component: ProjectsPage, path: '/projects'},
    { Component: EmailPreferencesPage, path: '/emailPreferences' },
  ];

  return (
    <Router>
      <Switch>
        {signedInRoutes.map(
          ({
            path,
            Component,
            allowedIf,
            redirect,
            inAdminNavbar,
            hideAdminNavbar = false,
          }, index) => {
            function getCorrectComponent(privateRouteProps) {
              if (hideAdminNavbar) {
                return <Component {...privateRouteProps} />;
              }
              return (<NavBarWrapper
                component={Component}
                enableAdminNavbar={inAdminNavbar}
                {...privateRouteProps}
              />);
            }
            return (
              <PrivateRoute
                key={index}
                exact
                path={path}
                appProps={{
                  allowed: allowedIf,
                  user: appProps.user,
                  redirect,
                  authenticated:userIsAuthenticated,
                  ...appProps
                }}
                component={props => getCorrectComponent(props)}
              />
            );
          }
        )}
        {signedOutRoutes.map(({ path, Component }, index) => {
          return (
            <Route
              key={index}
              exact
              path={path}
              render={props => (
                <NavBarWrapper component={Component} {...props} {...appProps} />
              )}
            />
          );
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

describe('<Routing /> with <PrivateRoute />', () => {
  describe('Renders correct components for Admin user', () => {
    it('Should render a <Home /> component with the / endpoint', () => {
      const wrapper = getComponentFromRoute('/');
      expect(wrapper.find(Home)).to.have.lengthOf(1);
    });
    it(
      'Should render an <Events /> component with the /events' + ' endpoint',
      () => {
        const wrapper = getComponentFromRoute('/events');
        expect(wrapper.find(Events)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <PrintingSolids /> component with the /3DPrintingForm ' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/3DPrintingForm');
        expect(wrapper.find(PrintingSolids)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <Printing /> component with the /2DPrinting' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/2DPrinting');
        expect(wrapper.find(Printing)).to.have.lengthOf(1);
      }
    );
    it(
      'Should redirect the authenticated user to <Home /> from the' +
        ' /login endpoint',
      () => {
        const wrapper = getComponentFromRoute('/login');
        expect(wrapper.find(Home)).to.have.lengthOf(1);
      }
    );
    it(
      'Should redirect the authenticated user to <Home /> from the' +
        ' /register endpoint',
      () => {
        const wrapper = getComponentFromRoute('/register');
        expect(wrapper.find(Home)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <EventManager /> component with the /event-manager' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/event-manager');
        expect(wrapper.find(EventManager)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <SolidsConsole /> component with the /3DConsole' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/3DConsole');
        expect(wrapper.find(SolidsConsole)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <NotFoundPage /> component with an invalid ' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/not-real');
        expect(wrapper.find(NotFoundPage)).to.have.lengthOf(1);
      }
    );
  });

  describe('Renders correct component for Officer user', () => {
    it('Should render a <Home /> component with the / endpoint', () => {
      const wrapper = getComponentFromRoute('/', officerAppProps);
      expect(wrapper.find(Home)).to.have.lengthOf(1);
    });
    it(
      'Should render an <Events /> component with the /events' + ' endpoint',
      () => {
        const wrapper = getComponentFromRoute('/events', officerAppProps);
        expect(wrapper.find(Events)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <PrintingSolids /> component with the /3DPrintingForm ' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute(
          '/3DPrintingForm',
          officerAppProps
        );
        expect(wrapper.find(PrintingSolids)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <Printing /> component with the /2DPrinting' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/2DPrinting', officerAppProps);
        expect(wrapper.find(Printing)).to.have.lengthOf(1);
      }
    );
    it(
      'Should redirect the authenticated user to <Home /> from the' +
        ' /login endpoint',
      () => {
        const wrapper = getComponentFromRoute('/login', officerAppProps);
        expect(wrapper.find(Home)).to.have.lengthOf(1);
      }
    );
    it(
      'Should redirect the authenticated user to <Home /> from the' +
        ' /register endpoint',
      () => {
        const wrapper = getComponentFromRoute('/register', officerAppProps);
        expect(wrapper.find(Home)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <AdminDashboard /> component with the '
      + '/dashboard' + 'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/dashboard', officerAppProps);
        expect(wrapper.find(AdminDashboard)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <EventManager /> component with the /event-manager' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute(
          '/event-manager', officerAppProps
        );
        expect(wrapper.find(EventManager)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <SolidsConsole /> component with the /3DConsole' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/3DConsole', officerAppProps);
        expect(wrapper.find(SolidsConsole)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <Overview /> component with the '
        + '/user-manager' + 'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/user-manager', officerAppProps);
        expect(wrapper.find(Overview)).to.have.lengthOf(1);
      }
    );
  });

  describe(
    '<PrivateRoute /> prevents unauthorized members from viewing the' +
      ' backend',
    () => {
      it(
        'Should redirect the <EventManager /> component with the ' +
          '/event-manager endpoint',
        () => {
          const wrapper = getComponentFromRoute(
            '/event-manager',
            memberAppProps
          );
          expect(wrapper.find(Home)).to.have.lengthOf(1);
        }
      );
      it(
        'Should redirect the <Overview /> component with the ' +
          '/dashboard endpoint',
        () => {
          const wrapper = getComponentFromRoute('/dashboard', memberAppProps);
          expect(wrapper.find(Home)).to.have.lengthOf(1);
        }
      );
      it(
        'Should redirect the <SolidsConsole /> component with the /3DConsole ' +
          'endpoint',
        () => {
          const wrapper = getComponentFromRoute('/3DConsole', memberAppProps);
          expect(wrapper.find(Home)).to.have.lengthOf(1);
        }
      );
    }
  );

  describe('Renders correct component for the unauthenticated user', () => {
    it('Should render the <Login /> component with the /login endpoint', () => {
      const wrapper = getComponentFromRoute('/login', unauthedAppProps);
      expect(wrapper.find(Login)).to.have.lengthOf(1);
    });
    it(
      'Should render the <MembershipApplication /> component with the ' +
        '/register endpoint',
      () => {
        const wrapper = getComponentFromRoute('/register', unauthedAppProps);
        expect(wrapper.find(MembershipApplication)).to.have.lengthOf(1);
      }
    );
    it('Should redirect from the /2DPrinting endpoint ' +
       'to the /login endpoint', () => {
      const wrapper = getComponentFromRoute('/2DPrinting', unauthedAppProps);
      expect(wrapper.find(Login)).to.have.lengthOf(1);
    });
    it('Should redirect from the /3DPrintingForm endpoint ' +
       'to the /login endpoint', () => {
      const wrapper = getComponentFromRoute(
        '/3DPrintingForm', unauthedAppProps
      );
      expect(wrapper.find(Login)).to.have.lengthOf(1);
    });
  });
  describe('Renders correct component for the non member user', () => {
    it('Should redirect from the /2DPrinting ' +
       'endpoint to the / endpoint', () => {
      const wrapper = getComponentFromRoute('/2DPrinting', nonMemberAppProps);
      expect(wrapper.find(Home)).to.have.lengthOf(1);
    });
    it('Should redirect from the /3DPrintingForm ' +
       'endpoint to the / endpoint', () => {
      const wrapper = getComponentFromRoute(
        '/3DPrintingForm',
        nonMemberAppProps
      );
      expect(wrapper.find(Home)).to.have.lengthOf(1);
    });
  });
});
