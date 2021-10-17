module.exports.profile = (req, res) => {
    // res.end('<h1>Welcome to user Profile</h1>');
    res.render('profile', {
        title: 'Profile'
    });
};