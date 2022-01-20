const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

queue.process('emails', (job, done) => {
    console.log('email-worker is at work!', job.data);

    commentsMailer.newComment(job.data);
     
    done();
});