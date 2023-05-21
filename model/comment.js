const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Post"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "UserDetails"
    },
    comment: {
        type: String
    },
    createdDate: {
        type: Number
    },
    modifiedDate: {
        type: Number
    },
});


const Comment = mongoose.model('comments', CommentSchema);
module.exports = Comment;