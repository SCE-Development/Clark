/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import EmailTemplate from '../../src/Pages/EmailList/EmailTemplate';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from 'reactstrap';
import BlastMailForm from '../../src/Pages/EmailList/BlastMailForm';

Enzyme.configure({ adapter: new Adapter() });

describe('<EmailTemplate />', () => {
  const wrapper = mount(<EmailTemplate />);

  it('Should render 3 buttons', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(3);
  });

  it('Should render BlastMailForm', () => {
    expect(wrapper.find(BlastMailForm)).to.have.lengthOf(1);
  });
});
