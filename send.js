const amqp = require('amqplib/callback_api');
const msg = process.argv[2] || 'Hello World!';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;
    const queue = 'hello';

    channel.assertQueue(queue, { durable: false });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent', msg);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 666);
  });
});
