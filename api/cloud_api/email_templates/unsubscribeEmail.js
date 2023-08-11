function unsubscribe(user, recipient, name) {
  return new Promise((resolve, reject) => {
    const url =
      process.env.PUBLIC_URL || 'http://localhost:3000';
    const unsubcribeLink = `${url}/emailpreferences?user=${recipient}`;
    return resolve({
      from: user,
      to: recipient,
      subject: 'Unsubscribe from SCE Emails',
      generateTextFromHTML: true,
      html: `
        Hi ${name || ''},<br />
        <p>We appreciate you reducing email spam. 
        
        To opt out of all our emails, click the link below and we’ll take care of the rest.</p>
        <p><a href='${unsubcribeLink}'>Unsubscribe from Emails</a></p>

        Thanks,<br />
        The Software and Computer Engineering Society `
    });
  })
  .catch(error => {
    reject(error);
  });
}

module.exports = { unsubscribe };
