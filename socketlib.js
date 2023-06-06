const socket = require('socket.io');
const userModel = require('./model/users');
const messageModel = require('./model/message');
const conversationModel = require('./model/conversation');
const commentModel = require('./model/comment');
const postModel = require('./model/post');
const commonFunction = require('./commonFunction');
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
                console.log("send message data:", JSON.stringify(data))
                data.media_type = data['mediaType'] = data.media_type ? data.media_type : 1
                data.messageDelivered = 0
                let res = await messageModel.create({
                    conversationId: new ObjectId(data.conversationId),
                    createdBy: new ObjectId(data.from),
                    media_type: data.media_type,
                    text: data.message,
                    mediaUrl: data.mediaUrl ? data.mediaUrl : "",
                    thumbNail: data.thumbNail ? data.thumbNail : "",
                    createdDate: data.timestamp,
                    modifiedDate: data.timestamp,
                    isDelivered: data.media_type != 3 ? true : false,
                    messageDelivered: data.messageDelivered
                })
                await conversationModel.updateOne({
                    _id: new ObjectId(data.conversationId)
                }, {
                    $set: {
                        modifiedDate: data.timestamp
                    }
                })
                console.log("send_message:------", JSON.stringify(res))
                let receiver = await userModel.findOne({
                    _id: new ObjectId(data.to)
                }, {
                    socketId: 1,
                    fname: 1,
                    lname: 1,
                    displayName: 1,
                    fcmtoken: 1,
                    gender: 1,
                    profilepic: 1
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
                    profilepic: 1
                })
                data["msg_id"] = res._id
                let temp = {
                    allowAnonymous: false,
                    profilePic: `https://wavedinblobs.blob.core.windows.net/wavedinblobs/profilepic/${senderRes.profilepic}`,
                    postId: "",
                    userId: senderRes._id,
                    title: "",
                    typeOfnotify: "13",
                    message: data.message,
                    threadId: data.conversationId
                }
                if (data.media_type < 2 && receiver && receiver.socketId && receiver.socketId != "") {
                    console.log("send_message: socket------receiver side:------sent successfully", JSON.stringify({
                        ...data
                    }))
                    io.to(receiver.socketId).emit("receive_message", {
                        ...data
                    })
                }
                console.log("receiver:-----", JSON.stringify(receiver))
                console.log("data:-----", JSON.stringify(data))
                console.log("data.media_type < 2",data.media_type < 2)
                console.log("receiver:----",receiver)
                console.log("receiver.socketId",receiver.socketId)
                console.log(`receiver.socketId=="":-----${receiver.socketId==""}`)
                console.log("receiver condition:-----",(data.media_type < 2 && receiver && receiver.socketId && receiver.socketId == "")? true : false)
                if (data.media_type < 2 && receiver && receiver.socketId && receiver.socketId == "") {
                    console.log("send_message: push notification------receiver side:------sent to send basic notification")
                    await commonFunction.sendBasicNotifications(receiver.fcmtoken, "13", temp, temp).catch((e) => console.log('console.log in socket file-----', e))
                }
                if (senderRes && senderRes.socketId && senderRes.socketId != "") {
                    console.log("send_message: socket------sender side:------sent successfully", JSON.stringify({
                        ...data
                    }))
                    io.to(senderRes.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (senderRes && senderRes.socketId && senderRes.socketId == "") {
                    console.log("send_message: push notification------sender side:------sent to send basic notification")
                    await commonFunction.sendBasicNotifications(senderRes.fcmtoken, "13", temp, temp).catch((e) => console.log('console.log in socket file-----', e))
                }
                console.log("")
                console.log("")
                console.log("")
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("update_message", async (data) => {
            try {
                data.messageDelivered = 1
                await messageModel.findOneAndUpdate({
                    _id: new ObjectId(data.msg_id)
                }, {
                    $set: {
                        modifiedDate: data.timestamp,
                        mediaUrl: data.mediaUrl,
                        thumbNail: data.thumbNail,
                        text: data.message,
                        isDelivered: true,
                        messageDelivered: data.messageDelivered
                    }
                })
                let receiver = await userModel.findOne({
                    _id: new ObjectId(data.to)
                }, {
                    socketId: 1,
                    fname: 1,
                    lname: 1,
                    displayName: 1,
                    fcmtoken: 1,
                    gender: 1,
                    profilepic: 1
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
                    profilepic: 1
                })
                let temp = {
                    allowAnonymous: false,
                    profilePic: `https://wavedinblobs.blob.core.windows.net/wavedinblobs/profilepic/${senderRes.profilepic}`,
                    postId: "",
                    userId: senderRes._id,
                    title: "",
                    typeOfnotify: "13",
                    message: data.message,
                    threadId: data.conversationId
                }
                console.log("receiver:-----", JSON.stringify(receiver))
                console.log("data:-----", JSON.stringify(data))
                console.log("data.media_type < 2",data.media_type < 2)
                console.log("receiver:----",receiver)
                console.log("receiver.socketId",receiver.socketId)
                console.log(`receiver.socketId=="":-----${receiver.socketId==""}`)
                console.log("receiver condition:-----",(data.media_type < 2 && receiver && receiver.socketId && receiver.socketId == "")? true : false)
                if (receiver && receiver.socketId && receiver.socketId != "") {
                    console.log("update_message: socket------receiver side:------sent successfully", JSON.stringify({
                        ...data
                    }))
                    io.to(receiver.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (receiver && receiver.socketId && receiver.socketId == "") {
                    console.log("update_message: push notification------receiver side:------sent to send basic notification")
                    await commonFunction.sendBasicNotifications(receiver.fcmtoken, "13", temp, temp).catch((e) => console.log('Error push notification for receiver-----', JSON.stringify(e)))
                }
                if (senderRes && senderRes.socketId && senderRes.socketId != "") {
                    console.log("update_message: socket------sender side:------sent successfully", JSON.stringify({
                        ...data
                    }))
                    io.to(senderRes.socketId).emit("receive_message", {
                        ...data
                    })
                }
                if (senderRes && senderRes.socketId && senderRes.socketId == "") {
                    console.log("update_message: push notification------sender side:------sent to send basic notification")
                    await commonFunction.sendBasicNotifications(senderRes.fcmtoken, "13", temp, temp).catch((e) => console.log('Error push notification for sender-----', JSON.stringify(e)))
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
                    socketId: {
                        $exists: true
                    },
                    socketId: {
                        $ne: ""
                    }
                }, {
                    displayName: 1,
                    profilepic: 1,
                    gender: 1,
                    socketId: 1,
                    fcmtoken: 1
                })
                let senderRes = await userModel.findOne({
                    _id: new ObjectId(data.userId),
                    socketId: {
                        $exists: true
                    },
                    socketId: {
                        $ne: ""
                    }
                }, {
                    displayName: 1,
                    profilepic: 1,
                    gender: 1,
                    socketId: 1
                })
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
                console.log("senderRes", senderRes)
                if (senderRes && senderRes.socketId && senderRes.socketId != "") {
                    console.log("Sender received")
                    io.to(senderRes.socketId).emit("post_receive_message", {
                        ...result
                    })
                }
                console.log("")
                console.log("")
                console.log("")
            } catch (e) {
                console.log(e)
            }
        });



        socket.on("disconnect_client", async (data) => {
            console.log("Disconnect method:", JSON.stringify(data))
            await userModel.updateOne({
                _id: new ObjectId(data.user_id)
            }, {
                $set: {
                    socketId: ""
                }
            }).catch(e => console.log("query", e))
        })

        socket.on("disconnect", async (data) => {
            try {
                console.log("Socket disconnected", socket.id)
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