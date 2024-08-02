const express = require('express')

require('dotenv').config()
const MessageQueue = require('./services/rabbitmq.service')
const FirebaseService = require('./services/firebase.service')

const app = express()

// INIT DBS
require('./dbs/firebase.init')
// require('./dbs/mongo.init')
require('./dbs/postgres.init')

MessageQueue.receive({
    subscribedExchanges: [
        {
            name: 'post_notification',
            cb: FirebaseService.notification
        }
    ]
})

module.exports = app