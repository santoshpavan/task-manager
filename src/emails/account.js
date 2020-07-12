const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vpisapa@ncsu.edu',
        subject: 'Welcome!',
        text: `Welcome ${name}!\n Thanks for joining us!`
    });
}

const byeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vpisapa@ncsu.edu',
        subject: 'Goodbye!',
        text: `${name}, sorry to see you go. Please tell us what could we have done better.`
    });
}

module.exports = {
    sendWelcomeEmail,
    byeEmail
}