/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import MemberDashboard from '../../src/Pages/Overview/Overview'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('<MemberDashboard />', () => {
  Object.defineProperty(window, 'localStorage', {
    value: global.localStorage,
    configurable: true,
    enumerable: true,
    writable: true
  })

  it('Should render a <table /> component with one child', () => {
    const wrapper = mount(<MemberDashboard />)
    expect(wrapper.find('table')).to.have.lengthOf(1)
  })

  it('Should render a <tbody /> component with one child', () => {
    const wrapper = mount(<MemberDashboard />)
    expect(wrapper.find('tbody')).to.have.lengthOf(1)
  })
})
