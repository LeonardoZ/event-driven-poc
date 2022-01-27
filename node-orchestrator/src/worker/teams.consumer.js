const Broker = require('rascal').BrokerAsPromised;
const config = require('../config/definitions.json');
const handler = require('./teams.handler');

async function init() {
  try {
    const broker = await Broker.create(config);
    // TODO
    broker.on('error', console.error);
    broker.on('blocked', (reason, { vhost, connectionUrl }) => {
      console.log(
        `Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`
      );
    });
    broker.on('unblocked', ({ vhost, connectionUrl }) => {
      console.log(
        `Vhost: ${vhost} was unblocked using connection: ${connectionUrl}.`
      );
    });

    const subscription = await broker.subscribe('events_teams_subs', 'b1');
    // TODO Redeliveries
    subscription.on('redeliveries_exceeded', (err, message, ackOrNack) => {
      console.error('Redeliveries exceeded', err);
      ackOrNack(err);
    });
    // TODO
    subscription.on('error', console.error);
    // TODO
    subscription.on('invalid_content', (err, message, ackOrNack) => {
      console.log('Failed to parse message');
    });

    subscription.on('message', async (message, content, ackOrNack) => {
      try {
        console.log(`Content is ${content}`);
        await handler(JSON.parse(content));
        ackOrNack();
        //subscription.cancel();
      } catch (error) {
        console.log(error);
        if (error.code && error.code === 'ECONNREFUSED') {
          console.log('REFUSED');
          ackOrNack(error, { strategy: 'nack', defer: 2000, requeue: true });
          // retry
        } else {
          console.log('REPUBLISH');
          // republish attempt
          ackOrNack(error, [
            { strategy: 'republish', defer: 5000, attempts: 6 },
            { strategy: 'nack' },
          ]);
        }
      }
    });
    const t = require('../repository/teams_mgmt.teams');
    const team = await t.getTeamById(1);
  } catch (error) {
    console.log(error);
    console.log(typeof error);
    throw error;
  }
}

process
  .on('SIGINT', function () {
    broker.shutdown(function () {
      process.exit();
    });
  })
  .on('SIGTERM', () => {
    broker.shutdown(function () {
      process.exit();
    });
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    broker.shutdown(function () {
      process.exit(-1);
    });
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    broker.shutdown(function () {
      process.exit(-2);
    });
  });

module.exports = { init };
