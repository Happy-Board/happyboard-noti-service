'use strict'

require('dotenv').config()

const dev = {
    host: process.env.DEV_POSTGRES_HOST || 'localhost',
    username: process.env.DEV_POSTGRES_USER || 'postgres',
    password: process.env.DEV_POSTGRES_PW || 'rootpass',
    database: process.env.DEV_POSTGRES_DB || 'hb',
    port: process.env.DEV_POSTGRES_PORT || '5455',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
}

const prod = {
    host: process.env.PROD_POSTGRES_HOST || 'db-postgresql-sgp1-58474-do-user-15759758-0.f.db.ondigitalocean.com',
    username: process.env.PROD_POSTGRES_USER || 'doadmin',
    password: process.env.PROD_POSTGRES_PW || 'AVNS_b59T6z0uB8jwksrGte9',
    database: process.env.PROD_POSTGRES_DB || 'defaultdb',
    port: process.env.PROD_POSTGRES_PORT || '25060',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
}


const config = {
    dev,
    prod
}

let env = process.env.NODE_ENV || 'dev'

module.exports = config[env]
