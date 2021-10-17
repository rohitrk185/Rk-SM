module.exports.posts = (req, res) => {
    // res.end('<h1>Welcome to my posts section</h1>');
    return res.render('posts', {
        title: 'Posts Section'
    });
};