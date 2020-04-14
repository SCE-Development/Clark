/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import EventInfoModal from '../../src/Pages/Events/EventInfoModal';
import Adapter from 'enzyme-adapter-react-16';
import { Container, Row, Col } from 'reactstrap';
import { getDateWithSlashes } from '../../src/APIFunctions/Event';
import {clockSymbol, mapPinSymbol} from '../../src/Pages/Overview/SVG.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<EventInfoModal />', () => {
  const currentEvent = {
    title: 'Big brain time',
    eventLocation: 'ENGR 292',
    description: 'boom',
    eventDate: '1999-09-03',
    startTime: '3:30 PM',
    endTime: '4:30 PM'
  };
  const appProps = {
    modal: true,
    toggle: () => {},
    currentEvent
  };
  it('Should render the title of the event', () => {
    const wrapper = mount(<EventInfoModal {...appProps} />);
    expect(wrapper.find(Container).get(0).props.children).to.equal(
      currentEvent.title
    );
  });
  it('Should render the date and time of the event', () => {
    const wrapper = mount(<EventInfoModal {...appProps} />);
    expect(
      wrapper
        .find(Row)
        .get(0)
        .props.children
        .join('')
    ).to.equal(
      `${clockSymbol()}  ` + ` ${getDateWithSlashes(currentEvent.eventDate)}  ${
        currentEvent.startTime
      } - ` + `${currentEvent.endTime}`
    );
  });
  it('Should render the location of the event', () => {
    const wrapper = mount(<EventInfoModal {...appProps} />);
    expect(
      wrapper
        .find(Row)
        .get(1)
        .props.children
        .join('')
    ).to.equal(
      `${mapPinSymbol()}` + currentEvent.eventLocation);
  });
  it('Should render the description of the event', () => {
    const wrapper = mount(<EventInfoModal {...appProps} />);
    expect(wrapper.find(Col).get(2).props.children).to.equal(
      currentEvent.description
    );
  });
});
