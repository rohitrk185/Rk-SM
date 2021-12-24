const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async (req, res) => {
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user', 'name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            }
        });
    return res.status(200).json({
        message: 'List of Posts(v1)',
        posts: posts
    });
}

module.exports.delete = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        // if(post.user == req.user.id) {
        post.remove();
        console.log(`${post} --was deleted`);

        await Comment.deleteMany({post: req.params.id});

        // req.flash('success', 'Post Deleted!');

        // if(req.xhr) {
        //     return res.status(200).json({
        //         data: {
        //             post_id: req.params.id
        //         },
        //         message: 'Post Deleted',
        //         flash: {
        //             'success': req.flash('success'),
        //             'error': req.flash('error')
        //         }
        //     });
        // }
        // return res.redirect('back');
        return res.status(200).json({
            message: 'Post Deleted'
        });
    }
        // else {
        //     req.flash('error', 'Cannot Delete Post!');
        // }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};