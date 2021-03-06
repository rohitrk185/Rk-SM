const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
// const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user.id,
                postOwnedUser: post.user
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate({
                path: 'user',
                select: {'name' : 1, '_id': 1}
            });

            // commentsMailer.newComment(comment);
            // let job = queue.create('emails', comment).save(err => {
            //     if(err) { console.log('error in adding to/creating queue', err); return;}
            //     console.log('job enqueued', job.id);
            // });

            req.flash('success', 'Comment was Added!');

            if(req.xhr) {
                console.log(comment);
                return res.status(200).json({
                    data: {
                        comment: comment,
                        postId: req.body.post
                    },
                    message: "Comment Added",
                    flash: {
                        'success': req.flash('success'),
                        'error': req.flash('error')
                    }
                });
            }
            return res.redirect('back');
        }        
    } catch(err) {
        console.log(err); 
        return;
    }
};

module.exports.delete = async function(req,res) {
    try {
        let comment = await Comment.findById(req.params.id);
        if( (req.user.id == comment.user) || (req.user.id == comment.postOwnedUser) ) {

            let postId = comment.post;
            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            
            // for(let p of post.likes){
            //     await Like.findByIdAndDelete(p);
            // }
            for(let c of comment.likes){
                await Like.findByIdAndDelete(c);
            }

            req.flash('success', 'Comment was Deleted!');

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        commentId: req.params.id
                    },
                    message: "Comment Removed",
                    flash: {
                        'success': req.flash('success'),
                        'error': req.flash('error')
                    }
                });
            }
        }
        return res.redirect('back');
    } catch(err) {
        console.log("Error: ", err);
        return;
    }
};