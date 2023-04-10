const express = require('express')
const app = express()
require('dotenv').config()
const socketLib = require('./socketlib');
const cors = require('cors')
var http = require("http").Server(app);
const commonFunction = require("./commonFunction")

const corsOptions = {
  origin: '*',
  Credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())

commonFunction.connectDatabase()

app.get("/api/waivedin_socket", (req, res) => {
  res.status(200).send("findMeHere ready to start");
});

let server = app.listen(process.env.PORT, (err) => {
  if (err) console.log(`Server connection issue: ${err}`)
  else console.log('Server connected')
})

socketLib.socketIO(server);
socketLib.connection();

module.exports = app