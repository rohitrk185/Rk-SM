const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user', 'name')
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user',
                    select: 'name'
                },{
                    path: 'likes',
                    select: 'user'
                }
            ]   
        }).populate({
            path: 'likes',
            select: 'user',
        }).lean();

        console.log(posts);

        let user;
        if(req.user) {
            for(let p of posts) {
                p.isLiked = false;
                for(let l of p.likes) {
                    if(req.user.id == l.user) {
                        p.isLiked = true;
                        break;
                    }
                }
                for(let c of p.comments) {
                    c.isLiked = false;
                    for(let l of c.likes) {
                        if(l.user == req.user.id){
                            c.isLiked = true;
                            break;
                        }
                    }
                }
            }
            user = await User.findById(req.user.id).populate('friends','name');
        }
        let users = await User.find({}, 'name');
        req.flash('sucess', "Welcome:)");
        return res.render('home', {
            title: 'SM-Home',
            posts: posts,
            loggedUser: user,
            users: users
        });
    } catch(err) {
        console.log('Error: ', err);
    }
};