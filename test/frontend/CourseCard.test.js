/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import CourseCard from '../../src/Pages/Courses/CourseCard';
import Adapter from 'enzyme-adapter-react-16';
import {
  CardText,
  CardImg,
  CardSubtitle,
  Popover
} from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<CourseCard />', () => {
  const appProps = {
    cardNum: 1,
    imageURL: 'link.to/image',
    title: 'Intro to Docker',
    author: 'Evan Ugarte',
    description: 'This introduces basic concepts of Docker',
    lessons: [{ title: 'Basic Intro', mdLink: 'brrrr' }],
    isCourseManager: true
  };
  const appPropsNoLessons = {
    ...appProps,
    lessons: []
  };
  const appPropsNotManager = {
    ...appProps,
    isCourseManager: false
  };

  it('Should render the image of the course', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find(CardImg).prop('src')).to.equal(appProps.imageURL);
  });
  it('Should render the title of the course', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find('b').props().children).to.equal(appProps.title);
  });
  it('Should render the author of the course', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find(CardSubtitle).props().children[1])
      .to
      .equal(appProps.author);
  });
  it('Should render the description of the course', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find(CardText).props().children)
      .to
      .equal(appProps.description);
  });
  it('Should render the edit course button for manager page', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find('.edit-button')).to.have.lengthOf(1);
  });
  it('Should not render the edit course button for the main course page',
    () => {
      const wrapper = shallow(<CourseCard { ...appPropsNotManager } />);
      expect(wrapper.find('.edit-button')).to.have.lengthOf(0);
    }
  );
  it('Should not render the popover initially', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find(Popover).prop('isOpen')).to.be.false;
  });
  it('Should render the popover with lesson titles on hover', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    wrapper.find('.course-card').simulate('mouseenter');
    expect(wrapper.find(Popover).prop('isOpen')).to.be.true;
    const popoverLessonTitles = [];
    appProps.lessons.map(lesson => {
      popoverLessonTitles.push('✔️ ');
      popoverLessonTitles.push(lesson.title);
    });
    expect(wrapper.find('h6').get(1).props.children)
      .to
      .eql(popoverLessonTitles);
  });
  it('Should render the popover with no lesson titles on hover', () => {
    const wrapper = shallow(<CourseCard { ...appPropsNoLessons } />);
    wrapper.find('.course-card').simulate('mouseenter');
    expect(wrapper.find(Popover).props().isOpen).to.be.true;
    expect(wrapper.find('h6').get(0).props.children)
      .to
      .equal('This course currently doesn\'t have lessons');
  });
  it('Should not render popover on cursor leave', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find(Popover).props().isOpen).to.be.false;
    wrapper.find('.course-card').simulate('mouseenter');
    expect(wrapper.find(Popover).props().isOpen).to.be.true;
    wrapper.find('.course-card').simulate('mouseleave');
    expect(wrapper.find(Popover).props().isOpen).to.be.false;
  });
});
