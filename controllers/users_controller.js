const User = require('../models/user');
const Friend = require('../models/friend');
const Token = require('../models/access_token');
const crypto = require('crypto');

const resetTokenMailer = require('../mailers/resetToken_mailer');

const fs = require('fs');
const path = require('path');

module.exports.profile = async (req, res) => {
    // res.end('<h1>Welcome to user Profile</h1>');
    let profile_user;
    if(req.user) {
        profile_user = await User.findById(req.params.id).populate( {path: 'friends' } );
    }else {
        profile_user = await User.findById(req.params.id);
    }
    console.log(profile_user);
    
    res.render('profile', {
        title: 'Profile',
        profile_user: profile_user
    });
};

module.exports.update = async (req, res) => {
    if(req.user.id == req.params.id) {
        // User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        //     return res.redirect('back');
        // });
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, (err) => {
                if(err) { console.log('***Multer Error***', err); }
                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file) {
                    if(user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                return res.redirect('back'); 
            });
        } catch(err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    }else {
        req.flash('error', 'Unauthorized');
        res.status(401).send('Unauthorized');
    }
};

//render sign-up page
module.exports.signUp = (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect(`/users/profile/${req.user.id}`);
    }
    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    })
};


//render sign-in page
module.exports.signIn = (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect(`/users/profile/${req.user.id}`);
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
            console.log('error in finding user while signing-up');
            return; 
        }
        if(!user) {
            User.create(req.body, (err, user) => {
                if(err) {
                    req.flash('error', 'Error in Creating User!');
                    return;
                }
                req.flash('success', "New Account was Successfully Created!");
                console.log(user);       
                return res.redirect('/users/sign-in');
            });
        }else {
            req.flash('error', 'User Already Exists!');
            return res.redirect('back');
        }
    })
}

//get sign-in data and create session for user
module.exports.createSession = (req, res) => {
    req.flash('success', "Logged in Successfully");
    return res.redirect('/');
}

module.exports.destroySession = (req, res) => {
    req.logout();
    req.flash('success', "Logged out Successfully");
    return res.redirect('/');
};

module.exports.createToken = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.r_email});
        // console.log(user);
        let newToken = {
            user: user._id,
            token: Math.ceil(Math.random() * (999999-111111) + 111111),
            isValid: true  
        }
        let token = await Token.create(newToken);
        token = await Token.findOne({_id: token._id}).populate('user', 'email');
        // console.log(token);
        // resetTokenMailer.newResetToken(token);
        return res.redirect(`/users/forgot_password/${token.id}`);
    }catch(err){
        console.log("Error: ", err); return;
    }
    
};

module.exports.checkToken = (req, res) => {
    Token.findById(req.params.id, (err, token) => {
        if(err) {
            return res.redirect('/users/sign-in');
        }
        if(token.isValid) {
            return res.render('reset_password',{
                title: 'Codeial | Reset-Password',
                token: token,
                user: req.user
            });
        }
        return res.redirect('/users/sign-in');
    });
};

module.exports.resetPassword = async (req, res) => {
    let token = await Token.findOne({token: req.body.token_id});
    if(token) {
        if(req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        if(token.isValid) {
            await User.findByIdAndUpdate(token.user, {
                password: req.body.password
            });
            // console.log('changed');
            await Token.findByIdAndUpdate(token._id, {isValid: false});

            req.flash('success', "Successfully Reset Password!");
            token = await Token.findOne({_id: token._id}).populate('user', 'name email');
            // resetTokenMailer.passwordChanged(token.user);
        }
        return res.redirect('/users/sign-in');
    }
    return res.redirect('/users/sign-up');
};