const Post = require('../models/post');

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
    Post.find({}).populate('user').exec(function(err, posts) {
        if(err) {
            console.log(err);
            return;
        }
        // console.log(posts);
        return res.render('home', {
            title: 'SM-Home',
            posts: posts
        });
    });
};

// module.exports.profile = (req, res) => {
//     return res.end('<h1>Welcome to My Profile</h1>');
// };

// module.exports.posts = (req, res) => {
//     return res.end('<h1>Welcome to my posts section.</h1>');
// }; 