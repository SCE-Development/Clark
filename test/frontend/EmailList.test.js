/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import EmailList from '../../src/Pages/EmailList/EmailList';
import Adapter from 'enzyme-adapter-react-16';
import { Button, ButtonDropdown, DropdownItem } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<EmailList />', () => {
  const wrapper = mount(<EmailList />);

  it('Should render 2 buttons', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(2);
  });

  it('Should render only 1 dropdown button', () => {
    expect(wrapper.find(ButtonDropdown)).to.have.lengthOf(1);
  });

  it('Should render 3 dropdown items', () => {
    expect(wrapper.find(DropdownItem)).to.have.lengthOf(3);
  });

  it('Should render 3 <p> tags if there are two user emails', () => {
    // before setState
    expect(wrapper.find('p')).to.have.lengthOf(1);
    // setState
    const user = {
      accessLevel: 2,
      email: 'test@gmail.com',
      emailOptIn: true,
      membershipValidUntil: '2020-09-01T03:06:22.356Z'
    };
    wrapper.setState({ users: [user, user] });
    // after setState
    expect(wrapper.find('p')).to.have.lengthOf(3);
  });
});
