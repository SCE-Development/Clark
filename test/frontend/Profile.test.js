/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'
import 'regenerator-runtime/runtime'

import Profile from '../../src/Pages/Profile/admin/Profile'
import Adapter from 'enzyme-adapter-react-16'
import { Badge, Container } from 'reactstrap'
import { membershipState } from '../../src/Enums'

Enzyme.configure({ adapter: new Adapter() })

describe('<Profile />', () => {
  const enums = require('../../src/Enums')

  const user = {
    accessLevel: membershipState.ADMIN,
    firstName: 'First',
    lastName: 'Last',
    joinDate: '12-32-2012htzs342',
    membershipValidUntil: '12-32-2012htzs342',
    email: 'email',
    major: 'major',
    doorCode: '123',
    pagesPrinted: 20
  }

  const wrapper = mount(<Profile user={user} />)

  it('Should render a <Badge /> component with one child', () => {
    expect(wrapper.find(Badge)).to.have.lengthOf(1)
    expect(wrapper.find(Badge).get(0).props.children).equal(
      enums.membershipStateToString(user.accessLevel)
    )
  })

  it('Should render a <Container /> component with one child', () => {
    expect(wrapper.find(Container)).to.have.lengthOf(1)
  })

  it('Should render a <h3 /> component with one child', () => {
    const component = wrapper.find('h3')
    expect(component).to.have.lengthOf(1)
    expect(component.get(0).props.children).equal('First Last')
  })

  it('Should render a <h5 /> component with 6 children', () => {
    const component = wrapper.find('h5')
    expect(component).to.have.lengthOf(6)
    expect(component.get(0).props.children[1]).equal(user.doorCode)
    expect(component.get(1).props.children[1]).equal(user.joinDate.slice(0, 10))
    expect(component.get(2).props.children[2]).equal(
      user.membershipValidUntil.slice(0, 10)
    )
    expect(component.get(3).props.children[1]).equal(user.email)
    expect(component.get(4).props.children[1]).equal(user.major)
    expect(component.get(5).props.children[1]).equal(user.pagesPrinted)
  })
})
