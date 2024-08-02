'use strict'

const { createNotification } = require("../models/repo/notification.repo")

class NotificationService {
    static createNotification = async ({ type, from, to, target }) => {
        await createNotification({ type, from, to, target })
    }
}

module.exports = NotificationService