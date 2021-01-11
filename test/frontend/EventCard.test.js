/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import EventCard from '../../src/Pages/Events/EventCard';
import Adapter from 'enzyme-adapter-react-16';
import { Row } from 'reactstrap';
import { getDateWithSlashes } from '../../src/APIFunctions/Event';
import {clockSymbol, mapPinSymbol} from '../../src/Pages/Overview/SVG.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<EventCard />', () => {
  const appProps = {
    title: 'Big brain time',
    eventLocation: 'ENGR 292',
    description: 'boom',
    eventDate: '1999-03-29',
    startTime: '3:30 PM',
    endTime: '4:30 PM',
    imageURL: 'link.to/image'
  };
  it('Should render the title of the event', () => {
    const wrapper = mount(<EventCard {...appProps} />);
    expect(wrapper.find(Row).get(0).props.children).to.equal(appProps.title);
  });
  it('Should render the date of the event', () => {
    const wrapper = mount(<EventCard {...appProps} />);
    expect(
      wrapper
        .find(Row)
        .get(2)
        .props.children.join('')
    ).to.equal(
      <b>DATE</b> + ': ' +
      `${getDateWithSlashes(appProps.eventDate)}`
    );
  });

  it('Should render the time of the event', () => {
    const wrapper = mount(<EventCard {...appProps} />);
    expect(
      wrapper
        .find(Row)
        .get(3)
        .props.children.join('')
    ).to.equal(
      <b>TIME</b> + ': ' +
      `${appProps.startTime} - ` + `${appProps.endTime}`
    );
  });

  it('Should render the location of the event', () => {
    const wrapper = mount(<EventCard {...appProps} />);
    expect(
      wrapper
        .find(Row)
        .get(4)
        .props.children.join('')
    ).to.equal(
      <b>LOCATION</b> + ': ' + appProps.eventLocation
    );
  });

  it('Should a photo related to the event', () => {
    const wrapper = mount(<EventCard {...appProps} />);
    expect(wrapper.find('#event-image').props().src).to.equal
    (appProps.imageURL);
  });
});
