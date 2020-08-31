function doorCodeEmail(user, recipient, name, doorCode) {
  return new Promise((resolve, reject) => {
    return resolve({
      from: user,
      to: recipient,
      subject: 'SCE Door Code',
      generateTextFromHTML: true,
      html: `
      Hi ${name || ''},<br />
      <p>Thanks for registering for a door code!
      Your assigned door code is listed below.
      ${doorCode || ''}</p>
      `
    });
  });
}

module.exports = { doorCodeEmail };
