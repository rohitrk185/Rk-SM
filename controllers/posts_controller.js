const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.create = (req, res) => {
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, (err, post) => {
        if(err) { console.log("Error: ", err); return; }
        console.log(post);
        return res.redirect('back');
    });
};

module.exports.delete = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        //req.user.id will giev the._id in string format.
        if(post.user == req.user.id) {
            console.log(`${post} --was deleted`);
            post.remove();
            
            Comment.deleteMany({post: req.params.id}, (err) => {
                if(err) console.log(err);
            });
        }
        return res.redirect('back');
    });
};