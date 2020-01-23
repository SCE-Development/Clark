/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import { Button } from 'reactstrap'
import { membershipPlans } from '../../src/Enums'

import MembershipPlan from '../../src/Pages/MembershipApplication/MembershipPlan'
import Adapter from 'enzyme-adapter-react-16'
import { mockMonth, revertClock } from '../mocks/Date'

Enzyme.configure({ adapter: new Adapter() })

describe('<MembershipPlan />', () => {
  after(done => {
    // get rid of the stub
    revertClock()
    done()
  })

  const year = new Date().getFullYear()
  const SEMESTER_MEMBERSHIP_FALL = 'Fall ' + year
  const YEAR_MEMBERSHIP_FALL = 'Fall ' + year + ' and Spring ' + (year + 1)
  const SEMESTER_MEMBERSHIP_SPRING = 'Spring ' + year
  const YEAR_MEMBERSHIP_SPRING = 'Spring and Fall ' + year

  it('Should render two card components', () => {
    const wrapper = mount(<MembershipPlan />)
    expect(wrapper.find('.card')).to.have.lengthOf(2)
  })

  it('Should display a membership plan on each card for spring', () => {
    mockMonth(1)
    const wrapper = mount(<MembershipPlan />)
    expect(wrapper.find('.card').get(0).props.id).to.equal(
      SEMESTER_MEMBERSHIP_SPRING
    )
    expect(wrapper.find('.card').get(1).props.id).to.equal(
      YEAR_MEMBERSHIP_SPRING
    )
  })

  it('Should display a membership plan on each card for fall', () => {
    mockMonth(8)
    const wrapper = mount(<MembershipPlan />)
    expect(wrapper.find('.card').get(0).props.id).to.equal(
      SEMESTER_MEMBERSHIP_FALL
    )
    expect(wrapper.find('.card').get(1).props.id).to.equal(YEAR_MEMBERSHIP_FALL)
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

  it('Should the selected membership plan with the cardSelected function for spring', () => {
    mockMonth(1)
    let currentPlan
    const appProps = {
      setSelectedPlan: id => {
        currentPlan = id
      }
    }
    const wrapper = shallow(<MembershipPlan {...appProps} />)
    wrapper.instance().cardSelected(SEMESTER_MEMBERSHIP_SPRING)
    expect(currentPlan).to.equal(membershipPlans.SEMESTER)
    wrapper.instance().cardSelected(YEAR_MEMBERSHIP_SPRING)
    expect(currentPlan).to.equal(membershipPlans.YEAR)
  })

  it('Should the selected membership plan with the cardSelected function for fall', () => {
    mockMonth(8)
    let currentPlan
    const appProps = {
      setSelectedPlan: id => {
        currentPlan = id
      }
    }
    const wrapper = shallow(<MembershipPlan {...appProps} />)
    wrapper.instance().cardSelected(SEMESTER_MEMBERSHIP_SPRING)
    expect(currentPlan).to.equal(membershipPlans.SEMESTER)
    wrapper.instance().cardSelected(YEAR_MEMBERSHIP_SPRING)
    expect(currentPlan).to.equal(membershipPlans.YEAR)
  })
})
