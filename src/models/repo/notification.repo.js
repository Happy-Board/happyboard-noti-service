'use strict'

const { Notification } = require('../index')

const createNotification = async ({
    type, from, to, target
}) => {
    const notification = await Notification.create({
        type, from, to, target, status: 0
    })
    return notification
}

module.exports = {
    createNotification
}