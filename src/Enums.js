const memberApplicationState = {
  SELECT_MEMBERSHIP_PLAN: 0,
  FORM_INFO: 1,
  CONFIRMATION: 2
};

const membershipPlans = {
  SEMESTER: 1,
  YEAR: 2
};

function memberShipPlanToString(key) {
  const plans = require('./Pages/MembershipApplication/GetPlans');
  let correctPlan = '';
  if (key === membershipPlans.YEAR) {
    correctPlan = plans.getYearPlan();
  } else if (key === membershipPlans.SEMESTER) {
    correctPlan = plans.getSemesterPlan();
  }
  return correctPlan;
}

const membershipState = {
  BANNED: -2,
  PENDING: -1,
  NON_MEMBER: 0,
  ALUMNI: 0.5,
  MEMBER: 1,
  OFFICER: 2,
  ADMIN: 3,
};

const membershipStatusArray = [
  'Ban',
  'Pending',
  'Nonmember',
  'Alumni',
  'Member',
  'Officer',
  'Admin',
];

function membershipStateToString(accessLevel) {
  if (accessLevel === membershipState.ALUMNI)
    return 'Alumni';
  else if (accessLevel > 0)
    return membershipStatusArray[accessLevel + 3];
  return membershipStatusArray[accessLevel + 2];
}

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL || 'http://localhost:8080/';

module.exports = {
  memberApplicationState,
  membershipPlans,
  memberShipPlanToString,
  membershipState,
  membershipStateToString,
  BASE_API_URL,
};
