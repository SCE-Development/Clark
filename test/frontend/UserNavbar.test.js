/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import UserNavbar from '../../src/Components/Navbar/UserNavbar'
import Adapter from 'enzyme-adapter-react-16'
import { Navbar, Nav, NavLink, UncontrolledDropdown } from 'reactstrap'

Enzyme.configure({ adapter: new Adapter() })

const authenticatedAppProps = {
  authenticated: true,
  user: { accessLevel: 2 }
}

function getDropdownDetails (dropdown, index = 0) {
  return dropdown.props.children[index].props.children
}

describe('<UserNavbar />', () => {
  it('Should render a <Navbar /> component with one child', () => {
    const wrapper = mount(<UserNavbar />)
    expect(wrapper.find(Navbar)).to.have.lengthOf(1)
  })
  it('Should render four <NavLink /> tags for unauthenticated routes', () => {
    const wrapper = mount(<UserNavbar />)
    expect(wrapper.find(NavLink)).to.have.lengthOf(4)
    expect(wrapper.find(Nav).children()).to.have.lengthOf(1)
  })
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
    'Should render four <UncontrolledDropdown /> tags for' +
      ' the authenticated user',
    () => {
      const wrapper = mount(<UserNavbar {...authenticatedAppProps} />)
      expect(wrapper.find(UncontrolledDropdown)).to.have.lengthOf(4)
    }
  )
  it(
    'The four <UncontrolledDropdown /> tags for' +
      ' authenticated users should be for student resources, printing, ' +
      'to join sce and a drop down of account options',
    () => {
      const wrapper = mount(<UserNavbar {...authenticatedAppProps} />)
      const dropdowns = wrapper.find(UncontrolledDropdown)
      expect(getDropdownDetails(dropdowns.get(0))).to.equal('Student Resources')
      expect(getDropdownDetails(dropdowns.get(1))).to.equal('Printing')
      expect(getDropdownDetails(dropdowns.get(2))).to.equal('Join Us!')
      expect(
        getDropdownDetails(dropdowns.get(3), 1)[0].props.children
      ).to.equal('Profile')
    }
  )
})
