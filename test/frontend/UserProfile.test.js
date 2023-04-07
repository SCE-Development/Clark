/* global describe it after */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';

import UserProfile from '../../src/Pages/Profile/MemberView/Profile';
import InfoCard from '../../src/Pages/Profile/MemberView/InfoCard';
import { revertClock } from '../util/mocks/Date';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<UserProfile />', () => {
  after((done) => {
    revertClock();
    done();
  });

  const user = {
    token: 'token'
  };

  let wrapper = mount(<UserProfile user={user} />);

  it('Should render a <InfoCard /> component with one child', () => {
    expect(wrapper.find(InfoCard)).to.have.lengthOf(9);
  });

  it('Should render a <img /> component with 4 children', () => {
    expect(wrapper.find('img')).to.have.lengthOf(1);
  });
});
