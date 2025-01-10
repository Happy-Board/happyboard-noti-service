"use strict";

const { getRabbitMQInstance } = require("../dbs/rabbitmq.init");
// const FirebaseService = require('./firebase.service')

class MessageQueue {
  static send = async ({ nameExchange, message }) => {
    try {
      const { connection, channel } = await getRabbitMQInstance();

      await channel.assertExchange(nameExchange, "fanout", {
        durable: false,
        autoDelete: false,
      });

      channel.publish(nameExchange, "", Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      console.log(`[x] ${nameExchange} sent: ${message}`);

      setTimeout(() => {
        connection.close();
      }, 2000);
    } catch (error) {
      console.error(`Error in sendMQ: ${error.message}`);
    }
  };

  static receive = async ({ subscribedExchanges = [] }) => {
    try {
      const { connection, channel } = await getRabbitMQInstance();

      for (let i = 0; i < subscribedExchanges.length; i++) {
        const exchange = subscribedExchanges[i].name;
        if (exchange !== "poll_notifications_ttl") {
          await channel.assertExchange(exchange, "fanout", {
            durable: false,
            autoDelete: true,
          });

          const { queue } = await channel.assertQueue("", {
            exclusive: true,
          });

          console.log(
            `[x] Waiting for messages in ${queue}, ${exchange} To exit press CTRL+C`
          );

          channel.bindQueue(queue, exchange, "");

          await channel.consume(
            queue,
            async (msgBuffer) => {
              // INSTANCE.EXECUTE(MSG)
              const msg = JSON.parse(msgBuffer.content.toString());
              console.log(`[x] Received: `, msg);
              // await FirebaseService.notification(msg)
              await subscribedExchanges[i].cb(msg);
            },
            {
              noAck: true,
            }
          );
        }
      }
    } catch (error) {
      console.error(`Error in receiveMQ: ${error.message}`);
    }
  };

  static setupTTLQueueWithCallback = async ({ subscribedExchanges = [] }) => {
    try {
      const { connection, channel } = await getRabbitMQInstance();

      for (let i = 0; i < subscribedExchanges.length; i++) {
        const exchange = subscribedExchanges[i].name;

        if (exchange === "poll_notification_dlx") {
          // Đảm bảo exchange DLX tồn tại
          await channel.assertExchange(exchange, "fanout", { durable: true });

          // Tạo hàng đợi để nhận thông điệp từ DLX
          const { queue } = await channel.assertQueue("", { exclusive: true });

          console.log(
            `[x] Waiting for messages in ${queue}, ${exchange}. To exit press CTRL+C`
          );

          // Gắn hàng đợi vào DLX
          channel.bindQueue(queue, exchange, "");

          // Lắng nghe thông điệp từ DLX
          await channel.consume(
            queue,
            async (msgBuffer) => {
              try {
                const msg = JSON.parse(msgBuffer.content.toString());
                console.log(`[x] Received from ${exchange}:`, msg);

                // Gọi callback xử lý logic tùy chỉnh
                console.log("[x] Processing expired message...");
                await subscribedExchanges[i].cb(msg);
                console.log("[x] Message processed successfully.");
              } catch (cbError) {
                console.error(
                  "[x] Error while processing message callback:",
                  cbError.message
                );
              }
            },
            { noAck: true }
          );
        }
      }
    } catch (error) {
      console.error(`Error in setupTTLQueueWithCallback: ${error.message}`);
    }
  };

  static setupExchangesAndQueues = async () => {
    try {
      const { channel } = await getRabbitMQInstance();

      const ttlExchange = "poll_notification_ttl";
      const ttlQueue = "poll_notification_ttl_queue";
      const dlxExchange = "poll_notification_dlx";
      const dlxQueue = "poll_notification_dlx_queue";

      // Tạo TTL Exchange và Queue
      await channel.assertExchange(ttlExchange, "fanout", { durable: true });
      await channel.assertQueue(ttlQueue, {
        durable: true,
        arguments: {
          "x-message-ttl": 60000, // TTL mặc định (60 giây)
          "x-dead-letter-exchange": dlxExchange, // Chuyển sang DLX khi hết TTL
        },
      });
      await channel.bindQueue(ttlQueue, ttlExchange, "");

      // Tạo DLX Exchange và Queue
      await channel.assertExchange(dlxExchange, "fanout", { durable: true });
      await channel.assertQueue(dlxQueue, { durable: true });
      await channel.bindQueue(dlxQueue, dlxExchange, "");

      console.log("Exchanges and Queues are set up.");
    } catch (error) {
      console.error("Error in setupExchangesAndQueues:", error.message);
    }
  };
}

module.exports = MessageQueue;
