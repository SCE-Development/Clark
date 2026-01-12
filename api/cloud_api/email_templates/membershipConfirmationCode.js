function membershipConfirmationCode(user, recipient, confirmCode) {
  if (!confirmCode) {
    throw new Error('Confirmation code is required');
  }

  return {
    from: user,
    to: recipient,
    subject: 'SCE Membership Confirmation',
    generateTextFromHTML: true,
    html: `
             <p>Hi, Thank you for signing up for membership! <br />
              Here is your confirmation code:</p>
             <b>${confirmCode}</b>
      `
  };
}
module.exports = { membershipConfirmationCode };
