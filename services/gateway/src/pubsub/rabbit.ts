import amqp from "amqplib";

async function getChannel(exchange) {
  const connection = await amqp.connect("amqp://rabbitmq");
  const channel = await connection.createChannel();
  channel.assertExchange(exchange, "topic", { durable: false });
  return channel;
}

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
  const channel = await getChannel(exchange);
  console.log("pubsub: publish %s: '%s'", key, message);
  channel.publish(exchange, key, Buffer.from(JSON.stringify(message)));
}

type ListenArgs = {
  exchange?: string;
  keys: string[];
  fn: (message: Record<string, any>) => void;
};

export async function listen({ exchange = "default", keys, fn }: ListenArgs) {
  const channel = await getChannel(exchange);

  const q = await channel.assertQueue("", { exclusive: true });

  keys.forEach(key => {
    channel.bindQueue(q.queue, exchange, key);
  });

  channel.consume(
    q.queue,
    message => {
      const msg = JSON.parse(message.content.toString());
      console.log("pubsub: consume %s:'%s'", message.fields.routingKey, msg);
      fn(msg);
    },
    { noAck: true }
  );

  return channel;
}
