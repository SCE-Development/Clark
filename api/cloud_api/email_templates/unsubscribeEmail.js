function unsubscribeEmail(user, recipient, name) {
  return new Promise((resolve, reject) => {
  const url =
    process.env.VERIFICATION_BASE_URL || 'http://localhost:3000';
  const verifyLink =
    `${url}/emailPreferences?user=${recipient}`;
  return resolve({
    from: user,
    to: recipient,
    subject: 'Unsubscribe from SCE Emails',
    generateTextFromHTML: true,
    html: `
      Hi ${name || ''},<br />
      <p>We appreciate you reducing email spam. 
      To opt out of all our emails, click the link below 
      and we’ll take care of the rest.</p>
      <a href='${verifyLink}'>Update Email Preferences</a>
      <p> Thanks,</p>
      <p>The Software and Computer Engineering Society</p>
    `
    });
  });
}

module.exports = { unsubscribeEmail };