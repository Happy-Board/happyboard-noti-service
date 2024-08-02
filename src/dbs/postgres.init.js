'use strict'

const { Sequelize } = require('sequelize')
const postgres = require('../../config/postgres.config')
const sequelize = new Sequelize(postgres)

async function testConnection() {   
    try {     
        await sequelize.authenticate()
        console.log('\x1b[42m%s\x1b[0m', 'Postgres: Connect succefully')
    } catch (error) {
        console.error('\x1b[41m%s\x1b[0m', 'Unable to connect to the database:', error)
    }
}
testConnection()

module.exports = sequelize