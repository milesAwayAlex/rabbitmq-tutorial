const amqp = require('amqplib/callback_api');
const queue = 'work_queue';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log(` [*] Waiting for messages in '${queue}'...`);
    channel.consume(
      queue,
      (msg) => {
        const seconds = msg.content.toString().split('.').length - 1;
        console.log(' [x] Received', msg.content.toString());
        setTimeout(() => {
          console.log(' [x] Done');
        }, seconds * 1000);
      },
      { noAck: false }
    );
  });
});
