/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

import ExpirationDropdown from '../../src/Pages/UserManager/ExpirationDropdown';
import { revertClock, mockMonthAndYear } from '../util/mocks/Date';

Enzyme.configure({ adapter: new Adapter() });

describe('<ExpirationDropdown />', () => {
  const SPRING = {
    MONTH: 3, // This is april
    YEAR: 1996,
  };

  const FALL = {
    MONTH: 10, // This is september
    YEAR: 1996,
  };

  // If it was spring 1996
  const EXPECTED_SPRING_OPTIONS = [
    'Keep Same',
    'Expired Membership',
    'This semester (June 1, 1996)',
    '2 semesters (Jan 1, 1997)',
  ];

  // If it was fall 1997
  const EXPECTED_FALL_OPTIONS = [
    'Keep Same',
    'Expired Membership',
    'This semester (Jan 1, 1997)',
    '2 semesters (June 1, 1997)',
  ];

  afterEach((done) => {
    revertClock();
    done();
  });

  it('Should render a <select> tag', () => {
    const wrapper = mount(<ExpirationDropdown />);
    const selectArray = wrapper.find('select');
    expect(selectArray.length).to.equal(1);
  });
  it('Should render a four <option> tags', () => {
    const wrapper = mount(<ExpirationDropdown />);
    const optionArray = wrapper.find('option');
    expect(optionArray.length).to.equal(4);
  });
  it('Should have four options with expected expiration dates for spring',
    () => {
      mockMonthAndYear(SPRING.MONTH, SPRING.YEAR);
      const wrapper = mount(<ExpirationDropdown />);
      const optionArray = wrapper.find('option');
      optionArray.forEach((option, index) => {
        expect(option.props().children)
          .to.equal(EXPECTED_SPRING_OPTIONS[index]);
      });
    });
  it('Should have four options with expected expiration dates for fall',
    () => {
      mockMonthAndYear(FALL.MONTH, FALL.YEAR);
      const wrapper = mount(<ExpirationDropdown />);
      const optionArray = wrapper.find('option');
      optionArray.forEach((option, index) => {
        expect(option.props().children).to.equal(EXPECTED_FALL_OPTIONS[index]);
      });
    });
});
