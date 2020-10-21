/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { modalStates } from '../../src/Enums';

import EventManagerModal from '../../src/Pages/EventManager/EventManagerModal';
import Adapter from 'enzyme-adapter-react-16';
import { InputGroupAddon, Label, Input, Button } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<EventManagerModal />', () => {
  const currentEvent = {
    title: 'Big brain time',
    eventLocation: 'ENGR 292',
    eventCategory: 'Workshop',
    description: 'boom',
    eventDate: '09/03/1999',
    startTime: '15:30',
    endTime: '16:30',
    imageURL: 'link.to/image'
  };

  const submitAppProps = {
    modal: true,
    modalState: modalStates.SUBMIT,
    toggle: () => {}
  };

  const editAppProps = {
    modal: true,
    modalState: modalStates.EDIT,
    toggle: () => {},
    ...currentEvent
  };

  const submitWrapper = mount(<EventManagerModal {...submitAppProps} />);
  const editWrapper = mount(<EventManagerModal {...editAppProps} />);
  const inputAddonArray = submitWrapper.find(InputGroupAddon);
  const labelArray = submitWrapper.find(Label);
  const submitInputArray = submitWrapper.find(Input);
  const editInputArray = editWrapper.find(Input);

  it('Should render input labels for Title', () => {
    expect(inputAddonArray.get(0).props.children).to.equal('Event Title*');
    expect(submitInputArray.get(0).props.type).to.equal('text');
  });
  it('Should render input labels for Date', () => {
    expect(inputAddonArray.get(1).props.children).to.equal('Event Date*');
    expect(submitInputArray.get(1).props.type).to.equal('date');
  });
  it('Should render input labels for Location', () => {
    expect(inputAddonArray.get(2).props.children).to.equal('Event Location*');
    expect(submitInputArray.get(2).props.type).to.equal('text');
  });
  it('Should render input labels for Category', () => {
    expect(inputAddonArray.get(3).props.children).to.equal('Event Category');
    expect(submitInputArray.get(3).props.type).to.equal('select');
  });
  it('Should render input labels for Start Time', () => {
    expect(inputAddonArray.get(4).props.children).to.equal('Start Time*');
    expect(submitInputArray.get(4).props.type).to.equal('time');
  });
  it('Should render input labels for End Time', () => {
    expect(inputAddonArray.get(5).props.children).to.equal('End Time*');
    expect(submitInputArray.get(5).props.type).to.equal('time');
  });
  it('Should render input labels for Description', () => {
    expect(labelArray.get(0).props.children).to.equal('Event Description');
    expect(submitInputArray.get(6).props.type).to.equal('textarea');
  });
  it('Should render input labels for ImageURL', () => {
    expect(labelArray.get(1).props.children).to.equal('Event Image + Preview');
    expect(submitInputArray.get(7).props.type).to.equal('text');
  });
  describe('<EventManagerModal /> Edit State', () => {
    it('Should populate the input for Title', () => {
      expect(editInputArray.get(0).props.defaultValue).to.equal(
        currentEvent.title
      );
    });
    it('Should populate the input for Date', () => {
      expect(editInputArray.get(1).props.defaultValue).to.equal(
        currentEvent.eventDate
      );
    });
    it('Should populate the input for Location', () => {
      expect(editInputArray.get(2).props.defaultValue).to.equal(
        currentEvent.eventLocation
      );
    });
    it('Should populate the input for Category', () => {
      expect(editInputArray.get(3).props.defaultValue).to.equal(
        currentEvent.eventCategory
      );
    });
    it('Should populate the input for Start Time', () => {
      expect(editInputArray.get(4).props.defaultValue).to.equal(
        currentEvent.startTime
      );
    });
    it('Should populate the input for End Time', () => {
      expect(editInputArray.get(5).props.defaultValue).to.equal(
        currentEvent.endTime
      );
    });
    it('Should populate the input for Description', () => {
      expect(editInputArray.get(6).props.defaultValue).to.equal(
        currentEvent.description
      );
    });
    it('Should populate the input for ImageURL', () => {
      expect(editInputArray.get(7).props.defaultValue).to.equal(
        currentEvent.imageURL
      );
    });
  });
  describe('<EventManagerModal /> buttons', () => {
    const submitButtonArray = submitWrapper.find(Button);
    const editButtonArray = editWrapper.find(Button);
    it('Should render 2 buttons in the submit state', () => {
      expect(submitButtonArray).to.have.lengthOf(2);
    });
    it('Should render a Submit Changes and submit ' +
       'button in the submit state', () => {
      expect(submitButtonArray.get(0).props.children).to.equal('Cancel');
      expect(submitButtonArray.get(1).props.children).to.equal(
        'Create New Event'
      );
    });
    it('Should render 3 buttons in the edit state', () => {
      expect(editButtonArray).to.have.lengthOf(3);
    });
    it('Should render a cancel delete and submit ' +
       'button in the submit state', () => {
      expect(editButtonArray.get(0).props.children).to.equal('Cancel');
      expect(editButtonArray.get(1).props.children).to.equal('Delete Event');
      expect(editButtonArray.get(2).props.children).to.equal('Submit Changes');
    });
  });
});
