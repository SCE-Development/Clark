module.exports = function(user, recipient, name) {
  return {
    from: user,
    to: recipient,
    subject: 'This is a test email',
    generateTextFromHTML: true,
    html: `
      Hi ${name},<br />
      <p>This is a friendly test.</p>
    `
  };
};
