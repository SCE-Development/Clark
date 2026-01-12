function membershipConfirmationCode(user, recipient, confirmCode) {
  return new Promise((resolve, reject) => {
    return resolve({
      from: user,
      to: recipient,
      subject: 'SCE Membership Confirmation',
      generateTextFromHTML: true,
      html: `
            <p>>Hi,</p><br/>
            <p>
              Thank you for signing up for membership! <br />
              Please use the below confirmation code when you
              visit your profile page on the
              SCE website to verify your membership: <br /> <b>${confirmCode}</b>
            </p>
      `
    });
  });
}
module.exports = { membershipConfirmationCode };
