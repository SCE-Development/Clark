/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Printing2D from '../../src/Pages/2DPrinting/2DPrinting';
import Adapter from 'enzyme-adapter-react-16';
import { Jumbotron } from 'reactstrap';
import { FilePond } from 'react-filepond';

Enzyme.configure({ adapter: new Adapter() });

describe('<Printing2D />', () => {
  const user = {
    email: 'testEmail',
    pagesPrinted: 10
  };
  it('Should render a <Jumbotron /> component', () => {
    const wrapper = mount(<Printing2D user={user} />);
    expect(wrapper.find(Jumbotron)).to.have.lengthOf(1);
  });
  it('Should render a <Filepond /> component', () => {
    const wrapper = mount(<Printing2D user={user} />);
    expect(wrapper.find(FilePond)).to.have.lengthOf(1);
  });
  it('Should render a title SCE Printing System', () => {
    const wrapper = mount(<Printing2D user={user} />);
    expect(wrapper.find('.display-4').text()).to.be.eql('SCE Printing System');
  });
});
