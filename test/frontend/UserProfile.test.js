/* global describe it after */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'
import 'regenerator-runtime/runtime'

import UserProfile from '../../src/Pages/Profile/MemberView/Profile'
import InfoCard from '../../src/Pages/Profile/MemberView/InfoCard'
import {mockMonth, revertClock} from '../mocks/Date'
import Adapter from 'enzyme-adapter-react-16'

import winter from '../../src/Pages/Profile/MemberView/Image/winter'
import fall from '../../src/Pages/Profile/MemberView/Image/fall'
import summer from '../../src/Pages/Profile/MemberView/Image/summer'
import spring from '../../src/Pages/Profile/MemberView/Image/spring'

Enzyme.configure({ adapter: new Adapter() })

describe('<UserProfile />', () => {
  after(done => {
    // get rid of the stub
    revertClock()
    done()
  })

  const user = {
    token: 'token'
  }

  let wrapper = mount(<UserProfile user={user} />)

  it('Should render a <InfoCard /> component with one child', () => {
    expect(wrapper.find(InfoCard)).to.have.lengthOf(1)
  })

  it('Should render a <img /> component with 3 children', () => {
    expect(wrapper.find('img')).to.have.lengthOf(3)
  })

  it('Should render a <img /> where src = public/images/SCE-glow.png', () => {
    expect(wrapper.find('img').get(0).props.src).equals('images/SCE-glow.png')
  })

  it('Should render spring images when the month is spring', () => {
    mockMonth(4)
    wrapper = mount(<UserProfile user={user} />)
    expect(wrapper.find('img').get(1).props.src).equals(spring)
    expect(wrapper.find('img').get(2).props.src).equals(spring)
  })

  it('Should render summer images when the month is summer', () => {
    mockMonth(6)
    wrapper = mount(<UserProfile user={user} />)
    expect(wrapper.find('img').get(1).props.src).equals(summer)
    expect(wrapper.find('img').get(2).props.src).equals(summer)
  })

  it('Should render fall images when the month is fall', () => {
    mockMonth(10)
    wrapper = mount(<UserProfile user={user} />)
    expect(wrapper.find('img').get(1).props.src).equals(fall)
    expect(wrapper.find('img').get(2).props.src).equals(fall)
  })

  it('Should render winter images when the month is winter', () => {
    mockMonth(0)
    wrapper = mount(<UserProfile user={user} />)
    expect(wrapper.find('img').get(1).props.src).equals(winter)
    expect(wrapper.find('img').get(2).props.src).equals(winter)
  })
})
