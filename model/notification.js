const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({ 
    userId: { type: mongoose.Types.ObjectId, require: true},
    notifyuserId: { type: mongoose.Types.ObjectId, require: true},
    displayName: { type: String },    
    profilePic: { type: String },    
    message: { type: String }, 
    isRead: { type: Boolean }, 
    postId: { type: mongoose.Types.ObjectId }, 
    threadId: { type: mongoose.Types.ObjectId}, 
    typeOfNotify: { type: Number }, 
    isAccept: { type: Boolean }, 
    sparkNotifyId: { type: String }, 
    gender: { type: Number }, 
    isShowButton: { type: Boolean },     
    createdDate:{ type:Number },
    allowAnonymous: { type: Boolean },
    modifiedDate:{ type:Number },
});

const Notification = mongoose.model('notifications', NotificationSchema);
module.exports = Notification;