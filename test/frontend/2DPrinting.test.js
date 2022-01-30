/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Printing2D from '../../src/Pages/2DPrinting/2DPrinting';
import * as PrintingAPI from '../../src/APIFunctions/2DPrinting';
import Adapter from 'enzyme-adapter-react-16';
import { Jumbotron } from 'reactstrap';
import { FilePond } from 'react-filepond';

Enzyme.configure({ adapter: new Adapter() });

describe('<Printing2D />', () => {
  let stub = null;
  let healthCheckStub = null;
  const user = {
    email: 'testEmail',
    pagesPrinted: 10
  };
  before(done => {
    healthCheckStub = sinon.stub(PrintingAPI, 'healthCheck');
    done();
  });
  after(done => {
    if (stub) stub.restore();
    if (healthCheckStub) healthCheckStub.restore();
    done();
  });
  it('Should render a <FilePond /> component when printer is up', () => {
    before(done => {
      if (healthCheckStub) healthCheckStub.returns({error: false});
      stub = sinon.stub(Printing2D, FilePond);
      const wrapper = mount(<Printing2D user={user} />);
      expect(wrapper.find(FilePond)).to.have.lengthOf(1);
      done();
    });
  });
  it('Should not render a <FilePond /> component when printer is down', () => {
    if (healthCheckStub) healthCheckStub.returns(null);
    const wrapper = mount(<Printing2D user={user} />);
    expect(wrapper.find(FilePond)).to.have.lengthOf(0);
  });
});
