const socket = require('socket.io');
const userModel = require('./model/users');
const messageModel = require('./model/message');
const conversationModel = require('./model/conversation');
const commentModel = require('./model/comment');
const postModel = require('./model/post');
const notificationModel = require('./model/notification');
const commonFunction = require('./commonFunction');
const UserDetail = require('./model/users');
const {
    ObjectId
} = require('mongoose').Types


const connection = async (server) => {
    io.sockets.on("connection", (socket) => {
        socket.emit("connect_server", {})
        
        socket.on("client_server", async (data) => {
            try {
                console.log("socket.id emitted:", socket.id)
                await userModel.updateOne({
                    _id: new ObjectId(data.user_id)
                }, {
                    $set: {
                        socketId: socket.id
                    }
                }).catch(e => console.log("client server", JSON.stringify(e)))
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("send_message", async (data) => {
            try {
                console.log("send message data:", data)
                data.media_type = data['mediaType'] = data.media_type ? data.media_type : 1
                data.messageDelivered = 0
                let receiver = await userModel.findOne({
                    _id: new ObjectId(data.to)
                }, {
                    socketId: 1,
                    fname: 1,
                    lname: 1,
                    displayName: 1,
                    fcmtoken: 1,
                    gender: 1,
                    profilepic: 1,
                    currentChatUser: 1,
                    devicetype: 1
                })
                let res = await messageModel.create({
                    conversationId: new ObjectId(data.conversationId),
                    createdBy: new ObjectId(data.from),
                    media_type: data.media_type,
                    text: data.message,
                    mediaUrl: data.mediaUrl ? data.mediaUrl : "",
                    thumbNail: data.thumbNail ? data.thumbNail : "",
                    createdDate: data.timestamp,
                    modifiedDate: data.timestamp,
                    isDelivered: data.media_type < 2 ? true : false,
                    messageDelivered: data.messageDelivered,
                    readStatus: data.media_type < 2 && receiver.currentChatUser == data.from ? true : false
                })
                await conversationModel.updateOne({
                    _id: new ObjectId(data.conversationId)
                }, {
                    $set: {
                        modifiedDate: data.timestamp
                    }
                })
                let senderRes = await userModel.findOne({
                    _id: new ObjectId(data.from)
                }, {
                    socketId: 1,
                    fname: 1,
                    lname: 1,
                    displayName: 1,
                    fcmtoken: 1,
                    gender: 1,
                    profilepic: 1,
                    currentChatUser: 1,
                    devicetype: 1
                })
                data["msg_id"] = res._id
                let temp = {
                    allowAnonymous: false,
                    profilePic: `${senderRes.profilepic}`,
                    postId: "",
                    userId: senderRes._id,
                    title: senderRes.displayName,
                    typeOfnotify: "13",
                    message: data.message,
                    threadId: data.conversationId,
                    mediaUrl: data.mediaUrl,
                    media_type: data.media_type,
                    body: data.media_type == 1 ? data.message : data.media_type == 2 ? `📷 Photo` : data.media_type == 3 ? `🎥 Video` : `🎧 Audio`  ,
                    gender: senderRes.gender == "Male" ? 1 : senderRes.gender == "Female" ? 2 : 0,
                    thumbNail: data.thumbNail ? data.thumbNail : "",
                    sound: "notification_sound",
                    image: `https://wavedinblobs.blob.core.windows.net/wavedinblobs/profilepic/${senderRes.profilepic}`
                }
                console.log("data",data)
                console.log("receiver", receiver)
                console.log("senderRes", senderRes)
                if (data.media_type < 2 && receiver && receiver.socketId && receiver.socketId != "") {
                    console.log("send message: --------socket message--------")
                    io.to(receiver.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (data.media_type < 2 && receiver.currentChatUser != data.from) {
                    console.log("send message: --------push notification message--------")
                    await commonFunction.sendBasicNotifications(receiver.fcmtoken, "13", receiver.devicetype == 0 ? {} : temp, temp).catch((e) => console.log('console.log in socket file-----', e))
                }
                if (senderRes && senderRes.socketId && senderRes.socketId != "") {
                    io.to(senderRes.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (senderRes && senderRes.socketId && senderRes.socketId == "") {
                    await commonFunction.sendBasicNotifications(senderRes.fcmtoken, "13", senderRes.devicetype == 0 ? {} : temp, temp).catch((e) => console.log('console.log in socket file-----', e))
                }
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("update_message", async (data) => {
            try {
                data.messageDelivered = 1
                let receiver = await userModel.findOne({
                    _id: new ObjectId(data.to)
                }, {
                    socketId: 1,
                    fname: 1,
                    lname: 1,
                    displayName: 1,
                    fcmtoken: 1,
                    gender: 1,
                    profilepic: 1,
                    currentChatUser: 1,
                    devicetype: 1
                })
                await messageModel.findOneAndUpdate({
                    _id: new ObjectId(data.msg_id)
                }, {
                    $set: {
                        modifiedDate: data.timestamp,
                        mediaUrl: data.mediaUrl,
                        thumbNail: data.thumbNail,
                        text: data.message,
                        isDelivered: true,
                        messageDelivered: data.messageDelivered,
                        readStatus: receiver.currentChatUser == data.from ? true : false
                    }
                })
                let senderRes = await userModel.findOne({
                    _id: new ObjectId(data.from)
                }, {
                    socketId: 1,
                    fname: 1,
                    lname: 1,
                    displayName: 1,
                    fcmtoken: 1,
                    gender: 1,
                    profilepic: 1,
                    currentChatUser: 1,
                    devicetype: 1
                })
                let temp = {
                    allowAnonymous: false,
                    profilePic: `${senderRes.profilepic}`,
                    postId: "",
                    userId: senderRes._id,
                    title: senderRes.displayName,
                    typeOfnotify: "13",
                    message: data.message,
                    threadId: data.conversationId,
                    mediaUrl: data.mediaUrl,
                    media_type: data.media_type,
                    body: data.media_type == 1 ? data.message : data.media_type == 2 ? `📷 Photo` : data.media_type == 3 ? `🎥 Video` : `🎧 Audio`  ,
                    gender: senderRes.gender == "Male" ? 1 : senderRes.gender == "Female" ? 2 : 0,
                    thumbNail: data.thumbNail ? data.thumbNail : "",
                    sound: "notification_sound",
                    image: `https://wavedinblobs.blob.core.windows.net/wavedinblobs/profilepic/${senderRes.profilepic}`,
                }
                console.log("data",data)
                console.log("receiver", receiver)
                console.log("senderRes", senderRes)
                if (receiver && receiver.socketId && receiver.socketId != "") {
                    console.log("socket connection: -----receiver")
                    io.to(receiver.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (receiver.currentChatUser != data.from) {
                    console.log("push notification: -----receiver")
                    await commonFunction.sendBasicNotifications(receiver.fcmtoken, "13", receiver.devicetype == 0 ? {} : temp, temp).catch((e) => console.log('Error push notification for receiver-----', JSON.stringify(e)))
                }
                if (senderRes && senderRes.socketId && senderRes.socketId != "") {
                    io.to(senderRes.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (senderRes && senderRes.socketId && senderRes.socketId == "") {
                    await commonFunction.sendBasicNotifications(senderRes.fcmtoken, "13", senderRes.devicetype == 0 ? {} : temp, temp).catch((e) => console.log('Error push notification for sender-----', JSON.stringify(e)))
                }
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("create_comment", async (data) => {
            try {
                console.log("create comment request body:---", JSON.stringify(data))
                let postId = new ObjectId(data.postId)
                let res = await commentModel.create({
                    postId,
                    createdBy: new ObjectId(data.userId),
                    comment: data.comment,
                    createdDate: commonFunction.getDate(),
                    modifiedDate: commonFunction.getDate()
                })
                let postRes = await postModel.findOneAndUpdate({
                    _id: postId
                }, {
                    $inc: {
                        commentCount: 1
                    }
                })
                let receiverRes = await userModel.findOne({
                    _id: postRes.userId,
                    // socketId: {
                    //     $exists: true
                    // },
                    // socketId: {
                    //     $ne: ""
                    // }
                }, {
                    displayName: 1,
                    profilepic: 1,
                    gender: 1,
                    socketId: 1,
                    fcmtoken: 1
                })
                let senderRes = await userModel.findOne({
                    _id: new ObjectId(data.userId),
                    // socketId: {
                    //     $exists: true
                    // },
                    // socketId: {
                    //     $ne: ""
                    // }
                }, {
                    displayName: 1,
                    profilepic: 1,
                    gender: 1,
                    socketId: 1
                })
                let notificationResponse = await notificationModel.create({
                    userId: senderRes._id,
                    notifyuserId: receiverRes._id,
                    profilePic: senderRes.profilepic,
                    displayName: senderRes.displayName,
                    isRead: false,
                    allowAnonymous: false,
                    postId: data.postId,
                    // threadId: threadId,
                    isAccept: true,
                    gender: senderRes.gender === "Male" ? 1 : (senderRes.gender === "Female") ? 2 : 0,
                    isShowButton: true,
                    typeOfNotify: 14,
                    message: 'have commented on your post',
                    createdDate: commonFunction.getDate(),
                    modifiedDate: commonFunction.getDate()
                });
                console.log("notificationResponse",notificationResponse)
                let result = {
                    postId,
                    msg_id: res._id,
                    from: data.userId,
                    message: data.comment,
                    displayName: senderRes.displayName,
                    profilePic: senderRes.profilepic,
                    gender: senderRes.gender == "Male" ? 1 : senderRes.gender == "Female" ? 2 : 0,
                    timestamp: res.createdDate
                }
                io.sockets.emit("post_receive_message", {
                    ...result
                })
                if (receiverRes && receiverRes.socketId && receiverRes.socketId != "") {
                    console.log("Receiver received")
                    io.to(receiverRes.socketId).emit("post_receive_message", {
                        ...result
                    })
                }
                if (senderRes && senderRes.socketId && senderRes.socketId != "") {
                    console.log("Sender received")
                    io.to(senderRes.socketId).emit("post_receive_message", {
                        ...result
                    })
                }
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("delete_comment", async (data) => {
            try {
                console.log("delete comment request body:---", JSON.stringify(data))
                let commentId = new ObjectId(data.commentId)
                let userId = new ObjectId(data.userId)
                let res = await commentModel.findOneAndDelete({_id: commentId, userId})
                if(res){
                    await postModel.updateOne({_id: res.postId},{$inc: {commentCount: -1}})
                    io.sockets.emit("comment_delete_update_response",{postId: res.postId,commentId,userId})
                }
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("updateCurrentChatUser", async (data) => {
            try {
                console.log("updateCurrentChatUser", JSON.stringify(data))
                let currentChatUser = data.status == true ? data.receiverId : ""
                let res = await userModel.updateOne({_id: new ObjectId(data.userId)},{$set:{currentChatUser}})
            } catch (e) {
                console.log(e)
            }
        });



        socket.on("disconnect_client", async (data) => {
            console.log("Disconnect client method:", JSON.stringify(data))
            await userModel.updateOne({
                _id: new ObjectId(data.user_id)
            }, {
                $set: {
                    socketId: "",
                    currentChatUser: ""
                }
            }).catch(e => console.log("query", e))
        })

        socket.on("disconnect", async (data) => {
            try {
                console.log("Socket disconnected", socket.id)
                await userModel.updateOne({
                    socketId: socket.id
                }, {
                    $set: {
                        socketId: "",
                        currentChatUser: ""
                    }
                }).catch(e => console.log("query", e))    
            } catch (e) {
                console.log(e)
            }
        });
    });
};

const socketIO = (server) => {
    global.io = require("socket.io")(server, {
        cors: {
            origin: '*',
        }
    });
};

const obj = {
    socketIO,
    connection,
};

module.exports = obj;