/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { BrowserRouter,
  Routes,
  Route,
  Router,
  unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MemoryRouter } from '../util/mocks/react-router-dom';

import UserManager from '../../src/Pages/UserManager/UserManager';
import Adapter from 'enzyme-adapter-react-16';
import Users from '../../src/Pages/UserManager/Users';
import { membershipState } from '../../src/Enums';

import * as UserAPI from '../../src/APIFunctions/User';
import { UserApiResponse } from '../../src/APIFunctions/ApiResponses';
import sinon from 'sinon';

Enzyme.configure({ adapter: new Adapter() });

describe('<UserManager />', () => {
  let stub = null;
  let history = createBrowserHistory();
  const RENDERED_USERS = new UserApiResponse(false, [
    {
      'emailVerified': false,
      'accessLevel': 0.5,
      'pagesPrinted': 0,
      'firstName': 'Apple',
      'lastName': 'Roll'
    },
    {
      'emailVerified': false,
      'accessLevel': -1,
      'pagesPrinted': 0,
      'firstName': 'Banana',
      'lastName': 'Roll'
    },
    {
      'emailVerified': false,
      'accessLevel': -1,
      'pagesPrinted': 0,
      'firstName': 'Bozo',
      'lastName': 'Roll'
    },
    {
      'emailVerified': false,
      'accessLevel': -1,
      'pagesPrinted': 0,
      'firstName': 'Detox',
      'lastName': 'Roll'
    },
    {
      'emailVerified': false,
      'accessLevel': -1,
      'pagesPrinted': 0,
      'firstName': 'Dryer',
      'lastName': 'Roll'
    }
  ]);

  before(done => {
    stub = sinon.stub(UserAPI, 'getData');
    done();
  });

  after(done => {
    if (stub) stub.restore();
    done();
  });

  function returnUserArray() {
    if (stub) stub.returns(RENDERED_USERS);
  }

  function returnEmptyArray() {
    if (stub) stub.returns([]);
  }

  it('Should render a <tr /> component with 8 children', () => {
    returnUserArray();
    history.push('/');
    // Object.defineProperty(window.location, 'href', {
    //   writable: true,
    //   value: '/'
    // });
    window.history.pushState({}, 'idk', '/');
    const idk = mount(<HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<UserManager />} />
      </Routes>
    </HistoryRouter>);
    console.log(idk.html(), "hacks hacks  hacks")
    const component = idk.find('th');
    const shouldRenderedtr = [
      'Name',
      'Door Code',
      'Printing',
      'Email Verified',
      'Membership Type',
      '',
      ''
    ];
    expect(component).to.have.lengthOf(7);
    for (let i = 0; i < shouldRenderedtr.length; i++) {
      expect(component.get(i).props.children).equals(shouldRenderedtr[i]);
    }
  });
});
