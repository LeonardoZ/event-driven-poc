const Broker = require('rascal').BrokerAsPromised;
const config = require('../config/definitions.json');

async function init() {
  try {
    const broker = await Broker.create(config);
    broker.on('error', console.error);
    const subscription = await broker.subscribe('events_teams_subs', 'b1');
    subscription.on('error', console.error);
    subscription.on('invalid_content', (err, message, ackOrNack) => {
      console.log('Failed to parse message');
    });

    subscription.on('message', (message, content, ackOrNack) => {
      console.log(`Content is ${content}`);
      //subscription.cancel();
    });
  } catch (error) {
    throw error;
  }
}

module.exports = { init };
