function blastEmail(user, recipient, subject, content) {
  return new Promise((resolve, reject) => {
    const sender = `"SCE SJSU 👻" <${user}>`;
    return resolve({
      from: sender,
      to: recipient,
      subject: subject,
      generateTextFromHTML: true,
      html: `
           ${content}
          `,
    });
  });
}

module.exports = { blastEmail };
