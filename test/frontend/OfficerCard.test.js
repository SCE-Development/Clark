/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import OfficerCard from '../../src/Pages/TheTeam/OfficerCard'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('<OfficerCard />', () => {
  const officerInfo = {
    name: 'Evan ',
    picture: 'link',
    major: 'Software Engineering'
  }

  const wrapper = mount(<OfficerCard {...officerInfo} />)
  it('Should render the pictures of the officers', () => {
    expect(wrapper.find('.officer-picture').get(0).props.src).to.equal(
      officerInfo.picture
    )
  })

  it('Should render the name of the officers', () => {
    expect(wrapper.find('.name-title').get(0).props.children).to.equal(
      officerInfo.name
    )
  })

  it('Should render the major of the officers', () => {
    expect(wrapper.find('.major-title').get(0).props.children).to.equal(
      officerInfo.major
    )
  })
})
