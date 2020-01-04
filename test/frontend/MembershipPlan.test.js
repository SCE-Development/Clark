/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import { Button } from 'reactstrap'
import { membershipPlans } from '../../src/Enums'

import MembershipPlan from '../../src/Pages/MembershipApplication/MembershipPlan'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('<MembershipPlan />', () => {
  const SEMESTER_MEMBERSHIP = 'Spring 2020'
  const YEAR_MEMBERSHIP = 'Spring and Fall 2020'

  it('Should render two card components', () => {
    const wrapper = mount(<MembershipPlan />)
    expect(wrapper.find('.card')).to.have.lengthOf(2)
  })
  it('Should display a membership plan on each card', () => {
    const wrapper = mount(<MembershipPlan />)
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
    const appProps = {
      setSelectedPlan: id => {
        currentPlan = id
      }
    }
    const wrapper = shallow(<MembershipPlan {...appProps} />)
    wrapper.instance().cardSelected(SEMESTER_MEMBERSHIP)
    expect(currentPlan).to.equal(membershipPlans.SEMESTER)
    wrapper.instance().cardSelected(YEAR_MEMBERSHIP)
    expect(currentPlan).to.equal(membershipPlans.YEAR)
  })
})
