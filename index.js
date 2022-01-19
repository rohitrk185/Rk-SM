const port = 8000;

        // requirements  //
const path = require('path');        
const express = require('express');
//cookie-parser
const cookieParser = require('cookie-parser');
// fire up expressn 
const app = express();
//use library for layouts
const expressLayouts = require('express-ejs-layouts');
// use mongo for db
const db = require('./config/mongoose'); 
//express-session
const session = require('express-session');
// passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');//(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMWare = require('./config/middleware');


app.use(sassMiddleware({
    src: path.join(__dirname, 'assets/scss'),
    dest: path.join(__dirname, 'assets/css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));



//Use urlEncoded
app.use(express.urlencoded());
//use cookieParser
app.use(cookieParser());

//use static files
app.use(express.static('./assets'));

//make the uploads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//use express layouts
app.use(expressLayouts);
//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setting up views of the app
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }, 
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codeial_development',
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        (err) => {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMWare.setFlash);

//use express router
app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if(err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server running on port: ${port}`);
});


//{
// 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 -pat
// vscode://vscode.github-authentication/did-authenticate?windowid=1&code=348ee6e331c90d4342ae&state=bdf5e338-80ed-4284-acf5-3757741ca709
//}