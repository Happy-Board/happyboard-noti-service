'use strict'

const { Token } = require('../index')

// CREATE
const findTokenDeviceByUserId = async (userId) => {
    const tokens = await Token.findAll({
        where: {
            userId
        },
        attributes: ['deviceToken'],
        raw: true
    })
    return tokens
}


module.exports = {
    findTokenDeviceByUserId
}