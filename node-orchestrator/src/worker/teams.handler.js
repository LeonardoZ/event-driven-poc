// {"database":"team_mgmt","table":"teams","type":"update","ts":1643218801,"xid":8610,"commit":true,
// "data":{"id":1,"description":"teste 1","team_type":"fixed","active":1},"old":{"description":"teste"}}

function factory(event) {
  const table = event.table;
  const type = event.type;

  if (table !== 'teams') {
    throw new Error('table not recognized');
  }

  switch (type) {
    case 'insert':
      break;
    case 'update':
      break;
    case 'update':
      break;
    default:
      break;
  }
}

module.exports = factory;
