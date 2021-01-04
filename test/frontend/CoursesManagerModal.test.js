/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { modalStates } from '../../src/Enums';

import CoursesManagerModal from
  '../../src/Pages/CoursesManager/CoursesManagerModal';
import Adapter from 'enzyme-adapter-react-16';
import {
  Button,
  Modal,
  Input,
  Label,
  InputGroupAddon
} from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<CoursesManagerModal />', () => {
  const currentCourse = {
    cardNum: 1,
    imageURL: 'link.to/image',
    title: 'Intro to Docker',
    author: 'Evan Ugarte',
    description: 'This introduces basic concepts of Docker',
  };

  const submitAppProps = {
    showModal: true,
    modalState: modalStates.SUBMIT,
    toggle: () => {}
  };

  const editAppProps = {
    showModal: true,
    modalState: modalStates.EDIT,
    toggle: () => {},
    ...currentCourse
  };

  const submitWrapper = mount(<CoursesManagerModal { ...submitAppProps } />);
  const editWrapper = mount(<CoursesManagerModal { ...editAppProps } />);
  const inputAddonArray = submitWrapper.find(InputGroupAddon);
  const labelArray = submitWrapper.find(Label);
  const submitInputArray = submitWrapper.find(Input);
  const editInputArray = editWrapper.find(Input);

  it('Should render input label for Title', () => {
    expect(inputAddonArray.get(0).props.children).to.equal('Title*');
    expect(submitInputArray.get(0).props.type).to.equal('text');
  });
  it('Should render input label for Author', () => {
    expect(inputAddonArray.get(1).props.children).to.equal('Author*');
    expect(submitInputArray.get(1).props.type).to.equal('text');
  });
  it('Should render input label for Description', () => {
    expect(labelArray.get(0).props.children).to.equal('Course Description*');
    expect(submitInputArray.get(2).props.type).to.equal('textarea');
  });
  it('Should render input label for ImageURL', () => {
    expect(labelArray.get(1).props.children).to.equal('Course Image + Preview');
    expect(submitInputArray.get(3).props.type).to.equal('text');
  });
  describe('<CoursesManagerModal /> Edit State', () => {
    it('Should populate the input for Title', () => {
      expect(editInputArray.get(0).props.defaultValue).to.equal(
        currentCourse.title
      );
    });
    it('Should populate the input for Author', () => {
      expect(editInputArray.get(1).props.defaultValue).to.equal(
        currentCourse.author
      );
    });
    it('Should populate the input for Description', () => {
      expect(editInputArray.get(2).props.defaultValue).to.equal(
        currentCourse.description
      );
    });
    it('Should populate the input for ImageURL', () => {
      expect(editInputArray.get(3).props.defaultValue).to.equal(
        currentCourse.imageURL
      );
    });
  });
  describe('<CoursesManagerModal /> buttons', () => {
    const submitButtonArray = submitWrapper.find(Button);
    const editButtonArray = editWrapper.find(Button);
    it('Should render 2 buttons in the submit state', () => {
      expect(submitButtonArray).to.have.lengthOf(2);
    });
    it('Should render Cancel and Create New Course buttons in the ' +
      'submit state', () => {
      expect(submitButtonArray.get(0).props.children).to.equal('Cancel');
      expect(submitButtonArray.get(1).props.children).to.equal(
        'Create New Course'
      );
    });
    it('Should render 3 buttons in the edit state', () => {
      expect(editButtonArray).to.have.lengthOf(3);
    });
    it('Should render Cancel, Delete Course, and Submit Changes buttons in ' +
      'the edit state', () => {
      expect(editButtonArray.get(0).props.children).to.equal('Cancel');
      expect(editButtonArray.get(1).props.children).to.equal(
        'Delete Course'
      );
      expect(editButtonArray.get(2).props.children).to.equal(
        'Submit Changes'
      );
    });
  });
});
