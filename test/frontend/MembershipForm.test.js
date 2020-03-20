/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { Label, Input } from 'reactstrap';

import MembershipForm from 
  '../../src/Pages/MembershipApplication/MembershipForm';
import Adapter from 'enzyme-adapter-react-16';
import MajorDropdown from '../../src/Pages/MembershipApplication/MajorDropdown';

Enzyme.configure({ adapter: new Adapter() });

describe('<MembershipForm />', () => {
  describe('Renders labels and inputs of correct types', () => {
    const wrapper = mount(<MembershipForm />);
    const labelArray = wrapper.find(Label);
    const inputArray = wrapper.find(Input);
    it('Should render first name label & input fields', () => {
      const currentLabel = labelArray.get(0).props;
      const currentInput = inputArray.get(0).props;
      expect(currentLabel.children[0]).to.equal('First Name');
      expect(currentInput.type).to.equal('text');
      expect(currentLabel.for).to.equal(currentInput.id);
    });
    it('Should render last name label & input fields', () => {
      const currentLabel = labelArray.get(1).props;
      const currentInput = inputArray.get(1).props;
      expect(currentLabel.children[0]).to.equal('Last Name');
      expect(currentInput.type).to.equal('text');
      expect(currentLabel.for).to.equal(currentInput.id);
    });
    it('Should render email label & input fields', () => {
      const currentLabel = labelArray.get(2).props;
      const currentInput = inputArray.get(2).props;
      expect(currentLabel.children[0]).to.equal('Email');
      expect(currentInput.type).to.equal('email');
      expect(currentLabel.for).to.equal(currentInput.id);
    });
    it('Should render password label & input fields', () => {
      const currentLabel = labelArray.get(3).props;
      const currentInput = inputArray.get(3).props;
      expect(currentLabel.children[0]).to.equal(
        'Password (8 or more characters)'
      );
      expect(currentInput.type).to.equal('password');
      expect(currentLabel.for).to.equal(currentInput.id);
    });
    it('Should a <MajorDropdown > component', () => {
      expect(wrapper.find(MajorDropdown)).to.have.lengthOf(1);
    });
  });
});
