const port = 8000;

        // requirements  //        
const express = require('express');
//use library for layouts
const expressLayouts = require('express-ejs-layouts');
// use mongo for db
const db = require('./config/mongoose'); 
//cookie-parser
const cookieParser = require('cookie-parser');

// fire up expressn 
const app = express();

//use static files
app.use(express.static('./assets'));
//use express layouts
app.use(expressLayouts);
//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Use urlEncoded
app.use(express.urlencoded());
//use cookieParser
app.use(cookieParser());

//use express router
app.use('/', require('./routes/index'));

//setting up views of the app
app.set('view engine', 'ejs');
app.set('views', './views');


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