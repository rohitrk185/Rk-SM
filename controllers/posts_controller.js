const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        post = await Post.find({_id: post._id})
        .populate('user', 'name');

        req.flash('success', 'Posted Successfully!');
        if(req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created",
                flash: {
                    'success': req.flash('success'),
                    'error': req.flash('error')
                }
            });
        }

        return res.redirect('back');
    } catch(err) {
        console.log("Error: ", err); return;
    }
};

module.exports.delete = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id) {
            post.remove();
            console.log(`${post} --was deleted`);

            await Comment.deleteMany({post: req.params.id});
            await Like.deleteMany({likeable: post._id, onModel: 'Post'});

            //to delete likes associated to the comments of the post to be deleted
            // await Like.deleteMany({_id: {$in: post.comments}});
            // for(let p of post.likes){
            //     await Like.findByIdAndDelete(p);
            // }

            req.flash('success', 'Post Deleted!');

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post Deleted',
                    flash: {
                        'success': req.flash('success'),
                        'error': req.flash('error')
                    }
                });
            }
        }else {
            req.flash('error', 'Cannot Delete Post!');
        }
        return res.redirect('back');
    } catch(err) {
        console.log(err);
        return;
    }
};