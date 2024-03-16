import { INDEX_TYPE, Table } from '@typedorm/common';

export const userTable = new Table({
  name: 'serverless-fastify-starter-user-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    by_email: {
      type: INDEX_TYPE.GSI,
      partitionKey: 'email',
      sortKey: 'sk',
    },
  },
});
