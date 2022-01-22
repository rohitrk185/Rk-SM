const nodeMailer = require('../config/nodemailer');

exports.newResetToken = (token) => {
    nodeMailer.transporter.sendMail({
        from: 'abc@gmail.com',
        to: token.user.email,
        subject: `Request for Reset Password`,
        html: `<p>Your request for password change has been received and use the id: <span style="color:blue;">${token.token}<span> to reset your password.</p>
        <p>If you didn't request a password reset, feel free to delete this mail and continue to enjoy codeial!</p>
        <br>
        <p style="color: #39ff14">Have a nice day,</p>
        <p style="color: #39ff14">The Codeial Team</p>` 
    },(err, info) => {
        if(err){
            console.log('Error in sending mail', err)
            return;
        }
        console.log('Mail Sent Successfully!', info);
    });
};

exports.passwordChanged = (user) => {
    nodeMailer.transporter.sendMail({
        from: 'abc@gmail.com',
        to: user.email,
        subject: `Password Changed Successfully`,
        html: `<p>Your Codeial Account with user name <span style="color: blue; text-decoration: underline;">${user.name}</span>'s password has been changed successfully.</p> 
        <p>If you didn't change it then, you should <span style="color: red; text-decoration: underline;">RESET YOUR PASSWORD</span> by visiting Codeial's Website.</p>
        <br>
        <p style="color: #39ff14">Have a nice day,</p>
        <p style="color: #39ff14">The Codeial Team</p>` 
    },(err, info) => {
        if(err){
            console.log('Error in sending mail', err)
            return;
        }
        console.log('Mail Sent Successfully!', info);
    });
};