/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { Link } from 'react-router-dom';
import InfoCard from '../../src/Pages/Profile/MemberView/InfoCard';

import AdminDashboard from '../../src/Pages/Profile/admin/AdminDashboard';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

describe('<Admin Dashboard />', () => {
  const wrapper = mount(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );

  it('Should render 4 Links', () => {
    expect(wrapper.find(Link)).to.have.lengthOf(4);
  });
  it('Shoulder render 4 InfoCards', () => {
    expect(wrapper.find(InfoCard)).to.have.lengthOf(4);
  });
});
