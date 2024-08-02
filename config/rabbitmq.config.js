const dev = `amqp://${process.env.DEV_RMQ_USER}:${process.env.DEV_RMQ_PW}@${process.env.DEV_RMQ_HOST}`

const prod = `amqp://${process.env.PROD_RMQ_USER}:${process.env.PROD_RMQ_PW}@${process.env.PROD_RMQ_HOST}`

const config = {
    dev, prod
}

const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]