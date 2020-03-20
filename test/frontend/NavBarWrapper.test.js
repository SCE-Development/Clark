/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import NavBarWrapper from '../../src/Components/Navbar/NavBarWrapper';
import UserNavbar from '../../src/Components/Navbar/UserNavbar';
import AdminNavbar from '../../src/Components/Navbar/AdminNavbar';
import NotFoundPage from '../../src/Pages/NotFoundPage/NotFoundPage';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const adminAppProps = {
  component: NotFoundPage,
  enableAdminNavbar: true
};
const userAppProps = {
  component: NotFoundPage
};

describe('<NavBarWrapper />', () => {
  it('Should by default render a <UserNavbar /> with the component', () => {
    const wrapper = mount(<NavBarWrapper {...userAppProps} />);
    expect(wrapper.find(UserNavbar)).to.have.lengthOf(1);
    expect(wrapper.find(NotFoundPage).children()).to.have.lengthOf(1);
  });
  it('Should render a <AdminNavbar /> with the enableAdminNavbar prop', () => {
    const wrapper = mount(<NavBarWrapper {...adminAppProps} />);
    expect(wrapper.find(AdminNavbar)).to.have.lengthOf(1);
    expect(wrapper.find(NotFoundPage).children()).to.have.lengthOf(1);
  });
});
