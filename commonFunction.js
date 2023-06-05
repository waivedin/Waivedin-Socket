const mongoose = require('mongoose')
require('dotenv').config()
const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY);


exports.connectDatabase = () => {
  mongoose.set('strictQuery', true)
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000
  })
}

exports.getDate = () => {
  return Math.trunc(new Date().getTime() / 1000)
}

exports.sendBasicNotifications = (to, collapse_key, notification, data) => {
  return new Promise((resolve, reject) => {
      try {
          let message = {
            to,
            collapse_key,
            notification,
            data
        }
        console.log("Push notification message:-------",JSON.stringify(message))
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Push notification error message:-------", JSON.stringify(err))
                reject({
                    'message': err
                })
            } else {
              console.log("Push notification sent successfully:-------", JSON.stringify(response))
                resolve({
                    'data': response
                })
            }
        });
} catch (e) {
          console.log("e.........................",e)
          reject({
              message: e.message
          })
      }
  })
}