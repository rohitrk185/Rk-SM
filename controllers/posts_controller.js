const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.create = async function(req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
    } catch(err) {
        console.log("Error: ", err); return;
    }
    return res.redirect('back');
};

module.exports.delete = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id) {
            post.remove();
            console.log(`${post} --was deleted`);

            await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        }
    } catch(err) {
        console.log(err);
        return;
    }
};