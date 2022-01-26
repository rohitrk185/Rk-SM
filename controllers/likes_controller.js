const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async (req, res) => {
    try{
        //url: likes/toggle/?id=id&type=type
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exits
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            user: req.user.id
        });

        //if a like exists then, delete it
        //else create a like
        if(existingLike) {
            //remove from post/comment
            await likeable.likes.pull(existingLike._id);
            await likeable.save();

            //remove from like
            await existingLike.remove();
            deleted = true;
            req.flash('success', `${req.query.type} Unliked!`);
        }else{
            let newLike = await Like.create({
                user: req.user.id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            await likeable.likes.push(newLike._id);
            await likeable.save();
            req.flash('success', `${req.query.type} Liked!`);
        }
        return res.status(200).json({
            message: 'Request Successful!',
            data: {
                deleted: deleted
            },
            flash: {
                'success': req.flash('success'),
                'error': req.flash('error')
            }
         });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            deleted: false
        });
    }
}