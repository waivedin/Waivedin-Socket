const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversationId: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    media_type: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0
    },
    text: {
        type: String,
        default: ""
    },
    mediaUrl: {
        type: String,
        default: ""
    },
    thumbNail: {
        type: String,
        default: ""
    },
    createdDate: {
        type: Number
    },
    modifiedDate: {
        type: Number
    },
    isDelivered: {
        type: Boolean,
        default: true
    },
    messageDelivered: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
});


const Message = mongoose.model('messages', MessageSchema);
module.exports = Message;