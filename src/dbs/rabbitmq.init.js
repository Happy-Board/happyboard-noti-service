const amqp = require('amqplib')
const { rabbitmq } = require('../../config/rabbitmq.config')

const getRabbitMQInstance = async () => {
    // const connection = await amqp.connect("amqps://vsdhodqk:hCS5TqgU9PLDub7jVf18NOkQTHegQ_Wk@armadillo.rmq.cloudamqp.com/vsdhodqk")
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