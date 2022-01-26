const Broker = require("rascal").BrokerAsPromised;
const config = require("../config/definitions.json");

async function rascal_consume() {
  console.log("Consuming");
  const broker = await Broker.create(config);
  broker.on("error", console.error);
  const subscription = await broker.subscribe("time_sub", "b1");
  subscription.on("message", (message, content, ackOrNack) => {
    console.log(`Content is ${content}`);
    ackOrNack();
    //subscription.cancel();
  });
  broker.on("error", console.error);
  subscription.on("error", console.error);
  subscription.on("invalid_content", (err, message, ackOrNack) => {
    console.log("Failed to parse message");
  });
}

rascal_consume().catch(console.error);
