module.exports.home = (req, res) => {
    return res.end('<h1>Express is up for Rk-SM</h1>');
};

module.exports.profile = (req, res) => {
    return res.end('<h1>Welcome to My Profile</h1>');
};

module.exports.posts = (req, res) => {
    return res.end('<h1>Welcome to my posts section.</h1>');
}; 