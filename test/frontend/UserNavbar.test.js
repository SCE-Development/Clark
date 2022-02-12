/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import UserNavbar from '../../src/Components/Navbar/UserNavbar';
import Adapter from 'enzyme-adapter-react-16';
import { Navbar, Nav, NavLink,
  UncontrolledDropdown, NavItem } from 'reactstrap';
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


function getDropdownDetails(dropdown, index = 0) {
  return dropdown.props.children[index].props.children;
}

describe('<UserNavbar />', () => {
  it('Should render a <Navbar /> component with one child', () => {
    const wrapper = mount(<UserNavbar />);
    expect(wrapper.find(Navbar)).to.have.lengthOf(1);
  });
  it('Should render 3 routes by default', () => {
    const wrapper = mount(<UserNavbar />);
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
    'The two <UncontrolledDropdown /> tags for' +
    ' authenticated users should be printing and a ' +
    'drop down of account options',
    () => {
      const wrapper = mount(<UserNavbar {...adminAppProps} />);
      const dropdowns = wrapper.find(UncontrolledDropdown);
      expect(getDropdownDetails(dropdowns.get(0))).to.equal('Services');
      expect(getDropdownDetails(dropdowns.get(1), 1)[0].props.children)
        .to.equal('Profile');
    }
  );
});
