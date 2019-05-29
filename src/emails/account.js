const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'hello@lisanguyen.me',
    subject: 'Welcome onboard',
    text: `Hi ${name}, welcome to Taskr.`
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'hello@lisanguyen.me',
    subject: 'Sorry to see you go',
    text: `Hi ${name}, so sorry to see you go. Is there anything we could have done better?`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
