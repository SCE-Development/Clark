/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { Col } from 'reactstrap';
import * as UserAPI from '../../src/APIFunctions/User';
import sinon from 'sinon';

import { ApiResponse } from '../../src/APIFunctions/ApiResponses';
import { membershipState, membershipStateToString } from '../../src/Enums';
import EditUserInfo from '../../src/Pages/UserManager/EditUserInfo.js';
import MajorDropdown from '../../src/Pages/MembershipApplication/MajorDropdown';
import RoleDropdown from '../../src/Pages/UserManager/RoleDropdown';
import ExpirationDropdown from '../../src/Pages/UserManager/ExpirationDropdown';
import { revertClock, mockMonthAndYear } from '../util/mocks/Date';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<EditUserInfo />', () => {
  let stub = null;

  const defaultProps = {
    match: {
      params: {
        id: 'thai',
      },
    },
    user: {
      token: 'quach',
    },
  };

  const APRIL = 3;
  const SEPTEMBER = 10;
  const YEAR = 1992;

  const userData = {
    firstName: 'Who',
    lastName: 'Knows',
    doorCode: '888-8888',
    major: 'Some Major',
    pagesPrinted: 10,
    emailVerified: true,
    emailOptIn: true,
    joinDate: '1992-02-19T04:40:35Z',
    membershipValidUntil: '1992-07-19T18:40:35Z',
    email: 'e@e.e',
  };

  const testCasesForValidMembership = [
    {
      role: membershipState.BANNED,
      expected: 'Membership invalid, user has the Ban role.',
    },
    {
      role: membershipState.PENDING,
      expected: 'Membership invalid, user has the Pending role.',
    },
    {
      role: membershipState.NON_MEMBER,
      expected: 'Membership expires on Sun Jul 19 1992',
    },
    {
      role: membershipState.ALUMNI,
      expected: 'Membership expires on Sun Jul 19 1992',
    },
    {
      role: membershipState.MEMBER,
      expected: 'Membership expires on Sun Jul 19 1992',
    },
    {
      role: membershipState.OFFICER,
      expected: 'Membership does not expire as the user is an Officer',
    },
    {
      role: membershipState.ADMIN,
      expected: 'Membership does not expire as the user is an Admin',
    },
  ];

  const testCasesForExpiredMembership = [
    {
      role: membershipState.BANNED,
      expected: 'Membership invalid, user has the Ban role.',
    },
    {
      role: membershipState.PENDING,
      expected: 'Membership invalid, user has the Pending role.',
    },
    {
      role: membershipState.NON_MEMBER,
      expected: 'Membership expired on Sun Jul 19 1992',
    },
    {
      role: membershipState.ALUMNI,
      expected: 'Membership expired on Sun Jul 19 1992',
    },
    {
      role: membershipState.MEMBER,
      expected: 'Membership expired on Sun Jul 19 1992',
    },
    {
      role: membershipState.OFFICER,
      expected: 'Membership does not expire as the user is an Officer',
    },
    {
      role: membershipState.ADMIN,
      expected: 'Membership does not expire as the user is an Admin',
    },
  ];

  // children is an array of values found in the div's
  // children, i.e. [ 'Membership ', 'expires', ' on', ' ', [Object] ]
  function parseUserRolePropsChildren(children) {
    let result = '';
    children.forEach(child => {
      if (typeof child === 'string') {
        result += child;
      } else {
        // it must be the <b> tag so we extract the date from it
        result += child.props.children;
      }
    });
    return result;
  }

  before(done => {
    stub = sinon.stub(UserAPI, 'getUserById');
    done();
  });

  after(done => {
    if (stub) stub.restore();
    done();
  });

  afterEach((done) => {
    revertClock();
    done();
  });

  function returnUser(permission = membershipState.MEMBER) {
    stub.returns(new ApiResponse(false, {
      accessLevel: permission,
      ...userData,
    }));
  }

  function returnNobody() {
    stub.returns(new ApiResponse(true, {}));
  }

  it('Should render seven <Input> tags', async () => {
    returnUser();
    const wrapper = await mount(<EditUserInfo {...defaultProps} />);
    wrapper.update();
    // same as doing <Input /> in this case
    const inputArray = wrapper.find('.form-control');
    expect(inputArray.length).to.equal(7);
  });

  it('Should render a column with SCE join date', async () => {
    returnUser();
    const wrapper = await mount(<EditUserInfo {...defaultProps} />);
    wrapper.update();
    const boldArray = wrapper.find('b');
    const columnArray = wrapper.find(Col);

    expect(columnArray).to.have.length.above(0);
    expect(columnArray.get(0).props.children).to.have.length(2);
    expect(columnArray.get(0).props.children[0]).to.equal('Joined SCE: ');

    expect(boldArray).to.have.length.above(0);
    expect(boldArray.get(0).props.children).to.equal(
      new Date(userData.joinDate).toDateString()
    );
  });

  testCasesForValidMembership.map((testCase) => {
    const role = membershipStateToString(testCase.role);
    return it(
      `Should render correct prompt for a valid user with role "${role}"`,
      async () => {
        mockMonthAndYear(APRIL, YEAR);
        returnUser(testCase.role);
        const wrapper = await mount(<EditUserInfo {...defaultProps} />);
        wrapper.update();
        const children = wrapper.find('.userRolePrompt').get(0).props.children;
        expect(
          parseUserRolePropsChildren(children)
        ).to.equal(testCase.expected);
      });
  });

  testCasesForExpiredMembership.map((testCase) => {
    const role = membershipStateToString(testCase.role);
    return it(
      `Should render correct prompt for an expired user with role "${role}"`,
      async () => {
        mockMonthAndYear(SEPTEMBER, YEAR);
        returnUser(testCase.role);
        const wrapper = await mount(<EditUserInfo {...defaultProps} />);
        wrapper.update();
        const children = wrapper.find('.userRolePrompt').get(0).props.children;
        expect(
          parseUserRolePropsChildren(children)
        ).to.equal(testCase.expected);
      });
  });

  it('Should render a RoleDropdown', async () => {
    returnUser();
    const wrapper = await mount(<EditUserInfo {...defaultProps} />);
    wrapper.update();
    const RoleDropdownArray = wrapper.find(RoleDropdown);
    expect(RoleDropdownArray.length).to.equal(1);
  });

  it('Should render a MajorDropdown', async () => {
    returnUser();
    const wrapper = await mount(<EditUserInfo {...defaultProps} />);
    wrapper.update();
    const MajorDropdownArray = wrapper.find(MajorDropdown);
    expect(MajorDropdownArray.length).to.equal(1);
  });

  it('Should render an ExpirationDropdown', async () => {
    returnUser();
    const wrapper = await mount(<EditUserInfo {...defaultProps} />);
    wrapper.update();
    const ExpirationDropdownArray = wrapper.find(ExpirationDropdown);
    expect(ExpirationDropdownArray.length).to.equal(1);
  });

  it('Should render a prompt if no user found', async () => {
    returnNobody();
    const wrapper = await mount(<EditUserInfo {...defaultProps} />);
    wrapper.update();
    const headerArray = wrapper.find('h1');
    expect(headerArray.length).to.equal(1);
    let combinedString = '';
    headerArray.props().children.forEach(child => combinedString += child);
    expect(combinedString).to.equal(
      `User with ID: ${defaultProps.match.params.id} not found!`
    );
  });

});
