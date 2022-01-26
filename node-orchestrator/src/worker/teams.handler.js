// {"database":"team_mgmt","table":"teams","type":"update","ts":1643218801,"xid":8610,"commit":true,
// "data":{"id":1,"description":"teste 1","team_type":"fixed","active":1},"old":{"description":"teste"}}

const teamsMgmtTeamsRepository = require('../repository/teams_mgmt.teams');
const projectMgmtTeamsRepository = require('../repository/project_mgmt.teams');

async function insert(event) {
  try {
    // get from origin
    const team = await teamsMgmtTeamsRepository.getTeamById(event.data.id);
    if (!team) {
      throw new Error('Team not found');
    }
    await projectMgmtTeamsRepository.insert({
      team_foreign_id: team.id,
      description: team.description,
      active: team.active,
    });
    // post
  } catch (error) {
    throw error;
  }
}

async function update(event) {
  try {
    // get from origin
    const team = await teamsMgmtTeamsRepository.getTeamById(event.data.id);
    if (!team) {
      throw new Error('Team not found');
    }
    const dstTeam = await projectMgmtTeamsRepository.getTeamByForeignId(
      event.data.id
    );
    if (!dstTeam) {
      throw new Error('Team on Project Db not found');
    }
    const result = await projectMgmtTeamsRepository.update(dstTeam.id, {
      description: team.description,
      active: team.active,
    });
    // post
    if (!result) {
      throw new Error('Not applied');
    }
  } catch (error) {
    throw error;
  }
}
async function deleteEvent(event) {
  try {
    // get from origin
    const team = await teamsMgmtTeamsRepository.getTeamById(event.data.id);
    if (!team) {
      throw new Error('Team not found');
    }
    const dstTeam = await projectMgmtTeamsRepository.getTeamByForeignId(
      event.data.id
    );
    if (!dstTeam) {
      throw new Error('Team on Project Db not found');
    }
    const result = await projectMgmtTeamsRepository.delete(dstTeam.id);
    // post
    if (!result) {
      throw new Error('Not applied');
    }
  } catch (error) {
    throw error;
  }
}

async function factory(event) {
  try {
    const table = event.table;
    const type = event.type;
    console.log(event);
    if (table !== 'teams') {
      throw new Error('table not recognized');
    }

    switch (type) {
      case 'insert':
        await insert(event);
        break;
      case 'update':
        await update(event);
        break;
      case 'delete':
        await deleteEvent(event);
        break;
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = factory;
