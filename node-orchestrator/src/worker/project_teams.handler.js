// {"database":"team_mgmt","table":"teams","type":"update","ts":1643218801,"xid":8610,"commit":true,
// "data":{"id":1,"description":"teste 1","team_type":"fixed","active":1},"old":{"description":"teste"}}

const teamsMgmtTeamRolesRepository = require('../repository/teams_mgmt.teams_roles');
const projectMgmtTeamsRepository = require('../repository/project_mgmt.teams');
const projectMgmtProjectTeamMembers = require('../repository/project_mgmt.project_team_members');

async function update(event) {
  let trx;
  try {
    // identify if is event is an activation
    const actual = event.data;
    const old = event.old;
    const isActivation = old.active === 0 && actual.active === 1;

    if (!isActivation) {
      await projectMgmtProjectTeamMembers.deleteByProjectAndTeamId(
        actual.project_id,
        actual.team_id
      );
      return;
    }

    trx = await projectMgmtProjectTeamMembers.transaction();
    // check if team exists on target
    await processMessage(actual, trx);
    await trx.commit();
    return;
  } catch (error) {
    if (trx) {
      await trx.rollback();
    }
    throw error;
  }
}

async function insert(event) {
  let trx;
  try {
    // identify if is event is an activation
    const actual = event.data;
    const isActivation = actual.active === 1;

    if (!isActivation) {
      return;
    }

    // check if team exists on target

    trx = await projectMgmtProjectTeamMembers.transaction();
    await processMessage(actual, trx);
    await trx.commit();
    return;
  } catch (error) {
    if (trx) {
      await trx.rollback();
    }
    throw error;
  }
}

async function deleteRecord(event) {
  let trx;
  try {
    // identify if is event is an activation
    const data = event.data;

    if (!isActivation) {
      return;
    }

    // check if team exists on target

    await projectMgmtProjectTeamMembers.deleteByProjectAndTeamId(
      data.project_id,
      data.team_id
    );

    return;
  } catch (error) {
    if (trx) {
      await trx.rollback();
    }
    throw error;
  }
}

async function processMessage(data, trx) {
  try {
    const dstTeam = await projectMgmtTeamsRepository.getByTeamId(data.team_id);
    if (!dstTeam) {
      throw new Error('Team on Project Db not found');
    }
    // get team members on origin
    const teamRoles = await teamsMgmtTeamRolesRepository.getByTeamId(
      dstTeam.team_foreign_id
    );

    if (!teamRoles || teamRoles.length === 0) {
      return;
    }

    await projectMgmtProjectTeamMembers
      .deleteByProjectAndTeamId(data.project_id, dstTeam.id)
      .transacting(trx);

    const toInsert = teamRoles.map((teamRole) => {
      return {
        project_id: data.project_id,
        team_id: dstTeam.id,
        member_name: teamRole.member_name,
        role: teamRole.role,
      };
    });
    await projectMgmtProjectTeamMembers.insert(toInsert).transacting(trx);
  } catch (error) {
    throw error;
  }
}

async function processRemoval(data, trx) {
  try {
    await projectMgmtProjectTeamMembers
      .deleteByProjectAndTeamId(data.project_id, data.team_id)
      .transacting(trx);

    return;
  } catch (error) {
    throw error;
  }
}

async function factory(event) {
  try {
    const table = event.table;
    const type = event.type;
    if (table !== 'project_teams') {
      throw new Error('table not recognized');
    }

    switch (type) {
      case 'insert':
        await insert(event);
        return;
      case 'delete':
        await insert(event);
        return;
      case 'bootstrap-insert':
        await insert(event);
        return;
      case 'update':
        await update(event);
        return;
      default:
        return;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = factory;
