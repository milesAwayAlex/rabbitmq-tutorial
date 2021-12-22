const amqp = require('amqplib/callback_api');
const args = process.argv.slice(2);
const exchange = 'topic_logs';

if (!args.length) {
  console.log('Usage: node topic-subscribe.js <source>.<severity>');
  process.exit(1);
}

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    channel.assertExchange(exchange, 'topic', { durable: false });

    channel.assertQueue('', { exclusive: true }, (error2, q) => {
      if (error2) throw error2;
      console.log(` [*] Waiting for logs..`);

      args.forEach((key) => channel.bindQueue(q.queue, exchange, key));

      channel.consume(
        q.queue,
        (msg) => {
          console.log(' [x]', msg.fields.routingKey, msg.content.toString());
        },
        { noAck: true }
      );
    });
  });
});
