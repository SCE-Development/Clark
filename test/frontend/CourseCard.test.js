/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { expect } from 'chai';

import CourseCard from '../../src/Pages/Courses/CourseCard';
import Adapter from 'enzyme-adapter-react-16';
import {
  CardText,
  CardImg,
  CardSubtitle
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
    expect(wrapper.find(CardSubtitle).props().children[1]).to.equal(appProps.author);
  });
  it('Should render the description of the course', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find(CardText).props().children).to.equal(appProps.description);
  });
  it('Should render the edit course button for manager page', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    expect(wrapper.find('#edit')).to.exist;
  });
  it('Should render the popover with lesson titles', () => {
    const wrapper = shallow(<CourseCard { ...appProps } />);
    wrapper.simulate('mouseenter');
    const popoverLessonTitles = [];
    appProps.lessons.map(lesson => {
      popoverLessonTitles.push('✔️ ');
      popoverLessonTitles.push(lesson.title);
    });
    expect(wrapper.find('h6').get(1).props.children).to.eql(popoverLessonTitles);
  });
  it('Should render the popover with no lesson titles', () => {
    const wrapper = shallow(<CourseCard { ...appPropsNoLessons } />);
    wrapper.simulate('mouseenter');
    expect(wrapper.find('h6').get(0).props.children).to.equal('This course currently doesn\'t have lessons');
  });
});