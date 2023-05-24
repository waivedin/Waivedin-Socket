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
        console.log("Socket connected-----socketId-----",socket.id)
        socket.emit("connect_server",{})
        
        socket.on("client_server", async (data) => {
            try {
                console.log("client_connect emitted:",JSON.stringify(data))
                console.log("socket.id emitted:",socket)
                console.log("socket.id emitted:",socket.id)
                await userModel.updateOne({_id: new ObjectId(data.user_id)},{$set: {socketId: socket.id}}).catch(e=> console.log("query",e))
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("send_message", async (data) => {
            try {
                console.log("send message data:", JSON.stringify(data))
                data.media_type = data['mediaType'] = data.media_type ? data.media_type : 0
                data.messageDelivered = 0
                let res = await messageModel.create({
                    conversationId : new ObjectId(data.conversationId),
                    createdBy : new ObjectId(data.from),
                    media_type : data.media_type,
                    text : data.message,
                    mediaUrl : data.mediaUrl?data.mediaUrl:"",
                    thumbNail : data.thumbNail?data.thumbNail:"",
                    createdDate: data.timestamp,
                    modifiedDate: data.timestamp,
                    isDelivered: data.media_type != 3 ? true : false,
                    messageDelivered: data.messageDelivered
                })
                await conversationModel.updateOne({_id: new ObjectId(data.conversationId)},{$set:{modifiedDate: data.timestamp}})
                console.log("insert response----only res", res)
                console.log("insert response", res._id)
                let receiver = await userModel.findOne({_id: new ObjectId(data.to),socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                let senderRes = await userModel.findOne({_id: new ObjectId(data.from),socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                if(data.media_type  < 2 && receiver && receiver.socketId && receiver.socketId != ""){
                    console.log("Receiver received")
                    console.log("receive_message data:", JSON.stringify({msg_id: res._id,...data}))
                    io.to(receiver.socketId).emit("receive_message",{msg_id: res._id,...data})
                }
                if(senderRes && senderRes.socketId && senderRes.socketId != ""){
                    console.log("Sender received")
                    console.log("Sender received data:", JSON.stringify({msg_id: res._id,...data}))
                    io.to(senderRes.socketId).emit("receive_message",{msg_id: res._id,...data})
                }
            } catch (e) {
                console.log(e)
            }
        });
        
        socket.on("update_message", async (data) => {
            try {
                data.messageDelivered = 1
                console.log("update_message data:", JSON.stringify(data))
                await messageModel.findOneAndUpdate({_id: new ObjectId(data.msg_id)},{$set:{modifiedDate: data.timestamp, mediaUrl: data.mediaUrl,thumbNail: data.thumbNail, text: data.message, isDelivered: true, messageDelivered: data.messageDelivered}})
                let receiver = await userModel.findOne({_id: new ObjectId(data.to),socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                let senderRes = await userModel.findOne({_id: new ObjectId(data.from),socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                if(receiver && receiver.socketId && receiver.socketId != ""){
                    console.log("Receiver received")
                    console.log("receive_message data:", JSON.stringify({...data}))
                    io.to(receiver.socketId).emit("receive_message",{...data})
                }
                if(senderRes && senderRes.socketId && senderRes.socketId != ""){
                    console.log("Sender received")
                    console.log("Sender received data:", JSON.stringify({...data}))
                    io.to(senderRes.socketId).emit("receive_message",{...data})
                }
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("create_comment", async (data) => {
            try {
                console.log("create comment request body:---",JSON.stringify(data))
                let postId = new ObjectId(data.postId)
                let res = await commentModel.create({
                    postId,
                    createdBy : new ObjectId(data.userId),
                    comment : data.comment,
                    createdDate: commonFunction.getDate(),
                    modifiedDate: commonFunction.getDate()
                })
                let postRes = await postModel.findOneAndUpdate({_id: postId}, {$inc:{commentCount: 1}})
                let receiverRes = await userModel.findOne({_id: postRes.createdBy,socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                let senderRes = await userModel.findOne({_id: new ObjectId(data.userId),socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                console.log("insert response----only res", res)
                console.log("insert response", res._id)
                if(receiverRes && receiverRes.socketId && receiverRes.socketId != ""){
                    console.log("Receiver received")
                    io.to(receiverRes.socketId).emit("receive_message",{commentId: res._id,...data})
                }
                if(senderRes && senderRes.socketId && senderRes.socketId != ""){
                    console.log("Sender received")
                    io.to(senderRes.socketId).emit("receive_message",{commentId: res._id,...data})
                }
            } catch (e) {
                console.log(e)
            }
        });



        socket.on("disconnect_client", async(data)=>{
            console.log("Disconnect method:",JSON.stringify(data))
            await userModel.updateOne({_id: new ObjectId(data.user_id)},{$set: {socketId: ""}}).catch(e=> console.log("query",e))
        })

        socket.on("disconnect", async (data) => {
            try {
                console.log("Socket disconnected", socket)
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