const Friend = require('../models/friend');
const User = require('../models/user');

module.exports.toggleFriend = async (req, res) => {
    try {
        let deleted = false; 
        let friend = await User.findById(req.query.id);
        let user = await User.findById(req.user.id);

        if(friend && user){
            let friendship = await Friend.findOne({user: req.user.id, friend: req.query.id});
            if(friendship) {
                await user.friends.pull(req.query.id);
                await friend.friends.pull(req.user.id);
                await friend.save();
                await user.save();
                await friendship.remove();
                deleted = true;
            }else{
                friendship = await Friend.findOne({user: req.query.id, friend: req.user.id});
                if(friendship){
                    await friend.friends.pull(req.query.id);
                    await user.friends.pull(req.user.id);
                    await friendship.remove();
                    await friend.save();
                    await user.save();
                    deleted = true;
                }
            }
            let flash = {
                success: `${friend.name} has been removed from your friends list!`
            }
            if(!deleted) {
                friendship = await Friend.create({
                    user: req.user.id,
                    friend: req.query.id
                });
                user.friends.push(friend._id);
                friend.friends.push(user._id);
                user.save();
                friend.save();
                console.log(friendship);
                console.log(user, friend);
                flash.success = `${friend.name} is your friend now!`;
            }
            console.log("Friend action complete");
            return res.status(200).json({
                message: 'Request Successfull!',
                data: { deleted: deleted },
                flash: flash             
            });
        }else {
            return res.status(500).json({
                message: "Couldn't find user/friend!",
                data: { deleted: false },
            });    
        }   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            data: { deleted: false }
        });
    }
};