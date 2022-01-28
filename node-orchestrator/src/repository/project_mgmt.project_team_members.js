const { projectDb } = require('../config/db');

module.exports = {
  transaction() {
    return projectDb.transaction();
  },
  insert(data) {
    return projectDb('project_teams_members').insert(data);
  },
  delete(id) {
    return projectDb('project_teams_members').delete().where({ id });
  },
  deleteByProjectAndTeamId(projectId, teamId) {
    return projectDb('project_teams_members')
      .where({
        'project_teams_members.project_id': projectId,
        'project_teams_members.team_id': teamId,
      })
      .delete();
  },
};
