var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nfb@nicolebruno.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

var mailOptions = {
  from: 'nfb@nicolebruno.com',
  to: 'nfb@nicolebruno.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
