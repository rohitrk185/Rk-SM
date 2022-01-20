const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'abc@gmail.com',
        to: comment.user.email,
        subject: `Your commented was added successfully!`,
        html: htmlString 
    },(err, info) => {
        if(err){
            console.log('Error in sending mail', err)
            return;
        }
        console.log('Mail Sent Successfully!', info);
    });
};