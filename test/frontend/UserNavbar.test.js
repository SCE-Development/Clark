/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import UserNavbar from '../../src/Components/Navbar/UserNavbar'
import Adapter from 'enzyme-adapter-react-16'
import { Navbar, Nav, NavLink, UncontrolledDropdown } from 'reactstrap'
import { membershipState } from '../../src/Enums'

Enzyme.configure({ adapter: new Adapter() })

const adminAppProps = {
  authenticated: true,
  user: { accessLevel: membershipState.ADMIN }
}

const nonMemberAppProps = {
  authenticated: true,
  user: { accessLevel: membershipState.NON_MEMBER }
}

function getDropdownDetails(dropdown, index = 0) {
  return dropdown.props.children[index].props.children
}

describe('<UserNavbar />', () => {
  it('Should render a <Navbar /> component with one child', () => {
    const wrapper = mount(<UserNavbar />)
    expect(wrapper.find(Navbar)).to.have.lengthOf(1)
  })
  it('Should render four <NavLink /> tags for unauthenticated routes', () => {
    const wrapper = mount(<UserNavbar />)
    expect(wrapper.find(NavLink)).to.have.lengthOf(2)
    expect(wrapper.find(Nav).children()).to.have.lengthOf(1)
  })
  it(
    'Should render two <NavLink /> components for' +
    " the user who isn't a member",
    () => {
      const wrapper = mount(<UserNavbar {...nonMemberAppProps} />)
      expect(wrapper.find(NavLink)).to.have.lengthOf(1)
    }
  )
  it(
    'Should render two <UncontrolledDropdown /> tags for' +
    ' the unauthenticated user',
    () => {
      const wrapper = mount(<UserNavbar />)
      expect(wrapper.find(UncontrolledDropdown)).to.have.lengthOf(2)
    }
  )
  it(
    'The two <UncontrolledDropdown /> tags for' +
    ' the unauthenticated user should be for student resources and ' +
    'to join sce',
    () => {
      const wrapper = mount(<UserNavbar />)
      const dropdowns = wrapper.find(UncontrolledDropdown)
      expect(getDropdownDetails(dropdowns.get(0))).to.equal('Student Resources')
      expect(getDropdownDetails(dropdowns.get(1))).to.equal('Join Us!')
    }
  )
  it(
    'Should render three <UncontrolledDropdown /> tags for' +
    ' the authenticated user',
    () => {
      const wrapper = mount(<UserNavbar {...adminAppProps} />)
      expect(wrapper.find(UncontrolledDropdown)).to.have.lengthOf(3)
    }
  )
  it(
    'The four <UncontrolledDropdown /> tags for' +
    ' authenticated users should be for student resources, printing, ' +
    'to join sce and a drop down of account options',
    () => {
      const wrapper = mount(<UserNavbar {...adminAppProps} />)
      const dropdowns = wrapper.find(UncontrolledDropdown)
      expect(getDropdownDetails(dropdowns.get(0))).to.equal('Student Resources')
      expect(getDropdownDetails(dropdowns.get(1))).to.equal('Printing')
      expect(
        getDropdownDetails(dropdowns.get(2), 1)[0].props.children
      ).to.equal('Profile')
    }
  )
})
