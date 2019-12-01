/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import App from '../../src/App'
import Adapter from 'enzyme-adapter-react-16'
import { Router } from 'react-router-dom'

Enzyme.configure({ adapter: new Adapter() })

describe('<App />', () => {
  it('Should render a <Router /> component with one child', () => {
    const wrapper = mount(<App />)
    expect(wrapper.find(Router)).to.have.lengthOf(1)
    expect(wrapper.find(Router).children()).to.have.lengthOf(1)
  })
})
