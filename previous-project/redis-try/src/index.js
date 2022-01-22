const consume = require("./consumer");
const { produce } = require("./producer");
const { connectRabbitMQ } = require("./setup");

try {
  connectRabbitMQbitMQ(() => {
    produce();
    consume();
  });
} catch (error) {
  console.log(error);
}
