/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import EmailTemplate from '../../src/Pages/EmailList/EmailTemplate';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<EmailTemplate />', () => {
  const wrapper = mount(<EmailTemplate />);

  it('Should render 1 button', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(1);
  });

  it('Should render 2 additional <div> tags if there are two events', () => {
    // before setState
    expect(wrapper.find('div')).to.have.lengthOf(3);
    // setState
    const event = {
      title: 'Test event 123',
      description: 'This is an event description',
      eventDate: '2030-06-07T04:14:05.024Z',
      startTime: '9:00 AM',
      endTime: '10:00 AM'
    };
    wrapper.setState({ events: [event, event] });
    // after setState
    expect(wrapper.find('div')).to.have.lengthOf(5);
  });
});
