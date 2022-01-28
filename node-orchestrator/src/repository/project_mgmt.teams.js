const { projectDb } = require('../config/db');

module.exports = {
  insert(data) {
    return projectDb('teams').insert(data);
  },
  update(id, data) {
    return projectDb('teams').update(data).where({ id });
  },
  delete(id) {
    return projectDb('teams').delete().where({ id });
  },
  getByTeamId(id) {
    return projectDb('teams').select('*').where({ id }).first();
  },
  getTeamByForeignId(id) {
    return projectDb('teams')
      .select('*')
      .where({ team_foreign_id: id })
      .first();
  },
};
