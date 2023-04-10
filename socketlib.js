const socket = require('socket.io');
const events = require('events');
const {
    ObjectId
} = require('mongoose').Types


const connection = async () => {

    io.sockets.on("connection", (socket) => {
        console.log("Socket connected")

        socket.on("disconnect", async (data) => {
            try {
                console.log("Socket disconnected")
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