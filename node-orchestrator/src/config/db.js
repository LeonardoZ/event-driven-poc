const teamsDb = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3308,
    user: 'dev',
    password: 'dev',
    database: 'team_mgmt',
  },
});

const projectDb = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3309,
    user: 'dev',
    password: 'dev',
    database: 'project_mgmt',
  },
});

module.exports = { teamsDb, projectDb };
