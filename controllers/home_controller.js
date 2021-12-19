const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {

    try{
        //populate user using reference
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let users = await User.find({});

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

let posts = Post.find({}).populate('comments').exec();

posts.then();