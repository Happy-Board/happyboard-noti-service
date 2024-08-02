const amqp = require('amqplib')
const { rabbitmq } = require('../../config/rabbitmq.config')

const getRabbitMQInstance = async () => {
    const connection = await amqp.connect()
        
    const channel = await connection.createChannel()

    return {
        connection,
        channel
    }
}

module.exports = {
    getRabbitMQInstance
}