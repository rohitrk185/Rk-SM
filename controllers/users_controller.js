module.exports.profile = (req, res) => {
    // res.end('<h1>Welcome to user Profile</h1>');
    res.render('profile', {
        title: 'Profile'
    });
};

//render sign-up page
module.exports.signUp = (req, res) => {
    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    })
};


//render sign-in page
module.exports.signIn = (req, res) => {
    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    })
};

//get sign-up data
module.exports.create = (req, res) => {
    //TODO later
}

//get sign-in data and create session for user
module.exports.createSession = (req, res) => {
    //TODO later
}