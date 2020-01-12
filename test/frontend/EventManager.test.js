/* global describe before after it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'
import * as EventAPI from '../../src/APIFunctions/Event'
import sinon from 'sinon'

import EventList from '../../src/Pages/Events/EventList'
import EventCard from '../../src/Pages/Events/EventCard'
import Adapter from 'enzyme-adapter-react-16'
import EventManager from '../../src/Pages/EventManager/EventManager'
import EventManagerModal from '../../src/Pages/EventManager/EventManagerModal'

Enzyme.configure({ adapter: new Adapter() })

describe('<EventManager />', () => {
  var stub = null
  const RENDERED_EVENTS = [
    {
      title: 'Big brain time',
      eventLocation: 'ENGR 292',
      description: 'boom',
      eventDate: '09/03/1999',
      startTime: '4:30 PM',
      endTime: '3:30 PM'
    }
  ]
  const APP_PROPS = {
    user: { token: 'hi' }
  }

  before(done => {
    stub = sinon.stub(EventAPI, 'getAllEvents')
    done()
  })

  after(done => {
    if (stub) stub.restore()
    done()
  })

  function returnEventArray () {
    if (stub) stub.returns(RENDERED_EVENTS)
  }

  function returnEmptyArray () {
    if (stub) stub.returns([])
  }

  it(
    'Should render an <EventCard /> component for every element in the event' +
      ' array',
    async () => {
      returnEventArray()
      const wrapper = await mount(<EventManager {...APP_PROPS} />)
      wrapper.update()
      expect(wrapper.find(EventCard)).to.have.lengthOf(RENDERED_EVENTS.length)
    }
  )
  it('Should render a title if no events are returned', async () => {
    returnEmptyArray()
    const wrapper = await mount(<EventManager {...APP_PROPS} />)
    wrapper.update()
    expect(wrapper.find(EventCard)).to.have.lengthOf(0)
    expect(wrapper.find('.empty-title').get(0).props.children).to.equal(
      'No events yet!'
    )
  })
  it('Should initially hide an <EventManagerModal /> component', async () => {
    returnEventArray()
    const wrapper = await mount(<EventList />)
    wrapper.update()
    expect(wrapper.find(EventManagerModal)).to.have.lengthOf(0)
  })
})
