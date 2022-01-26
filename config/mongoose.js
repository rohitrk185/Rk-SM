const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development').catch(err => console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connecting to MongoDB'));

db.once('open', () => {
    console.log('Connected to DB: MongoDB');
});

module.exports = db;