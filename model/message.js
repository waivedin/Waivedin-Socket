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
        enum: [ 0, 1, 2, 3, 4, 5],
        default: 0
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


const Message = mongoose.model('messages', MessageSchema);
module.exports = Message;