/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import sinon from 'sinon';
import * as UserAPI from '../../src/APIFunctions/User';
import { UserApiResponse } from '../../src/APIFunctions/ApiResponses';
import Overview from '../../src/Pages/Overview/Overview';
import Adapter from 'enzyme-adapter-react-16';
import { membershipState } from '../../src/Enums';

Enzyme.configure({ adapter: new Adapter() });

describe('<Overview />', () => {
  const defaultProps = {
    user: {
      token: '1234',
    },
  };
  let stub = null;
  before(done => {
    stub = sinon.stub(UserAPI, 'getAllUsers');
    done();
  });

  after(done => {
    if (stub) stub.restore();
    done();
  });


  it('Should render a <table /> component with one child', () => {
    const wrapper = mount(<Overview {...defaultProps} />);
    expect(wrapper.find('.table')).to.have.lengthOf(1);
  });

  it('Should render a table row for each user', async () => {
    const user = {
      accessLevel: membershipState.ADMIN,
      firstName: 'First',
      lastName: 'Last',
      middleInitial: 'I',
      joinDate: '12-32-2012htzs342',
      membershipValidUntil: '12-32-2012htzs342',
      email: 'email',
      major: 'major',
      doorCode: '123',
      pagesPrinted: 20
    };
    stub.returns(new UserApiResponse(false, { items: [user, user] }));
    const wrapper = await mount(<Overview {...defaultProps} />);
    wrapper.update();
    expect(wrapper.find('.tr')).to.have.lengthOf(3);
  });

  it('Should render a table header with 6 columns', () => {
    const wrapper = mount(<Overview {...defaultProps} />);
    const component = wrapper.find('.td');
    const shouldRenderedtr = [
      'Name',
      'Email',
      'Printing',
      'Verified',
      'Membership',
      'Delete',
    ];

    expect(component).to.have.lengthOf(6);
    for (let i = 0; i < shouldRenderedtr.length; i++) {
      expect(component.get(i).props.children).equals(shouldRenderedtr[i]);
    }
  });
});
