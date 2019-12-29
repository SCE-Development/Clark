/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import AdminNavbar from '../../src/Components/Navbar/AdminNavbar'
import Adapter from 'enzyme-adapter-react-16'
import { NavbarBrand, NavLink } from 'reactstrap'

Enzyme.configure({ adapter: new Adapter() })

const adminAppProps = {
  user: { accessLevel: 2 }
}

describe('<AdminNavbar />', () => {
  it('Should render a <NavbarBrand /> with the SCE Title', () => {
    const wrapper = mount(<AdminNavbar />)
    expect(
      wrapper
        .find(NavbarBrand)
        .prop('children')
        .toString() === 'Software & Computer Engineering Society  '
    )
  })
  it('Should render 6 <NavLink /> tags with officer Credentials', () => {
    const wrapper = mount(<AdminNavbar />)
    expect(wrapper.find(NavLink)).to.have.lengthOf(6)
  })
  it('Should render 7 <NavLink /> tags with admin Credentials', () => {
    const wrapper = mount(<AdminNavbar {...adminAppProps} />)
    expect(wrapper.find(NavLink)).to.have.lengthOf(7)
  })
})
