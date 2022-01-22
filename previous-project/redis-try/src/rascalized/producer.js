const Broker = require("rascal").BrokerAsPromised;
const config = require("./definitions.json");

async function rascal_produce() {
  console.log("Publishing");
  var msg = "Hello World!";
  const broker = await Broker.create(config);
  broker.on("error", console.error);
  setInterval(async () => {
    const publication = await broker.publish("time_pub", msg);
    publication.on("error", console.error);
    console.log("Published");
  }, 1000);
}

rascal_produce().catch(console.error);
