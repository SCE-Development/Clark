/* global describe before after it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import * as EventAPI from '../../src/APIFunctions/Event';
import sinon from 'sinon';

import { ApiResponse } from '../../src/APIFunctions/ApiResponses';
import EventList from '../../src/Pages/Events/EventList';
import EventCard from '../../src/Pages/Events/EventCard';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<EventList />', () => {
  let stub = null;
  /**
   * Event List only renders unexpired events.
   * UNEXPIRED_EVENTS_COUNT: event with dates that include
   * today's date and the dates after.
   */
  const UNEXPIRED_EVENTS_COUNT = 3;
  const RENDERED_EVENTS = new ApiResponse(false, [
    {
      title: 'Expired',
      eventLocation: 'ENGR 292',
      description: 'boom',
      eventDate: '09/03/1999',
      startTime: '4:30 PM',
      endTime: '3:30 PM'
    },
    {
      title: 'Not expired',
      eventLocation: 'ENGR 292',
      description: 'boom',
      eventDate: '09/03/2050',
      startTime: '4:30 PM',
      endTime: '3:30 PM'
    },
    {
      title: 'Not expired',
      eventLocation: 'ENGR 292',
      description: 'boom',
      eventDate: '09/03/2050',
      startTime: '4:30 PM',
      endTime: '3:30 PM'
    },
    {
      title: 'Not expired',
      eventLocation: 'ENGR 292',
      description: 'boom',
      eventDate: '09/03/2050',
      startTime: '4:30 PM',
      endTime: '3:30 PM'
    }

  ]);

  before(done => {
    stub = sinon.stub(EventAPI, 'getAllEvents');
    done();
  });

  after(done => {
    if (stub) stub.restore();
    done();
  });

  function returnEventArray() {
    if (stub) stub.returns(RENDERED_EVENTS);
  }

  function returnEmptyArray() {
    if (stub) stub.returns([]);
  }

  it(
    'Should render an <EventCard /> component for every unexpired event card ' +
      'in event list array',
    async () => {
      returnEventArray();
      const wrapper = await mount(<EventList {...RENDERED_EVENTS} />);
      wrapper.update();
      expect(wrapper.find(EventCard)).to.have.lengthOf(
        UNEXPIRED_EVENTS_COUNT
      );
    }
  );
  it('Should render a title if no events are returned', async () => {
    returnEmptyArray();
    const wrapper = await mount(<EventList {...RENDERED_EVENTS} />);
    wrapper.update();
    expect(wrapper.find(EventCard)).to.have.lengthOf(0);
    expect(
      wrapper.text().endsWith('No events yet!')
    ).to.equal(true);
  });
});
