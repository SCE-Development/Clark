const User = require('../models/User');
const config = require('../../config/config.json');

function testPasswordStrength(password) {
  const passwordStrength = config.passwordStrength || 'strong';
  /* eslint-disable */
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  const strongMessage =
    'Invalid password. Requires 1 uppercase, 1 lowercase, 1 number and 1 special character: !@#$%^&'

  const mediumRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')
  const mediumMessage =
    'Password requires one uppercase character and one number.'
  /* eslint-enable */

  // test the password against the strong regex & return true if it passes
  if (passwordStrength === 'strong') {
    return { success: strongRegex.test(password), message: strongMessage };
  }

  // allow unrestricted passwords if strength is set to weak
  if (passwordStrength === 'weak') {
    return { success: true, message: '' };
  }

  // test medium password by default
  return { success: mediumRegex.test(password), message: mediumMessage };
}

function getMemberExpirationDate(numberOfSemestersToSignUpFor) {
  /**
   * we get a int param, which can be 0, 1 or 2
   *  - represents the number of semesters from rn to extend membership
   * we want to return the appropriate date for when a membership expires
   *  - e.g. when numberOfSemestersToSignUpFor semester ends
   *
   * if the param is 0:
   * keep date the same,
   *
   * if the param is 1:
   * return the date of when the next semester ends
   *
   * if the param is 2:
   * return the date of when the semester after the next semester ends
   *
   *
   *
   * Examples:
   * I sign up in June for 1 sem -> December expire
   * I sign up in October for 1 sem -> December expire
   * I sign up in December for 1 sem -> December expire
   * I sign up in March for 1 sem -> May expire
   * I sign up in May for 1 sem -> May expire
   */
  const today = new Date();
  let membershipExpirationDate = new Date();

  const endOfSpringSemThisYear = new Date(today.getFullYear(), 5, 1);
  const endOfSpringSemNextYear = new Date(today.getFullYear() + 1, 5, 1);
  const endOfFallSemThisYear = new Date(today.getFullYear() + 1, 0, 1);

  // first key is number of Semesters to sign up for,
  // nested key checks whether or not it is spring
  let list = {
    0: {
      true: null,
      false: null
    },
    1: {
      true: endOfSpringSemThisYear,
      false: endOfFallSemThisYear
    },
    2: {
      true: endOfFallSemThisYear,
      false: endOfSpringSemNextYear
    }
  };

  let actualMonth = today.getMonth() + 1;
  let springSem = actualMonth >= 1 && actualMonth <= 5;

  return list[numberOfSemestersToSignUpFor][springSem];
}

/**
 * Register a new user.
 * @param {Object} newUser - The user that is to be registered along with
 *                           information about them.
 * @returns {Object} result - Contains three values that inform the requester
 *                            whether or not the request to register was
 *                            successful or not.
 */
async function registerUser(userToAdd) {
  let result = {
    userSaved: true,
    message: '',
    status: 'OK'
  };
  if (userToAdd.email && userToAdd.password) {
    const newUser = new User({
      password: userToAdd.password,
      firstName: userToAdd.firstName,
      middleInitial: userToAdd.middleInitial || '',
      lastName: userToAdd.lastName,
      email: userToAdd.email.toLowerCase(),
      major: userToAdd.major || ''
    });

    const membershipValidUntil = getMemberExpirationDate(
      userToAdd.numberOfSemestersToSignUpFor
    );
    newUser.membershipValidUntil = membershipValidUntil;

    const testPassword = testPasswordStrength(userToAdd.password);

    if (!testPassword.success) {
      result.userSaved = false;
      result.message = testPassword.message;
      result.status = 'BAD_REQUEST';
      return result;
    }

    await newUser.save()
      .catch(_ => {
        result.userSaved = false;
        result.message = 'Username already exists.';
        result.status = 'CONFLICT';
      });
  } else {
    result.userSaved = false;
    result.message = 'Missing email and password.';
    result.status = 'BAD_REQUEST';
  }
  return result;
}


module.exports = { registerUser, getMemberExpirationDate };
