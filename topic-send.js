const amqp = require('amqplib/callback_api');
const args = process.argv.slice(2);
const key = !!args.length ? args[0] : 'anonymous.info';
const msg = args.slice(1).join(' ') || 'Hello World!.';
const exchange = 'topic_logs';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    channel.assertExchange(exchange, 'topic', { durable: false });

    channel.publish(exchange, key, Buffer.from(msg));
    console.log(` [x] Sent ${key}:`, msg);
  });
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 666);
});
