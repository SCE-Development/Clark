/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import EmailPage from '../../src/Pages/EmailList/EmailPage';
import Adapter from 'enzyme-adapter-react-16';
import { Button, TabPane } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<EmailPage />', () => {
  const wrapper = mount(<EmailPage />);

  it('Should render 3 NavItems', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(3);
  });

  it('Should render 2 tab panels', () => {
    expect(wrapper.find(TabPane)).to.have.lengthOf(2);
  });

  it('Should render 2 React component: EmailList and EmailTemplate', () => {
    expect(wrapper.find('EmailList')).to.have.lengthOf(1);
    expect(wrapper.find('EmailTemplate')).to.have.lengthOf(1);
  });
});
