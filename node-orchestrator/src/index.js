const teamsConsumer = require('./worker/teams.consumer');

async function init() {
  try {
    await teamsConsumer.init();
  } catch (error) {
    console.log(error);
  }
}

init();
