const { teamsDb } = require('../config/db');

module.exports = {
  getTeamById(id) {
    return teamsDb('teams').select('*').where({ id }).first();
  },
};
