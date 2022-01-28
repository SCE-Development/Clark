/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Printing2D from '../../src/Pages/2DPrinting/2DPrinting';
import Adapter from 'enzyme-adapter-react-16';
import { Jumbotron } from 'reactstrap';
import { FilePond } from 'react-filepond';

Enzyme.configure({ adapter: new Adapter() });

describe('<Printing2D />', () => {
  let stub = null;
  const user = {
    email: 'testEmail',
    pagesPrinted: 10
  };
  it('Should render a <Jumbotron /> component', () => {
    const wrapper = mount(<Printing2D user={user} />);
    expect(wrapper.find(Jumbotron)).to.have.lengthOf(1);
  });
  it('Should render a <Filepond /> component when printer is up', () => {
    before(done => {
      stub = sinon.stub(Printing2D, FilePond);
      const wrapper = mount(<Printing2D user={user} />);
      expect(wrapper.find(FilePond)).to.have.lengthOf(1);
      done();
    });

    after(done => {
      if (stub) stub.restore();
      done();
    });
  });
  it('Should not render a <Filepond /> component when printer is down', () => {
    const wrapper = mount(<Printing2D user={user} />);
    expect(wrapper.find(FilePond)).to.have.lengthOf(0);
  });
});
