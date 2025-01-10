'use strict'

require('dotenv').config()

const dev = {
    host: process.env.DEV_POSTGRES_HOST || 'localhost',
    username: process.env.DEV_POSTGRES_USER || 'postgres',
    password: process.env.DEV_POSTGRES_PW || 'postgres',
    database: process.env.DEV_POSTGRES_DB || 'postgres',
    port: process.env.DEV_POSTGRES_PORT || 5432,
    dialect: 'postgres',
}

const prod = {
    host: process.env.PROD_POSTGRES_HOST || 'localhost',
    username: process.env.PROD_POSTGRES_USER || 'postgres',
    password: process.env.PROD_POSTGRES_PW || 'postgres',
    database: process.env.PROD_POSTGRES_DB || 'postgres',
    port: process.env.PROD_POSTGRES_PORT || 5432,
    dialect: 'postgres',
}


const config = {
    dev,
    prod
}

let env = process.env.NODE_ENV || 'dev'

module.exports = config[env]
