const amqp = require('amqplib/callback_api');
const args = process.argv.slice(2);
const msg = args.slice(1).join(' ') || 'Hello World!';
const severity = args.length ? args[0] : 'info';
const exchange = 'direct_logs';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    channel.assertExchange(exchange, 'direct', { durable: false });

    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(' [x] Sent', msg);
  });
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 666);
});
