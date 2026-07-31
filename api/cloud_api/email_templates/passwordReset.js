const generateHashedId = require('../util/auth').generateHashedId;

function passwordReset(hashedId, user, resetToken, recipient) {
  const url =
    process.env.VERIFICATION_BASE_URL || 'http://localhost:3000';
  const resetLink =
    `${url}/reset?id=${hashedId}&resetToken=${resetToken}`;
  return {
    from: user,
    to: recipient,
    subject: 'Reset Password for SCE',
    generateTextFromHTML: true,
    html: `
      Hi,<br />
      <p>Click the link below to reset your password. It will expire in 24 hours.</p>
      <a href='${resetLink}'>Reset Password</a>
    `
  };
}

module.exports = { passwordReset };
