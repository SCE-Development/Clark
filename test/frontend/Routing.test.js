import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import Routing from '../../src/Routing';
import Home from '../../src/Pages/Home/Home';
import Overview from '../../src/Pages/Overview/Overview';
import LedSign from '../../src/Pages/LedSign/LedSign';
import SpeakersPage from '../../src/Pages/Speaker/Speaker';
import Printing from '../../src/Pages/2DPrinting/2DPrinting';
import Profile from '../../src/Pages/Profile/MemberView/Profile';
import EditUserInfo from '../../src/Pages/UserManager/EditUserInfo';
import URLShortenerPage from '../../src/Pages/URLShortener/URLShortener';
import sendUnsubscribeEmail from '../../src/Pages/Profile/admin/SendUnsubscribeEmail';
import NotFoundPage from '../../src/Pages/NotFoundPage/NotFoundPage';
import PrivateRoute from '../../src/Components/Routing/PrivateRoute';

import { membershipState } from '../../src/Enums';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

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

function getComponentFromRoute(route, props = adminAppProps) {
  return mount(
    <MemoryRouter initialEntries={[route]} appProps={props} />
  );
}

describe('<Routing /> with <PrivateRoute />', () => {
  describe('Renders correct components for Admin user', () => {
    it('Should render a <Home /> component with the / endpoint', () => {
      const wrapper = getComponentFromRoute('/');
      expect(wrapper.find(Home)).to.have.lengthOf(1);
    });
    it(
      'Should render an <Overview /> component with the /user-manager ' + ' endpoint',
      () => {
        const wrapper = getComponentFromRoute('/user-manager');
        expect(wrapper.find(Overview)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <LedSign /> component with the /led-sign ' +
      'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/led-sign');
        expect(wrapper.find(LedSign)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <SpeakersPage /> component with the /speakers' +
      'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/speakers');
        expect(wrapper.find(SpeakersPage)).to.have.lengthOf(1);
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
      ' /forgot endpoint',
      () => {
        const wrapper = getComponentFromRoute('/forgot');
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
      'Should render a <Profile /> component with the /profile' +
      'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/profile');
        expect(wrapper.find(Profile)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <EditUserInfo /> component with the /user/edit/:id' +
      'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/user/edit/:id');
        expect(wrapper.find(EditUserInfo)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <URLShortenerPage /> component with the /short' +
      'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/short');
        expect(wrapper.find(URLShortenerPage)).to.have.lengthOf(1);
      }
    );
    it(
      'Should render a <sendUnsubscribeEmail /> component with the /unsub' +
      'endpoint',
      () => {
        const wrapper = getComponentFromRoute('/unsub');
        expect(wrapper.find(sendUnsubscribeEmail)).to.have.lengthOf(1);
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
});