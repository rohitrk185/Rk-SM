const mongoose = require('mongoose');

const access_tokenSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true        
    },
    isValid: {
        type: Boolean,
        default: true,
        required: true
    },
}, {
    timestamps: true
});

const AccessToken = mongoose.model('AccessToken', access_tokenSchema);
module.exports = AccessToken;