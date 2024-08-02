const dev = `mongodb://${process.env.DEV_MONGO_HOST}:${process.env.DEV_MONGO_PORT}/${process.env.DEV_MONGO_DB}`

const prod = `mongodb://${process.env.PROD_MONGO_HOST}:${process.env.PROD_MONGO_PORT}/${process.env.PROD_MONGO_DB}`

const config = {
    dev, prod
}

const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]