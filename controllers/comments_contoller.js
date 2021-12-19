const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
                postOwnedUser: post.user
            });
            console.log(comment);
            
            post.comments.push(comment);
            post.save();

            res.redirect('/');
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
            console.log(`Comment {${comment.content}} --was deleted`);

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            
            console.log(post);      
        }
        return res.redirect('back');
    } catch(err) {
        console.log("Error: ", err);
        return;
    }
};