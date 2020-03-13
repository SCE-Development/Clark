const membershipState = require('../../src/Enums').membershipState;

module.exports = [
  {
    firstName: 'Joe',
    lastName: 'Doe',
    joinDate: Date.now,
    password: 'pass',
    email: 'jdoe@abc.com',
    major: 'Computer Science',
    doorCode: '065-0715',
    accessLevel: membershipState.ADMIN
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    joinDate: Date.now,
    password: 'pass',
    email: 'jsmith@abc.com',
    major: 'Software Engineering',
    doorCode: '236-2368',
    accessLevel: membershipState.OFFICER
  },
  {
    firstName: 'JJ',
    lastName: 'Dirte',
    joinDate: Date.now,
    password: 'pass',
    email: 'jdirte@abc.com',
    major: 'Computer Engineering',
    doorCode: '098-2356',
    accessLevel: membershipState.MEMBER
  }
];
