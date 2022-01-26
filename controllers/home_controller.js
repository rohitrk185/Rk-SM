const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {

    try{
        //populate user using reference
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user', 'name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            }
        })
        .populate({
            path: 'likes',
            select: 'user',
            populate: {
                path: 'user',
                select: 'name',
                // match: {_id: req.user._id}
            }
        })
        .lean();

        if(req.user) {
            // console.log('inside');
            for(let p of posts) {
                p.isLiked = false;
                for(let l of p.likes) {
                    if(req.user.id == l.user._id) {
                        p.isLiked = true;
                        break;
                    }
                }
            }
        }

        console.log(posts);
        // console.log(liked);
        // for(let p of posts){
        //     console.log(p.likes);
        // }

        let users = await User.find({}, 'name _id');

        req.flash('sucess', "Welcome:)");
        return res.render('home', {
            title: 'SM-Home',
            posts: posts,
            allUsers: users,
            // liked: liked
        });
    } catch(err) {
        console.log('Error: ', err);
    }
    
    // res.cookie('user_id', 25);
    // console.log(req.cookies);
    // Post.find({}, (err, posts) => {
    //     console.log(posts);
    //     return res.render('home', {
    //         title: 'SM-Home',
    //         posts: posts
    //     });
    // });
};

// let posts = Post.find({}).populate('comments').exec();

// posts.then();