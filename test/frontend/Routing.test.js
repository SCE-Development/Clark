/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import Routing from '../../src/Routing';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from '../mocks/react-router-dom';

import EventManager from '../../src/Pages/EventManager/EventManager';
import Login from '../../src/Pages/Login/Login';

import Home from '../../src/Pages/Home/Home.js';
import NotFoundPage from '../../src/Pages/NotFoundPage/NotFoundPage';
import Events from '../../src/Pages/Events/EventList';
import PrintingSolids from '../../src/Pages/3DPrinting/3DPrintForm.js';
import SolidsConsole from '../../src/Pages/3DPrintingConsole/3DConsole.js';
import MembershipApplication from 
  '../../src/Pages/MembershipApplication/membershipApplication.jsx';
import Team from '../../src/Pages/TheTeam/TheTeam.js';
import Printing from '../../src/Pages/2DPrinting/2DPrinting.js';
import OfficerDB from '../../src/Pages/OfficerDB/OfficerDB.js';
import Overview from '../../src/Pages/Overview/Overview';
import { membershipState } from '../../src/Enums';

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
      'Should render a <OfficerDB /> component with the /officerDB' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/officerDB');
        expect(wrapper.find(OfficerDB)).to.have.lengthOf(1);
      }
    );
    it('Should render a <Team /> component with the /team endpoint', () => {
      const wrapper = getComponentFromRoute('/team');
      expect(wrapper.find(Team)).to.have.lengthOf(1);
    });
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
      'Should render a <OfficerDB /> component with the /officerDB' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/officerDB', officerAppProps);
        expect(wrapper.find(OfficerDB)).to.have.lengthOf(1);
      }
    );
    it('Should render a <Team /> component with the /team endpoint', () => {
      const wrapper = getComponentFromRoute('/team', officerAppProps);
      expect(wrapper.find(Team)).to.have.lengthOf(1);
    });
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
      'Should render a <Overveiw /> component with the /dashboard' + 'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/dashboard', officerAppProps);
        expect(wrapper.find(Overview)).to.have.lengthOf(1);
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
