const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserConversationSchema = new Schema({
    conversationId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "UserConversations"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "UserDetails"
    },
    media_type: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    text: {
        type: String,
        default: ""
    },
    mediaURL: {
        type: String,
        default: ""
    },
    createdDate: {
        type: Number
    },
    modifiedDate: {
        type: Number
    }
});


const UserConversation = mongoose.model('userconversations', UserConversationSchema);
module.exports = UserConversation;