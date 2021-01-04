/* global describe before after it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ApiResponse } from '../../src/APIFunctions/ApiResponses';
import LessonsPage from '../../src/Pages/Lessons/LessonsPage';
import * as CoursesAPI from '../../src/APIFunctions/Courses';
import { membershipState } from '../../src/Enums';
import Adapter from 'enzyme-adapter-react-16';
import { Dropdown } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<LessonsPage />', () => {
  let lessonsStub = null;
  let summaryStub = null;
  const RENDERED_LESSONS = new ApiResponse(false, [
    { title: '1st lesson title', mdLink: 'link.to/first' },
    { title: '2nd lesson title', mdLink: 'link.to/second' },
    { title: '3rd lesson title', mdLink: 'link.to/third' }
  ]);
  const RENDERED_SUMMARY = new ApiResponse(false, 'This is the summary');
  const adminAppProps = {
    location: {
      state: { _id: 123456 }
    },
    match: {
      params: { courseTitle: 'This is the course title' }
    },
    user: {
      accessLevel: membershipState.ADMIN,
      token: 'userToken'
    }
  };
  const officerAppProps = {
    ...adminAppProps,
    user: {
      accessLevel: membershipState.ADMIN,
      token: 'userToken'
    }
  };
  const memberAppProps = {
    ...adminAppProps,
    user: {
      accessLevel: membershipState.MEMBER,
      token: 'userToken'
    }
  };

  before(done => {
    lessonsStub = sinon.stub(CoursesAPI, 'getAllLessons');
    summaryStub = sinon.stub(CoursesAPI, 'getSummary');
    done();
  });

  after(done => {
    if (lessonsStub && summaryStub){
      lessonsStub.restore();
      summaryStub.restore();
    }
    done();
  });

  function returnCoursesArray() {
    if (lessonsStub) lessonsStub.returns(RENDERED_LESSONS);
  }

  function returnSummaryArray() {
    if (summaryStub) summaryStub.returns(RENDERED_SUMMARY);
  }

  function returnEmptyLessons() {
    if (lessonsStub) lessonsStub.returns(new ApiResponse(false, []));
  }

  function returnEmptySummary() {
    if (summaryStub) summaryStub.returns(new ApiResponse(false, ''));
  }

  it('Should render course title on top', async ()=> {
    await returnCoursesArray();
    await returnSummaryArray();
    const memberWrapper = await mount(<LessonsPage { ...memberAppProps } />);
    memberWrapper.update();
    expect(memberWrapper.find('.course-title').props().children)
      .to
      .equal(memberAppProps.match.params.courseTitle);
  });
  describe('<LessonsPage /> Buttons', () => {
    it('Should render 3 buttons for officers and admins', async ()=> {
      await returnCoursesArray();
      await returnSummaryArray();
      const officerWrapper =
        await mount(<LessonsPage { ...officerAppProps } />);
      const adminWrapper = await mount(<LessonsPage { ...adminAppProps } />);
      officerWrapper.update();
      adminWrapper.update();
      expect(officerWrapper.find('.officerBtn')).to.have.lengthOf(3);
      expect(adminWrapper.find('.officerBtn')).to.have.lengthOf(3);
    });
    it('Should render Add a lesson, Edit selected lesson, and Edit course ' +
      'home buttons for officers and admins', async ()=> {
      await returnCoursesArray();
      await returnSummaryArray();
      const officerWrapper =
        await mount(<LessonsPage { ...officerAppProps } />);
      const adminWrapper = await mount(<LessonsPage { ...adminAppProps } />);
      officerWrapper.update();
      adminWrapper.update();
      const officerBtns = officerWrapper.find('.officerBtn');
      const adminBtns = adminWrapper.find('.officerBtn');
      expect(officerBtns.get(0).props.children).to.equal('Add a lesson');
      expect(officerBtns.get(1).props.children)
        .to
        .equal('Edit selected lesson');
      expect(officerBtns.get(2).props.children).to.equal('Edit course home');
      expect(adminBtns.get(0).props.children).to.equal('Add a lesson');
      expect(adminBtns.get(1).props.children).to.equal('Edit selected lesson');
      expect(adminBtns.get(2).props.children).to.equal('Edit course home');
    });
    it('Should render Course Home button', async () => {
      await returnCoursesArray();
      await returnSummaryArray();
      const memberWrapper = mount(<LessonsPage { ...memberAppProps } />);
      memberWrapper.update();
      expect(memberWrapper.find('.SCEButton').props().children)
        .to
        .equal('Course home');
    });
  });
  describe('<LessonsPage /> Summary', () => {
    it('Should initially render summary', async () => {
      await returnCoursesArray();
      await returnSummaryArray();
      const memberWrapper = await mount(<LessonsPage { ...memberAppProps } />);
      memberWrapper.update();
      expect(memberWrapper.find('.md-content-container h2').props().children)
        .to
        .equal('This is the summary');
    });
    it('Should render \'No summary set yet\' for no summary', async () => {
      await returnCoursesArray();
      await returnEmptySummary();
      const memberWrapper = await mount(<LessonsPage { ...memberAppProps } />);
      memberWrapper.update();
      expect(memberWrapper.find('.md-content-container h2').props().children)
        .to
        .equal('No summary set yet');
    });
  });
  describe('<LessonPage /> Lessons', () => {
    it('Should render 3 lessons', async () => {
      await returnCoursesArray();
      await returnSummaryArray();
      const memberWrapper = await mount(<LessonsPage { ...memberAppProps } />);
      memberWrapper.update();
      expect(memberWrapper.find('.lesson-name')).to.have.lengthOf(3);
    });
    it('Should render 3 lesson names', async () => {
      await returnCoursesArray();
      await returnSummaryArray();
      const memberWrapper = await mount(<LessonsPage { ...memberAppProps } />);
      memberWrapper.update();
      const lessonNamesArray = memberWrapper.find('.lesson-name');
      expect(lessonNamesArray.get(0).props.children)
        .to
        .eql([ 1, '. ', '1st lesson title' ]);
      expect(lessonNamesArray.get(1).props.children)
        .to
        .eql([ 2, '. ', '2nd lesson title' ]);
      expect(lessonNamesArray.get(2).props.children)
        .to
        .eql([ 3, '. ', '3rd lesson title' ]);
    });
    it('Should render 0 lessons for no lessons', async () => {
      await returnEmptyLessons();
      await returnSummaryArray();
      const memberWrapper = await mount(<LessonsPage { ...memberAppProps } />);
      memberWrapper.update();
      expect(memberWrapper.find('.lesson-name')).to.have.lengthOf(0);
    });
    describe('<LessonPage /> smaller screen', () => {
      it('Should render a dropdown button', async () => {
        await returnCoursesArray();
        await returnSummaryArray();
        const memberWrapper =
          await mount(<LessonsPage { ...memberAppProps } />);
        memberWrapper.update();
        expect(memberWrapper.find(Dropdown)).to.have.lengthOf(1);
        expect(
          memberWrapper
            .find('.dropdown-toggle .btn-secondary')
            .props()
            .children
        ).to.equal('Select a lesson');
      });
      it('Should render lessons when the dropdown is clicked', async () => {
        await returnCoursesArray();
        await returnSummaryArray();
        const memberWrapper =
          await mount(<LessonsPage { ...memberAppProps } />);
        memberWrapper.update();
        memberWrapper.find(Dropdown).simulate('click');
        expect(
          memberWrapper
            .find('.dropdown-header p')
            .props().children
        ).to.equal('Lessons');
        RENDERED_LESSONS.responseData.map((lesson, index) => {
          expect(
            memberWrapper
              .find('.dropdown-item div')
              .get(index).props.children
          ).to.equal(lesson.title);
        });
      });
    });
  });
});
