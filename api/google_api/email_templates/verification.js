const generateHashedId = require('../util/auth').generateHashedId;

function verification(user, recipient, name) {
  return new Promise((resolve, reject) => {
    generateHashedId(recipient)
      .then(hashedId => {
        const verifyLink =
          `https://sce.engr.sjsu.edu/verify?id=${hashedId}&user=${recipient}`;
        return resolve({
          from: user,
          to: recipient,
          subject: 'Please verify your email address',
          generateTextFromHTML: true,
          html: `
            Hi ${name || ''},<br />
            <p>Thanks for signing up!
            Please verify your email by clicking below.</p>
            <a href='${verifyLink}'>Verify Email</a>
          `
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { verification };
