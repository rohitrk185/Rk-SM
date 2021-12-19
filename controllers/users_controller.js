const User = require('../models/user');

module.exports.profile = (req, res) => {
    // res.end('<h1>Welcome to user Profile</h1>');
    User.findById(req.params.id, (err, user)=> {
        res.render('profile', {
            title: 'Profile',
            profile_user: user
        });
    });
};

//render sign-up page
module.exports.signUp = (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    })
};


//render sign-in page
module.exports.signIn = (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    })
};

//get sign-up data
module.exports.create = (req, res) => {
    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            console.log('error in finding user in signing-up');
            return; 
        }
        if(!user) {
            User.create(req.body, (err, user) => {
                if(err) {
                    console.log('error in creating user while signing-up');
                    return; 
                }
                console.log(user);       
                return res.redirect('/users/sign-in');
            });
        }else {
            return res.redirect('back');
        }
    })
}

//get sign-in data and create session for user
module.exports.createSession = (req, res) => {
    return res.redirect('/');
}

module.exports.destroySession = (req, res) => {
    req.logout();
    return res.redirect('/');  
};