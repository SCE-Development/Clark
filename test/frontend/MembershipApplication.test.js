/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { expect } from 'chai';

import MembershipApplication from
  '../../src/Pages/MembershipApplication/MembershipApplication';
import Adapter from 'enzyme-adapter-react-16';

import MembershipForm from
  '../../src/Pages/MembershipApplication/MembershipForm';
import ConfirmationPage from
  '../../src/Pages/MembershipApplication/ConfirmationPage';
import { memberApplicationState } from '../../src/Enums';
import { CSSTransition } from 'react-transition-group';

Enzyme.configure({ adapter: new Adapter() });

describe('<MembershipApplication />', () => {
  it('Should render a <MembershipForm /> Component ' +
     'under the FORM_INFO state', () => {
    const wrapper = shallow(<MembershipApplication />);
    const f = wrapper.find(MembershipForm).get(0).props.setMembershipState;
    // since you can't directly update react hooks, we can grab the function
    // that is sent as a prop and call on it
    f(memberApplicationState.FORM_INFO);
    expect(wrapper.find(MembershipForm)).to.have.lengthOf(1);
  });
  it('Should render a <ConfirmationPage /> Component ' +
     'under the CONFIRMATION state', () => {
    const wrapper = shallow(<MembershipApplication />);
    const f = wrapper.find(MembershipForm).get(0).props.setMembershipState;
    f(memberApplicationState.CONFIRMATION);
    expect(wrapper.find(ConfirmationPage)).to.have.lengthOf(1);
  });
  it('Should render 2 <CSSTransition /> Componenets', () => {
    const wrapper = shallow(<MembershipApplication />);
    expect(wrapper.find(CSSTransition)).to.have.lengthOf(2);
  });
});
