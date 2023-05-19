const socket = require('socket.io');
const userModel = require('./model/users');
const messageModel = require('./model/message');
const conversationModel = require('./model/conversation');
const {
    ObjectId
} = require('mongoose').Types


const connection = async (server) => {
    global.io = require('socket.io')(server);
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
                let res = await messageModel.create({
                    conversationId : new ObjectId(data.conversationId),
                    createdBy : new ObjectId(data.from),
                    media_type : data.media_type,
                    text : data.message,
                    mediaURL : data.mediaURL?data.mediaURL:"",
                    createdDate: data.timestamp,
                    modifiedDate: data.timestamp
                })
                await conversationModel.updateOne({_id: new ObjectId(data.conversationId)},{$set:{modifiedDate: data.timestamp}})
                console.log("insert response----only res", res)
                console.log("insert response", res._id)
                let receiver = await userModel.findOne({_id: new ObjectId(data.to),socketId: {$exists: true},socketId:{$ne: ""}},{socketId: 1})
                if(receiver && receiver.socketId && receiver.socketId != ""){
                    io.to(receiver.socketId).emit("receive_message",{msg_id: receiver._id,...data})
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