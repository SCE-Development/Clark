const eventModalState = {
  SUBMIT: 0,
  EDIT: 1
};

const memberApplicationState = {
  SELECT_MEMBERSHIP_PLAN: 0,
  FORM_INFO: 1,
  CONFIRMATION: 2
};

const membershipPlans = {
  SEMESTER: 1,
  YEAR: 2
};

const itemCategories = {
  DRINK: 'DRINK',
  SNACK: 'SNACK',
  ELECTRONICS: 'ELECTRONICS'
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

const userFilterType = {
  VALID: 0,
  NON_VALID: 1,
  ALL: 2
};

const DEFAULT_PICS = {
  EVENT: 'https://i.gyazo.com/640f22609f95f72a28afa0a130e557a1.png',
  INVENTORY: 'https://user-images.githubusercontent.com/25803515/9' +
    '9110346-1ce92000-259f-11eb-97df-7ed5c2284ef3.png'
};


const BASE_API_URL = process.env.REACT_APP_BASE_API_URL || 'http://localhost:8080/';

module.exports = {
  eventModalState,
  memberApplicationState,
  membershipPlans,
  memberShipPlanToString,
  membershipState,
  membershipStateToString,
  itemCategories,
  userFilterType,
  DEFAULT_PICS,
  BASE_API_URL,
};
