/* global describe before after it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ApiResponse } from '../../src/APIFunctions/ApiResponses';
import * as CoursesAPI from '../../src/APIFunctions/Courses';
import CoursesManager from '../../src/Pages/CoursesManager/CoursesManager';
import CoursesManagerModal from
  '../../src/Pages/CoursesManager/CoursesManagerModal';
import CourseCard from '../../src/Pages/Courses/CourseCard';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<CoursesManager />', () => {
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
  const APP_PROPS = {
    user: { token: 'userToken' }
  };

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
    if (stub) stub.returns(new ApiResponse(false, []));
  }

  it('Should render a <CourseCard /> component for every element in the ' +
    'courses array',
  async () => {
    await returnCoursesArray();
    const div = document.createElement('div');
    div.setAttribute('id', 'card1');
    document.body.appendChild(div);
    const wrapper = await mount(<CoursesManager { ...APP_PROPS } />);
    wrapper.update();
    expect(wrapper.find(CourseCard)).to.have.lengthOf(
      RENDERED_COURSES.responseData.length
    );
  }
  );
  it('Should render a title if no courses are returned', async () => {
    await returnEmptyArray();
    const wrapper = await mount(<CoursesManager { ...APP_PROPS } />);
    wrapper.update();
    expect(wrapper.find(CourseCard)).to.have.lengthOf(0);
    expect(wrapper.find('h1').props().children)
      .to
      .equal('No courses published yet!');
  });
  it('Should initially hide an <CoursesManagerModal /> component',
    async () => {
      await returnCoursesArray();
      const wrapper = await mount(<CoursesManager { ...APP_PROPS } />);
      wrapper.update();
      expect(wrapper.find(CoursesManagerModal)).to.have.lengthOf(0);
    }
  );
});
