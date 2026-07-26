const generateHashedId = require('../util/auth').generateHashedId;

function verification(hashedId, user, recipient, name) {
  const url =
      process.env.VERIFICATION_BASE_URL || 'http://localhost:3000';
  const verifyLink =
      `${url}/verify?id=${hashedId}&user=${recipient}`;
  return {
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
  };
}

module.exports = { verification };
