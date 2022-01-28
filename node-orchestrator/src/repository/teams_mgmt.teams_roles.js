const { teamsDb } = require('../config/db');

module.exports = {
  getByTeamId(id) {
    return teamsDb('team_roles')
      .select(
        'team_roles.id',
        'team_roles.team_id',
        'team_roles.user_id',
        'team_roles.task_description',
        'team_roles.active',
        'users.fullname as member_name',
        'users.role'
      )
      .join('users', 'users.id', '=', 'team_roles.user_id')
      .where({ team_id: id, active: 1 });
  },
};
