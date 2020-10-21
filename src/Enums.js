const modalStates = {
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
  MEMBER: 1,
  OFFICER: 2,
  ADMIN: 3
};

const membershipStatusArray = [
  'Ban',
  'Pending',
  'Nonmember',
  'Member',
  'Officer',
  'Admin'
];

function membershipStateToString(index) {
  return membershipStatusArray[index + 2];
}

const userFilterType = {
  VALID: 0,
  NON_VALID: 1,
  ALL: 2
};

module.exports = {
  modalStates,
  memberApplicationState,
  membershipPlans,
  memberShipPlanToString,
  membershipState,
  membershipStateToString,
  itemCategories,
  userFilterType
};
