import { INDEX_TYPE, Table } from '@typedorm/common';

export const exampleEntityTable = new Table({
  name: 'serverless-fastify-starter-example-entity-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    by_entity_start_date: {
      type: INDEX_TYPE.GSI,
      partitionKey: '__en',
      sortKey: 'startDate',
    },
    by_entity_owner_id: {
      type: INDEX_TYPE.GSI,
      partitionKey: '__en',
      sortKey: 'ownerId',
    },
  },
});
