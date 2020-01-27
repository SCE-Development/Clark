/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import Overview from '../../src/Pages/Overview/Overview'
import Adapter from 'enzyme-adapter-react-16'
import OverviewProfile from '../../src/Pages/Overview/OverviewProfile'
import { membershipState } from '../../src/Enums'

Enzyme.configure({ adapter: new Adapter() })

describe('<Overview />', () => {
  const wrapper = mount(<Overview />)

  it('Should render a <table /> component with one child', () => {
    expect(wrapper.find('table')).to.have.lengthOf(1)
  })

  it('Should render a <OverviewProfile /> component with 2 children', () => {
    const user = {
      accessLevel: membershipState.ADMIN,
      firstName: 'First',
      lastName: 'Last',
      middleInitial: 'I',
      joinDate: '12-32-2012htzs342',
      membershipValidUntil: '12-32-2012htzs342',
      email: 'email',
      major: 'major',
      doorCode: '123',
      pagesPrinted: 20
    }
    // before setState
    expect(wrapper.find(OverviewProfile)).to.have.lengthOf(0)
    // setState
    wrapper.setState({ users: [user, user] })
    // after setState
    expect(wrapper.find(OverviewProfile)).to.have.lengthOf(2)
  })

  it('Should render a <tr /> component with 8 children', () => {
    const component = wrapper.find('th')
    const shouldRenderedtr = [
      'Name',
      'Door Code',
      'Printing',
      'Email Verified',
      'Membership Plan',
      'Membership Type',
      '',
      ''
    ]

    expect(component).to.have.lengthOf(8)
    for (let i = 0; i < shouldRenderedtr.length; i++) {
      expect(component.get(i).props.children).equals(shouldRenderedtr[i])
    }
  })
})
