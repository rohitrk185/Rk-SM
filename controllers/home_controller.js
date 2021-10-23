module.exports.home = (req, res) => {
    console.log(req.cookies);
    res.cookie('user_id', 25);
    return res.render('home', {
        title: 'SM-Home'
    });
    // return res.end('<h1>Express is up for Rk-SM</h1>');
};

// module.exports.profile = (req, res) => {
//     return res.end('<h1>Welcome to My Profile</h1>');
// };

// module.exports.posts = (req, res) => {
//     return res.end('<h1>Welcome to my posts section.</h1>');
// }; 