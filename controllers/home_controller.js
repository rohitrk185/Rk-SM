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
        });

        // console.log(posts[0].comments[0]);

        let users = await User.find({}, {
            password: 0,
            email: 0,
            createdAt: 0,
            updatedAt: 0,
        });

        req.flash('sucess', "Welcome:)");
        return res.render('home', {
            title: 'SM-Home',
            posts: posts,
            allUsers: users
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