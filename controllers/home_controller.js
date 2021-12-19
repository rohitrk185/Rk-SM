const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = (req, res) => {
    // res.cookie('user_id', 25);
    // console.log(req.cookies);
    // Post.find({}, (err, posts) => {
    //     console.log(posts);
    //     return res.render('home', {
    //         title: 'SM-Home',
    //         posts: posts
    //     });
    // });

    //populate user using reference
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts) {
        if(err) {
            console.log(err);
            return;
        }
        User.find({}, (err, users)=> {
        // console.log(posts);
            return res.render('home', {
                title: 'SM-Home',
                posts: posts,
                all_users: users
            });
        });
    });
};

// module.exports.profile = (req, res) => {
//     return res.end('<h1>Welcome to My Profile</h1>');
// };

// module.exports.posts = (req, res) => {
//     return res.end('<h1>Welcome to my posts section.</h1>');
// }; 