function generateResetPasswordTemplate(recipient, resetLink) {
  const subject = 'Password Reset';
  /* eslint-disable */
  const html = `
    <p>A password reset has been triggered. The reset link will expire in 1 hour.<p>
    <a href='${resetLink}'>Reset Password</a>
    <p>Didn't request a password reset? You can ignore this message.</p>
  `;
  /* eslint-enable */

  return {
    from: 'SCE👻',
    to: recipient,
    subject: subject,
    generateTextFromHTML: true,
    html: html
  };
}

module.exports = { generateResetPasswordTemplate };
