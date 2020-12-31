/* global describe before after it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ApiResponse } from '../../src/APIFunctions/ApiResponses';
import CoursesPage from '../../src/Pages/Courses/CoursesPage';
import * as CoursesAPI from '../../src/APIFunctions/Courses';
import CourseCard from '../../src/Pages/Courses/CourseCard';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<CoursesPage />', () => {
  let stub = null;
  const RENDERED_COURSES = new ApiResponse(false, [
    {
      cardNum: 1,
      imageURL: 'link.to/image',
      title: 'Intro to Docker',
      author: 'Evan Ugarte',
      description: 'This introduces basic concepts of Docker',
      lessons: [{ title: 'Basic Intro', mdLink: 'brrrr' }],
      isCourseManager: true
    }
  ]);

  before(done => {
    stub = sinon.stub(CoursesAPI, 'getAllCourses');
    done();
  });

  after(done => {
    if (stub) stub.restore();
    done();
  });

  function returnCoursesArray() {
    if (stub) stub.returns(RENDERED_COURSES);
  }

  function returnEmptyArray() {
    if (stub) stub.returns([]);
  }

  it('Should render a <CourseCard /> component for every element in the ' +
    'courses array', async () => {
    returnCoursesArray();
    const wrapper = await mount(<CoursesPage />);
    wrapper.update();
    console.log(wrapper.find('.card').props);
    expect(wrapper.find(CourseCard)).to.have.lengthOf(
      RENDERED_COURSES.responseData.length
    );
  }
  );
  // it('Should render a title if no courses are returned', async () => {
  //   returnEmptyArray();
  //   const wrapper = await mount(<EventList />);
  //   wrapper.update();
  //   expect(wrapper.find(EventCard)).to.have.lengthOf(0);
  //   expect(
  //     wrapper
  //       .find('h1')
  //       .children()
  //       .get(0).props.children[1].props.children
  //   ).to.equal('No courses published yet!');
  // });
  // it('Should initially hide an <EventInfoModal /> component', async () => {
  //   returnEventArray();
  //   const wrapper = await mount(<EventList />);
  //   wrapper.update();
  //   expect(wrapper.find(EventInfoModal)).to.have.lengthOf(0);
  // });
});