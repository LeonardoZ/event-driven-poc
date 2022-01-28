const consumer = require('./worker/consumer');

async function init() {
  try {
    await consumer.init();
  } catch (error) {
    console.log(error);
  }
}

init();
