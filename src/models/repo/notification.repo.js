'use strict'

const { Notification } = require('../index')

const createNotification = async ({
    type, from, to, target
}) => {
    return await Notification.create({
        type, from, to, target, status: 0
    })
}

module.exports = {
    createNotification
}