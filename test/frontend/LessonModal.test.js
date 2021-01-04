/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { modalStates } from '../../src/Enums';

import LessonModal from '../../src/Pages/Lessons/LessonModal';
import Adapter from 'enzyme-adapter-react-16';
import {
  Button,
  Input,
  InputGroupAddon
} from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<LessonModal />', () => {
  const currentLesson = {
    title: 'Intro to Python',
    URL: 'link.to/lesson'
  };

  const submitAppProps = {
    showLessonModal: true,
    modalState: modalStates.SUBMIT,
    LessonsToggle: () => {}
  };

  const editAppProps = {
    showLessonModal: true,
    modalState: modalStates.EDIT,
    LessonsToggle: () => {},
    selectedLesson: {...currentLesson}
  };

  const submitWrapper = mount(<LessonModal { ...submitAppProps } />);
  const editWrapper = mount(<LessonModal { ...editAppProps } />);
  const inputAddonArray = submitWrapper.find(InputGroupAddon);
  const submitInputArray = submitWrapper.find(Input);
  const editInputArray = editWrapper.find(Input);

  it('Should render input label for Lesson Title', () => {
    expect(inputAddonArray.get(0).props.children).to.equal('Lesson Title*');
    expect(submitInputArray.get(0).props.type).to.equal('text');
  });
  it('Should render input label for MD Link', () => {
    expect(inputAddonArray.get(1).props.children).to.equal('MD Link**');
    expect(submitInputArray.get(1).props.type).to.equal('text');
  });
  describe('<LessonModal /> Edit State', () => {
    it('Should populate the input for Title', () => {
      expect(editInputArray.get(0).props.defaultValue).to.equal(
        currentLesson.title
      );
    });
    it('Should populate the input for MD Link', () => {
      expect(editInputArray.get(1).props.defaultValue).to.equal(
        currentLesson.URL
      );
    });
  });
  describe('<LessonModal /> buttons', () => {
    const submitButtonArray = submitWrapper.find(Button);
    const editButtonArray = editWrapper.find(Button);
    it('Should render 2 buttons in the submit state', () => {
      expect(submitButtonArray).to.have.lengthOf(2);
    });
    it('Should render Cancel and Create New Lesson buttons in the ' +
      'submit state', () => {
      expect(submitButtonArray.get(0).props.children).to.equal('Cancel');
      expect(submitButtonArray.get(1).props.children).to.equal(
        'Create New Lesson'
      );
    });
    it('Should render 3 buttons in the edit state', () => {
      expect(editButtonArray).to.have.lengthOf(3);
    });
    it('Should render Cancel, Delete Lesson, and Submit Changes buttons in ' +
      'the edit state', () => {
      expect(editButtonArray.get(0).props.children).to.equal('Cancel');
      expect(editButtonArray.get(1).props.children).to.equal(
        'Delete Lesson'
      );
      expect(editButtonArray.get(2).props.children).to.equal(
        'Submit Changes'
      );
    });
  });
});
