/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

import enums from '../../src/Enums';
import { Input, Label } from 'reactstrap';
import RoleDropdown from '../../src/Pages/UserManager/RoleDropdown';

Enzyme.configure({ adapter: new Adapter() });

describe('<RoleDropdown />', () => {
  const membershipStateKeys = Object.keys(enums.membershipState);
  const membershipStateLength = membershipStateKeys.length;
  const wrapper = mount(<RoleDropdown />);
  it('Should render a <legend> tag with text "Membership Status"', () => {
    const legendTag = wrapper.find('legend').get(0);
    expect(legendTag.props.children).to.equal('Membership Status');
  });
  it(`Should render ${membershipStateLength} inputs for each membership state`,
    () => {
      const inputArray = wrapper.find(Input);
      expect(inputArray.length).to.equal(membershipStateLength);
    });
  it('Should render only radio button inputs',
    () => {
      const inputArray = wrapper.find(Input);
      inputArray.forEach((inputElement) => {
        expect(inputElement.props().type).to.equal('radio');
      });
    });
  it('Should render a readable memberhip state for each label', () => {
    const labelArray = wrapper.find(Label);
    labelArray.forEach((labelElement, index) => {
      // membershipStateKey is a string value like 'ADMIN'
      const membershipStateKey = membershipStateKeys[index];
      // membershipStateValue is a numerical value like 3
      const membershipStateValue = enums.membershipState[membershipStateKey];
      // readableValue is a string value like 'Admin'
      const readableValue = enums.membershipStateToString(membershipStateValue);
      // the first element in props children is the input
      // the second is the readable value
      expect(labelElement.props().children[1]).to.equal(readableValue);
    });
  });
});
