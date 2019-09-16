#!/usr/bin/env npx ts-node

import amqp from "amqplib";

amqp.connect("amqp://localhost").then(connection =>
  connection
    .createChannel()
    .then(channel => {
      const exchange = "topic_logs";
      const args = process.argv.slice(2);
      const key = args.length > 0 ? args[0] : "anonymous.info";
      const msg = args.slice(1).join(" ") || "Hello World!";

      channel.assertExchange(exchange, "topic", {
        durable: false
      });
      channel.publish(exchange, key, Buffer.from(msg));
      return console.log(" [x] Sent %s: '%s'", key, msg);
    })
    .then(() => {
      setTimeout(function() {
        connection.close();
        process.exit(0);
      }, 500);
    })
);
