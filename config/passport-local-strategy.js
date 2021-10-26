const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    (email, password, done) => {
        //find a user and establish identity
        User.findOne({email: email}, (err, user) => {
            if(err) { console.log('Error in finding user(passport Js)'); return done(err)};
            if(!user || user.password != password) {
                console.log('Invalid Password');
                return done(null, /*authentication done is false*/false);
            }
            return done(null, user);
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies.
passport.serializeUser((user, done) => {
    done(null, user.id);
});


// de-serializing the user from the key in the cookies.
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if(err) { console.log('Error in finding user(passport Js)'); return done(err)};
        return done(null, user);
    });
});


//check if user is authenticated
passport.checkAuthentication = (req, res, next) => {
    // if user signed in
    if(req.isAuthenticated()) {
        return next();
    }

    // if not signed in
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated()) {
        //req.user containes the current signed-in user from the session
        // cookie and send this to req.locals
        res.locals.user = req.user;
    }
    next();
};


module.exports = passport;