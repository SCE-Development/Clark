const generateHashedId = require('../util/auth').generateHashedId;

function passwordReset(user, recipient, name) {
  return new Promise((resolve, reject) => {
    return resolve({
      from: user,
      to: recipient,
      subject: 'Reset Password for SCE',
      generateTextFromHTML: true,
      html: `
        <p>Hello</p>
      `
    });
  });
}

module.exports = { passwordReset };
