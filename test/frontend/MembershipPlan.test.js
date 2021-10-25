/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { Button } from 'reactstrap';
import { membershipPlans } from '../../src/Enums';

import MembershipPlan from
'../../src/Pages/MembershipApplication/MembershipPlan';
import Adapter from 'enzyme-adapter-react-16';
import { mockMonth, revertClock } from '../util/mocks/Date';

Enzyme.configure({ adapter: new Adapter() });

describe('<MembershipPlan />', () => {
  after(done => {
    // get rid of the stub
    revertClock();
    done();
  });

  const year = new Date().getFullYear();
  const FALL_SEMESTER_MEMBERSHIP = 'Fall ' + year;
  const FALL_YEAR_MEMBERSHIP = 'Fall ' + year + ' and Spring ' + (year + 1);
  const SPRING_SEMESTER_MEMBERSHIP = 'Spring ' + year;
  const SPRING_YEAR_MEMBERSHIP = 'Spring and Fall ' + year;

  it('Should render two card components', () => {
    const wrapper = mount(<MembershipPlan />);
    expect(wrapper.find('.membership-card')).to.have.lengthOf(2);
  });

  it('Should display a membership plan on each card for spring', () => {
    mockMonth(1);
    const wrapper = mount(<MembershipPlan />);
    expect(wrapper.find('.membership-card').get(0).props.id).to.equal(
      SPRING_SEMESTER_MEMBERSHIP
    );
    expect(wrapper.find('.membership-card').get(1).props.id).to.equal(
      SPRING_YEAR_MEMBERSHIP
    );
  });

  it('Should display a membership plan on each card for fall', () => {
    mockMonth(8);
    const wrapper = mount(<MembershipPlan />);
    expect(wrapper.find('.membership-card').get(0).props.id).to.equal(
      FALL_SEMESTER_MEMBERSHIP
    );
    expect(wrapper.find('.membership-card').get(1).props.id).to.equal(
      FALL_YEAR_MEMBERSHIP
    );
  });

  it('Should disable continuing when a membership plan is not selected', () => {
    const wrapper = mount(<MembershipPlan />);
    expect(wrapper.find(Button).get(0).props.disabled).to.equal(true);
  });

  it('Should enable continuing when a membership plan is selected', () => {
    const wrapper = mount(<MembershipPlan />);
    wrapper.setState({ planSelected: true });
    expect(wrapper.find(Button).get(0).props.disabled).to.equal(false);
  });

  it('Should the selected membership plan with the ' +
    'cardSelected function for spring', () => {
    mockMonth(1);
    let currentPlan;
    const appProps = {
      setSelectedPlan: id => {
        currentPlan = id;
      }
    };
    const wrapper = shallow(<MembershipPlan {...appProps} />);
    wrapper.instance().cardSelected(SPRING_SEMESTER_MEMBERSHIP);
    expect(currentPlan).to.equal(membershipPlans.SEMESTER);
    wrapper.instance().cardSelected(SPRING_YEAR_MEMBERSHIP);
    expect(currentPlan).to.equal(membershipPlans.YEAR);
  });

  it('Should the selected membership plan with ' +
    'the cardSelected function for fall', () => {
    mockMonth(8);
    let currentPlan;
    const appProps = {
      setSelectedPlan: id => {
        currentPlan = id;
      }
    };
    const wrapper = shallow(<MembershipPlan {...appProps} />);
    wrapper.instance().cardSelected(FALL_SEMESTER_MEMBERSHIP);
    expect(currentPlan).to.equal(membershipPlans.SEMESTER);
    wrapper.instance().cardSelected(FALL_YEAR_MEMBERSHIP);
    expect(currentPlan).to.equal(membershipPlans.YEAR);
  });
});
