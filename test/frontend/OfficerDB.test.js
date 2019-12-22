/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import OfficerManager from '../../src/Pages/OfficerDB/App.js'
import Adapter from 'enzyme-adapter-react-16'
import { Table } from 'reactstrap'

Enzyme.configure({ adapter: new Adapter() })

describe('<Table />', () => {
  it('Should render a <Table /> component with one child', () => {
    const wrapper = mount(<OfficerManager />)
    expect(wrapper.find(Table)).to.have.lengthOf(1)
  })

  it('Should render a <tbody /> component with 2 children', () => {
    const wrapper = mount(<OfficerManager />)
    expect(wrapper.find('tbody').children()).to.have.lengthOf(2)
  })
})
