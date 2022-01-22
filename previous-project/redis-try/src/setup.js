const amqp = require("amqplib");
const { BasicPublish } = require("amqplib/lib/defs");
const config = require("./config/rabbit-config");

const queues = {
  time_tick: "time-ticks",
};

const exchanges = {
  time_tick: "time-tick",
};

let connection = null;
let timeChannel = null;

async function connectRabbitMQ(readyFn) {
  try {
    connection = await amqp.connect(
      `amqp://${config.host}:${config.port}?heartbeat=60`
    );
    console.log("connect to RabbitMQ success!");

    // How to reproduce "error" event?
    connection.on("error", function (err) {
      console.log(err);
      setTimeout(connectRabbitMQ, 10000);
    });

    connection.on("close", function () {
      console.log("connection to RabbitQM closed!");
      setTimeout(connectRabbitMQ, 10000);
    });
    timeChannel = await setupTopology();
    readyFn();
  } catch (err) {
    console.error(err);
    setTimeout(connectRabbitMQ, 10000);
  }
}

async function setupTopology() {
  try {
    timeChannel = await connection.createConfirmChannel();
    timeChannel.on("error", () => {
      console.log("Channel error");
      setupTopology();
    });
    timeChannel.on("close", () => {
      console.log("Channel close");
      setupTopology();
    });
    timeChannel.assertExchange(exchanges.time_tick, "fanout", {
      durable: true,
    });
    timeChannel.assertQueue(queues.time_tick, { durable: true });
    timeChannel.bindQueue(queues.time_tick, exchanges.time_tick, "");
    console.log(`AMQP - Connection stablished: ${timeChannel}`);
    return timeChannel;
  } catch (error) {
    console.log(error);
  }
}

async function publish() {}

module.exports = {
  connectRabbitMQ,
  connection,
  timeChannel,
  queues,
  exchanges,
};
