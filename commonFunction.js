const mongoose = require('mongoose')
require('dotenv').config()

exports.connectDatabase = () => {
  mongoose.set('strictQuery', true)
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000
  })
}