const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = (req, res) => {
    Post.findById(req.body.post, (err, post) => {
        if(post) {
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
                postOwnedUser: post.user
            }, (err, comment) => {
                if(err) {console.log(err); return;}

                console.log(comment);

                post.comments.push(comment);
                post.save();
            });

            res.redirect('/');
        }
    });
};

module.exports.delete = (req,res) => {
    
    Comment.findById(req.params.id, (err, comment) => {
        if(err) {console.log(err); return;}

        if( (req.user.id == comment.user) || (req.user.id == comment.postOwnedUser) ) {
            console.log(`Comment {${comment.content}} --was deleted`);

            let postId = comment.post;

            comment.remove();
            
            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, (err, post)=> {
                if(err) console.log(err);
                console.log(post);      
            });
        }
        
        return res.redirect('back');
    });

};

