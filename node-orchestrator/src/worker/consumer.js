const Broker = require('rascal').BrokerAsPromised;
let broker = null;
const config = require('../config/definitions.json');
const teamsHandler = require('./teams.handler');
const projectTeamHandler = require('./project_teams.handler');
const subs = [
  {
    sub: 'events_teams_subs',
    binding: 'b1',
    handler: teamsHandler,
  },
  {
    sub: 'events_project_teams_subs',
    binding: 'b2',
    handler: projectTeamHandler,
  },
];

async function init() {
  try {
    broker = await Broker.create(config);
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

    enableSubscription(broker);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function enableSubscription(broker) {
  for (const sub of subs) {
    configSubscription(broker, sub.sub, sub.binding, sub.handler);
  }
}

async function configSubscription(broker, sub, binding, handler) {
  try {
    const subscription = await broker.subscribe(sub, binding);
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
        await handler(JSON.parse(content));
        ackOrNack();
      } catch (error) {
        if (error.code && error.code === 'ECONNREFUSED') {
          ackOrNack(error, { strategy: 'nack', defer: 2000, requeue: true });
          // retry
        } else {
          // republish attempt
          ackOrNack(error, [
            { strategy: 'republish', defer: 5000, attempts: 6 },
            { strategy: 'nack' },
          ]);
        }
      }
    });
  } catch (error) {
    throw error;
  }
}

process
  .on('SIGINT', function () {
    if (broker) {
      broker.shutdown(function () {
        process.exit();
      });
    }
  })
  .on('SIGTERM', () => {
    if (broker) {
      broker.shutdown(function () {
        process.exit();
      });
    }
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    if (broker) {
      broker.shutdown(function () {
        process.exit(-1);
      });
    }
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    if (broker) {
      broker.shutdown(function () {
        process.exit(-2);
      });
    }
  });

module.exports = { init };
