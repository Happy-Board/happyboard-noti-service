const express = require("express");

require("dotenv").config();
const MessageQueue = require("./services/rabbitmq.service");
const FirebaseService = require("./services/firebase.service");

const app = express();

// INIT DBS
require("./dbs/firebase.init");
// require('./dbs/mongo.init')
require("./dbs/postgres.init");
require("./dbs/rabbitmq.init");

MessageQueue.receive({
  subscribedExchanges: [
    {
      name: "post_notification",
      cb: FirebaseService.notification,
    },
  ],
});

MessageQueue.receive({
  subscribedExchanges: [
    {
      name: "poll_notification",
      cb: FirebaseService.notificationToGroup,
    },
  ],
});

MessageQueue.setupTTLQueueWithCallback({
  subscribedExchanges: [
    {
      name: "poll_notification_dlx",
      cb: FirebaseService.notificationToGroup,
    },
  ],
});

MessageQueue.setupExchangesAndQueues();

module.exports = app;
