import {
  CreateTableCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb';

import { createDynamoClient, createDynamoConnections } from '../utils/dynamo';
import { userTable } from '../tables/user.table';
import { exampleEntityTable } from '../tables/example-entity.table';

const client = createDynamoClient({ isTest: true });

export const connections = createDynamoConnections({ isTest: true });

const tables: CreateTableCommand['input'][] = [
  {
    TableName: userTable.name,
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
    AttributeDefinitions: [
      {
        AttributeName: 'pk',
        AttributeType: 'S',
      },
      {
        AttributeName: 'sk',
        AttributeType: 'S',
      },
      {
        AttributeName: 'email',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'pk',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'sk',
        KeyType: 'RANGE',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'by_email',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'sk',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
  },
  {
    TableName: exampleEntityTable.name,
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
    AttributeDefinitions: [
      {
        AttributeName: 'pk',
        AttributeType: 'S',
      },
      {
        AttributeName: 'sk',
        AttributeType: 'S',
      },
      {
        AttributeName: '__en',
        AttributeType: 'S',
      },
      {
        AttributeName: 'startDate',
        AttributeType: 'S',
      },
      {
        AttributeName: 'ownerId',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'pk',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'sk',
        KeyType: 'RANGE',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'by_entity_start_date',
        KeySchema: [
          {
            AttributeName: '__en',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'startDate',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      {
        IndexName: 'by_entity_owner_id',
        KeySchema: [
          {
            AttributeName: '__en',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'ownerId',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
  },
];

export const createTables = async () => {
  await Promise.all(
    tables.map((table) => client.send(new CreateTableCommand(table)))
  );
};

export const deleteTables = async () => {
  await Promise.all(
    tables.map((table) => client.send(new DeleteTableCommand(table)))
  );
};
