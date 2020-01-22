/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import sinon from 'sinon'
import Enzyme, { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import { Button } from 'reactstrap'
import { membershipPlans } from '../../src/Enums'

import MembershipPlan from '../../src/Pages/MembershipApplication/MembershipPlan'
import Adapter from 'enzyme-adapter-react-16'
import {
  getSemesterPlan,
  getYearPlan
} from '../../src/Pages/MembershipApplication/GetPlans'

Enzyme.configure({ adapter: new Adapter() })

describe('<MembershipPlan />', () => {
  const year = new Date().getFullYear()
  let clock = null
  function mockMonth (month) {
    clock = sinon.useFakeTimers(new Date(year, month))
  }
  function revertClock () {
    if (clock) clock.restore()
  }

  after(done => {
    // get rid of the stub
    revertClock()
    done()
  })

  let SEMESTER_MEMBERSHIP
  let YEAR_MEMBERSHIP

  it('Should render two card components', () => {
    const wrapper = mount(<MembershipPlan />)
    expect(wrapper.find('.card')).to.have.lengthOf(2)
  })

  it('Should display a membership plan on each card', () => {
    let wrapper

    mockMonth(1)
    SEMESTER_MEMBERSHIP = getSemesterPlan()
    YEAR_MEMBERSHIP = getYearPlan()
    wrapper = mount(<MembershipPlan />)
    expect(wrapper.find('.card').get(0).props.id).to.equal(SEMESTER_MEMBERSHIP)
    expect(wrapper.find('.card').get(1).props.id).to.equal(YEAR_MEMBERSHIP)

    mockMonth(8)
    SEMESTER_MEMBERSHIP = getSemesterPlan()
    YEAR_MEMBERSHIP = getYearPlan()
    wrapper = mount(<MembershipPlan />)
    console.log(
      wrapper.find('.card').get(0).props.id,
      wrapper.find('.card').get(1).props.id
    )
    expect(wrapper.find('.card').get(0).props.id).to.equal(SEMESTER_MEMBERSHIP)
    expect(wrapper.find('.card').get(1).props.id).to.equal(YEAR_MEMBERSHIP)
  })

  it('Should disable continuing when a membership plan is not selected', () => {
    const wrapper = mount(<MembershipPlan />)
    expect(wrapper.find(Button).get(0).props.disabled).to.equal(true)
  })

  it('Should enable continuing when a membership plan is selected', () => {
    const wrapper = mount(<MembershipPlan />)
    wrapper.setState({ planSelected: true })
    expect(wrapper.find(Button).get(0).props.disabled).to.equal(false)
  })

  it('Should the selected membership plan with the cardSelected function', () => {
    let currentPlan
    let wrapper
    const appProps = {
      setSelectedPlan: id => {
        currentPlan = id
      }
    }

    mockMonth(1)
    wrapper = shallow(<MembershipPlan {...appProps} />)
    SEMESTER_MEMBERSHIP = getSemesterPlan()
    YEAR_MEMBERSHIP = getYearPlan()
    wrapper.instance().cardSelected(SEMESTER_MEMBERSHIP)
    expect(currentPlan).to.equal(membershipPlans.SEMESTER)
    wrapper.instance().cardSelected(YEAR_MEMBERSHIP)
    expect(currentPlan).to.equal(membershipPlans.YEAR)

    mockMonth(8)
    wrapper = shallow(<MembershipPlan {...appProps} />)
    SEMESTER_MEMBERSHIP = getSemesterPlan()
    YEAR_MEMBERSHIP = getYearPlan()
    wrapper.instance().cardSelected(SEMESTER_MEMBERSHIP)
    expect(currentPlan).to.equal(membershipPlans.SEMESTER)
    wrapper.instance().cardSelected(YEAR_MEMBERSHIP)
    expect(currentPlan).to.equal(membershipPlans.YEAR)
  })
})
