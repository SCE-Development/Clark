/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import UserNavbar from '../../src/Components/Navbar/UserNavbar';
import Adapter from 'enzyme-adapter-react-16';
import {
  Navbar,
  UncontrolledDropdown,
} from 'reactstrap';
import { membershipState } from '../../src/Enums';

Enzyme.configure({ adapter: new Adapter() });

const adminAppProps = {
  authenticated: true,
  user: { accessLevel: membershipState.ADMIN }
};

const nonMemberAppProps = {
  authenticated: true,
  user: { accessLevel: membershipState.NON_MEMBER }
};

describe('<UserNavbar />', () => {
  it('Should render a <Navbar /> component with one child', () => {
    const wrapper = mount(<UserNavbar />);
    expect(wrapper.find(Navbar)).to.have.lengthOf(1);
  });
  it('Should render 4 routes by default', () => {
    const wrapper = mount(<UserNavbar />);
    // The reason there are 4 is due to the two
    // routes being duplicated
    expect(wrapper.find('.routes')).to.have.lengthOf(4);
  });
  it(
    'Should render two authentication buttons for' +
	' the user who isn\'t a member',
    () => {
      const wrapper = mount(<UserNavbar />);
      expect(wrapper.find('.authentication')).to.have.length(2);
    }
  );
  it(
    'Should render two <UncontrolledDropdown /> tags for' +
    ' the authenticated user',
    () => {
      const wrapper = mount(<UserNavbar {...adminAppProps} />);
      expect(wrapper.find(UncontrolledDropdown)).to.have.lengthOf(2);
    }
  );
  it(
    'Nonmembers should only see one .authenticated-navlink' +
    ' tag which is the link to their profile',
    () => {
      const wrapper = mount(<UserNavbar {...nonMemberAppProps} />);
      const authenticatedNavlinks = wrapper.find('.authenticated-navlink');
      // There are 2 instances of each dropdown to account for when the
      // navbar links stay within a hamburger menu.
      const dropdownNames = ['Profile', 'Profile'];
      authenticatedNavlinks.forEach((navLink, index) => {
        expect(navLink.props().children).to.equal(dropdownNames[index]);
      });
      expect(authenticatedNavlinks).to.have.length(2);
    }
  );
  it(
    'The two .authenticated-navlink tags for' +
    ' authenticated users should be printing and a ' +
    'drop down of account options',
    () => {
      const wrapper = mount(<UserNavbar {...adminAppProps} />);
      const authenticatedNavlinks = wrapper.find('.authenticated-navlink');
      // There are 2 instances of each dropdown to account for when the
      // navbar links stay within a hamburger menu.
      const dropdownNames = ['Profile', 'Profile', 'Services', 'Services'];
      authenticatedNavlinks.forEach((navLink, index) => {
        expect(navLink.props().children).to.equal(dropdownNames[index]);
      });
      expect(authenticatedNavlinks).to.have.length(4);
    }
  );
  it(
    'Unauthenticated users should see 0 .authenticated-navlink tags',
    () => {
      const wrapper = mount(<UserNavbar />);
      const authenticatedNavlinks = wrapper.find('.authenticated-navlink');
      // There are 2 instances of each dropdown to account for when the
      // navbar links stay within a hamburger menu.
      expect(authenticatedNavlinks).to.have.length(0);
    }
  );
});
