/* global describe it before after */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import * as LedSignAPI from '../../src/APIFunctions/LedSign';
import sinon from 'sinon';

import LedSign from '../../src/Pages/LedSign/LedSign';
import Adapter from 'enzyme-adapter-react-16';
import { Input, Spinner } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<LedSign />', () => {
  let stub = null;
  before(done => {
    stub = sinon.stub(LedSignAPI, 'healthCheck');
    done();
  });

  after(done => {
    if (stub) stub.restore();
    done();
  });

  function healthCheckWillReturn(value) {
    if (stub) stub.returns(Promise.resolve(value));
  }

  const appProps = {
    user: { name: 'test' }
  };
  const signHealthy = { error: false };
  const signUnhealthy = { error: true };

  it('Should render six <Input /> components', () => {
    const wrapper = mount(<LedSign {...appProps} />);
    expect(wrapper.find(Input)).to.have.lengthOf(6);
  });
  it('Should render a loading animation when ' +
     'waiting for a sign response', () => {
    const wrapper = mount(<LedSign {...appProps} />);
    expect(wrapper.find(Spinner)).to.have.lengthOf(1);
  });
  it('Should alert the user if the sign is down', async () => {
    healthCheckWillReturn(signUnhealthy);
    const wrapper = await mount(<LedSign {...appProps} />);
    expect(wrapper.find('.sign-status').text()).to.equal(
      'Sign Status: Sign is down!'
    );
  });
  it('Should disable all <Input /> components when sign is down', () => {
    const wrapper = mount(<LedSign {...appProps} />);
    const inputArray = wrapper.find(Input);
    inputArray.map(element => {
      expect(element.props().disabled).to.equal(true);
    });
  });
  it('Should display if the sign is up', async () => {
    healthCheckWillReturn(signHealthy);
    const wrapper = await mount(<LedSign {...appProps} />);
    expect(wrapper.find('.sign-status').text()).to.equal(
      'Sign Status: Sign is up.'
    );
  });
  it('Should enable all <Input /> components when sign is up', async () => {
    healthCheckWillReturn(signHealthy);
    const wrapper = await mount(<LedSign {...appProps} />);
    await Promise.all([healthCheckWillReturn]);
    wrapper.update();
    const inputArray = wrapper.find(Input);
    inputArray.map(element => {
      expect(element.props().disabled).to.be.equal(false);
    });
  });
});
