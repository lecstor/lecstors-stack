import amqp from "amqp-connection-manager";

const connection = amqp.connect("amqp://rabbitmq");

const EXCHANGE = "default";

// Ask the connection manager for a ChannelWrapper.  Specify a setup function to
// run every time we reconnect to the broker.
const publishChannel = connection.createChannel({
  json: true,
  setup: channel => channel.assertExchange(EXCHANGE, "topic", { durable: true })
});

type PublishArgs = {
  exchange?: string;
  key: string;
  message: Record<string, any>;
};

export async function publish({
  exchange = "default",
  key,
  message
}: PublishArgs) {
  console.log("pubsub: publish %s: '%s'", key, message);
  publishChannel.publish(exchange, key, message).catch(err => {
    console.log("Message was rejected:", err.stack);
    publishChannel.close();
    connection.close();
  });
}

type ListenArgs = {
  exchange?: string;
  keys: string[];
  fn: (message: Record<string, any>) => void;
};

export async function listen({ exchange = "default", keys, fn }: ListenArgs) {
  return connection
    .createChannel({
      setup: channel =>
        // `channel` here is a regular amqplib `ConfirmChannel`.
        Promise.all([
          channel.assertQueue("", { exclusive: true, autoDelete: true }),
          channel.assertExchange(exchange, "topic"),
          channel.prefetch(1),
          ...keys.map(key => channel.bindQueue("", exchange, key)),
          channel.consume(
            "",
            message => {
              const msg = JSON.parse(message.content.toString());
              console.log(
                "pubsub: consume %s:'%s'",
                message.fields.routingKey,
                msg
              );
              fn(msg);
            },
            { noAck: true }
          )
        ])
    })
    .waitForConnect()
    .then(() => console.log("Listening for messages"));
}
