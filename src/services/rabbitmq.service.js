'use strict'

const { getRabbitMQInstance } = require('../dbs/rabbitmq.init')
// const FirebaseService = require('./firebase.service')

class MessageQueue {
    static send = async ({ nameExchange, message }) => {
        try {
            const { connection, channel } = await getRabbitMQInstance()
    
            await channel.assertExchange(nameExchange, 'fanout', {
                durable: false,
                autoDelete: true
            })
    
            channel.publish(nameExchange, '', Buffer.from(JSON.stringify(message)))
    
            console.log(`[x] ${nameExchange} sent: ${message}`)
    
            setTimeout(() => {
                connection.close()
            }, 2000)
        } catch (error) {
            console.error(`Error in sendMQ: ${error.message}`)
        }
    }

    static receive = async ({ subscribedExchanges = [] }) => {
        try {
            const { connection, channel } = await getRabbitMQInstance()
    
            for (let i = 0; i < subscribedExchanges.length; i++) {
                const exchange = subscribedExchanges[i].name
                
                await channel.assertExchange(exchange, 'fanout', {
                    durable: false,
                    autoDelete: true
                })
    
                const { queue } = await channel.assertQueue('', {
                    exclusive: true
                })
    
                console.log(`[x] Waiting for messages in ${queue}. To exit press CTRL+C`)
    
                channel.bindQueue(queue, exchange, '')
    
                await channel.consume(queue, async msgBuffer => {
                    // INSTANCE.EXECUTE(MSG)
                    const msg = JSON.parse(msgBuffer.content.toString())
                    console.log(`[x] Received: `, msg)
                    // await FirebaseService.notification(msg)
                    await subscribedExchanges[i].cb(msg)
                }, {
                    noAck: true
                })
            }
        } catch (error) {
            console.error(`Error in receiveMQ: ${error.message}`)
        }
    }
}

module.exports = MessageQueue