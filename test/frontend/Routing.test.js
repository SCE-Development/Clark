/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import Routing from '../../src/Routing'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from '../mocks/react-router-dom'

import Admin from '../../src/Pages/Admin/Admin'
import OfficerTools from '../../src/Pages/OfficerTools/OfficerTools'
import MemberManager from '../../src/Pages/MemberManager/MemberManager'
import EventManager from '../../src/Pages/EventManager/EventManager'
import Login from '../../src/Pages/Login/Login'

import Home from '../../src/Pages/Home/Home.js'
import NotFoundPage from '../../src/Pages/NotFoundPage/NotFoundPage'
import Events from '../../src/Pages/Events/announcements/announcementsPage.jsx'
import LabKits from '../../src/Pages/LabKits/App.js'
import PrintingSolids from '../../src/Pages/3DPrinting/app3DPrintForm.js'
import SolidsConsole from '../../src/Pages/3DPrintingConsole/app3DConsole.js'
import MembershipApplication from '../../src/Pages/MembershipApplication/membershipApplication.jsx'
import Team from '../../src/Pages/TheTeam/App.js'
import Printing from '../../src/Pages/2DPrinting/App.js'
import OfficerDB from '../../src/Pages/OfficerDB/App.js'

Enzyme.configure({ adapter: new Adapter() })

Object.defineProperty(window, 'localStorage', {
  value: global.localStorage,
  configurable: true,
  enumerable: true,
  writable: true
})

const appProps = {
  user: { accessLevel: 2 },
  authenticated: true
}

const unauthedAppProps = {
  user: { accessLevel: 2 },
  authenticated: false
}

const nonAdminAppProps = {
  user: { accessLevel: 0 },
  authenticated: false
}

function getComponentFromRoute (route, props = appProps) {
  return mount(
    <MemoryRouter initialEntries={[route]}>
      <Routing appProps={props} />
    </MemoryRouter>
  )
}

describe('<Routing />', () => {
  describe('Renders correct components for each route', () => {
    it('Should render a <Home /> component with the / endpoint', () => {
      const wrapper = getComponentFromRoute('/')
      expect(wrapper.find(Home)).to.have.lengthOf(1)
    })
    it(
      'Should render an <Events /> component with the /events' + ' endpoint',
      () => {
        const wrapper = getComponentFromRoute('/events')
        expect(wrapper.find(Events)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <OfficerDB /> component with the /officerDB' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/officerDB')
        expect(wrapper.find(OfficerDB)).to.have.lengthOf(1)
      }
    )
    it('Should render a <Team /> component with the /team endpoint', () => {
      const wrapper = getComponentFromRoute('/team')
      expect(wrapper.find(Team)).to.have.lengthOf(1)
    })
    it(
      'Should render a <LabKits /> component with the /labkits' + 'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/labkits')
        expect(wrapper.find(LabKits)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <PrintingSolids /> component with the /3DPrintingForm' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/3DPrintingForm')
        expect(wrapper.find(PrintingSolids)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <Printing /> component with the /2DPrinting' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/2DPrinting')
        expect(wrapper.find(Printing)).to.have.lengthOf(1)
      }
    )
    it('Should render a <Login /> component with the /login endpoint', () => {
      const wrapper = getComponentFromRoute('/login')
      expect(wrapper.find(Login)).to.have.lengthOf(1)
    })
    it(
      'Should render a <MembershipApplication /> component with the' +
        ' /register endpoint',
      () => {
        const wrapper = getComponentFromRoute('/register')
        expect(wrapper.find(MembershipApplication)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <Admin /> component with the /admin' + 'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/admin')
        expect(wrapper.find(Admin)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <OfficerTools /> component with the /officer-tools' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/officer-tools')
        expect(wrapper.find(OfficerTools)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <MemberManager /> component with the /member-manager' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/member-manager')
        expect(wrapper.find(MemberManager)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <EventManager /> component with the /event-manager' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/event-manager')
        expect(wrapper.find(EventManager)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <SolidsConsole /> component with the /3DConsole' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/3DConsole')
        expect(wrapper.find(SolidsConsole)).to.have.lengthOf(1)
      }
    )
    it(
      'Should render a <NotFoundPage /> component with an invalid ' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/not-real')
        expect(wrapper.find(NotFoundPage)).to.have.lengthOf(1)
      }
    )
  })

  describe('<PrivateRoute /> protects authenticated components', () => {
    it('Should redirect the <Admin /> component with the /admin endpoint', () => {
      const wrapper = getComponentFromRoute('/admin', unauthedAppProps)
      expect(wrapper.find(Login)).to.have.lengthOf(1)
    })
    it(
      'Should redirect the <OfficerTools /> component with the ' +
        '/officer-tools endpoint',
      () => {
        const wrapper = getComponentFromRoute(
          '/officer-tools',
          unauthedAppProps
        )
        expect(wrapper.find(Login)).to.have.lengthOf(1)
      }
    )
    it(
      'Should redirect the <MemberManager /> component with the ' +
        '/member-manager endpoint',
      () => {
        const wrapper = getComponentFromRoute(
          '/member-manager',
          unauthedAppProps
        )
        expect(wrapper.find(Login)).to.have.lengthOf(1)
      }
    )
    it(
      'Should redirect the <EventManager /> component with the ' +
        '/event-manager endpoint',
      () => {
        const wrapper = getComponentFromRoute(
          '/event-manager',
          unauthedAppProps
        )
        expect(wrapper.find(Login)).to.have.lengthOf(1)
      }
    )
    it(
      'Should redirect the <SolidsConsole /> component with the /3DConsole' +
        'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/3DConsole', unauthedAppProps)
        expect(wrapper.find(Login)).to.have.lengthOf(1)
      }
    )
  })

  describe('<PrivateRoute /> protects components with special priviledge', () => {
    it('Should redirect the <Admin /> component with the /admin endpoint', () => {
      const wrapper = getComponentFromRoute('/admin', nonAdminAppProps)
      expect(wrapper.find(Login)).to.have.lengthOf(1)
    })
  })
})
