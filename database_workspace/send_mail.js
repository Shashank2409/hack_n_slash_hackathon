var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//         auth: {
//             user: 'hacknslash0211@gmail.com',
//             pass: 'Abcd1234@',
//         },
// });.

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user : "hacknslash0211@gmail.com",
        password : "Abcd1234@" 
    }
});


var mailOptions = {
    from: 'hacknslash0211@gmail.com', 
    to: 'shashankgupta588@gmail.com',        
    subject: 'Test Notification', 
    text: 'Hi,\nWe are Count on Me.\nIf you\'re getting this E-Mail, consider yourself as lucky. :)'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log("Error->",error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});