const bcrypt = require('bcrypt');

function validatePassword(password, strength = "medium") {
  // eslint-disable-next-line
  // https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
  // Require at least one digit and one letter
  // eslint-disable-next-line
  const mediumStrength = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!()\-.?[\]_`~;:!@#$%^&*+= ]{8,}$/);
  // Require at least one digit, one common symbol, and one letter
  // eslint-disable-next-line
  const strongStrength = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!()\-.?[\]_`~;:@#$%^&*+=])[A-Za-z\d!()\-.?[\]_`~;:@#$%^&*+= ]{8,}$/);

  const result = {
    success: true,
    message: ''
  }

  if (password.length < 8) {
    result.success = false;
    result.message = "Use 8 characters or more for your password";
    return result;
  }

  switch (strength) {
  case 'strong':
    if (!strongStrength.test(password)) {
      result.success = false;
      result.message = "Try a mix of letters, numbers, and symbols";
    }
    break;
  case 'medium':
    if (!mediumStrength.test(password)) {
      result.success = false;
      result.message = 'Try a mix of letters and numbers';
    }
    break;
  default:
    if (!mediumStrength.test(password)) {
      result.success = false;
      result.message = 'Try a mix of letters and numbers';
    }
  }

  return result;
}

async function hashPassword(password, saltRounds = 10) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

module.exports = { validatePassword, hashPassword };
