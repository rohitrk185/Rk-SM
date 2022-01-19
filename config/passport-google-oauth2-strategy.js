const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');


passport.use(new googleStrategy({
    clientID: "294635428847-5tnhgho2vlabr8isah80gcl6ev15t81s.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
    }, function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err) {
                console.log('error in google strategy-passport', err);
                return;
            }
            console.log(profile);
            if(user) {
                return done(null, user);
            }else {
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err, user){
                    if(err) {
                        console.log('error in creating google strategy-passport', err);
                        return;
                    }
                    return done(null, user);
                });
            }            
        })
    }
));

module.exports = passport;