const { connectRabbitMQ, queues } = require("./setup");

async function consume() {
  try {
    const timeChannel = await connectRabbitMQ();

    if (timeChannel) {
      console.log(timeChannel);
      console.log("consuming");
      timeChannel.prefetch(10);
    }
    timeChannel.consume(queues.time_tick, (message) => {
      processTick(timeChannel, message);
    });
  } catch (err) {
    console.log(err);
  }
}

function processTick(timeChannel, message) {
  console.log(JSON.parse(message.content.toString()));
  timeChannel.ack(message);
}

module.exports = consume;
