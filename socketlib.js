const socket = require('socket.io');
const userModel = require('./model/users');
const messageModel = require('./model/message');
const conversationModel = require('./model/conversation');
const {
    ObjectId
} = require('mongoose').Types


const connection = async () => {
    io.sockets.on("connection", (socket) => {
        console.log("Socket connected-----socketId-----",socket.id)

        socket.on("client_connect", async (data) => {
            try {
                console.log("client_connect emitted:",JSON.data)
                console.log("socket.id emitted:",socket.id)
                console.log("socket.id emitted:",JSON.stringify(socket))
                await userModel.updateOne({_id: ObjectId(data.user_id)},{$set: {socketId: socket.id}}).catch(e=> console.log("query",e))
            } catch (e) {
                console.log(e)
            }
        });
        socket.on("send_message", async (data) => {
            try {
                let res = await messageModel.insertOne({
                    conversationId : ObjectId(data.conversationId),
                    createdBy : ObjectId(data.from),
                    media_type : data.media_type?data.media_type:0,
                    text : data.text,
                    mediaURL : data.mediaURL?data.mediaURL:"",
                    createdDate: data.timestamp,
                    modifiedDate: data.timestamp
                })
                await conversationModel.updateOne({_id: ObjectId(data.conversationId)},{$set:{modifiedDate: data.timestamp}})
                console.log("insert response----only res", res)
                console.log("insert response", res._id)
                socket.emit("receive_message",{msg_id: res._id,...data});
            } catch (e) {
                console.log(e)
            }
        });

        socket.on("disconnect_client", async(data)=>{
            console.log("Disconnect method:",JSON.stringfy(data))
            await userModel.updateOne({_id: ObjectId(data.user_id)},{$set: {socketId: ""}}).catch(e=> console.log("query",e))
        })

        socket.on("disconnect", async (data) => {
            try {
                console.log("Socket disconnected", JSON.stringify(socket))
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