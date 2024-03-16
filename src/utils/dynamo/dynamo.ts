import { EntityAttributes, EntityTarget } from '@typedorm/common';
import { DocumentClientTypes } from '@typedorm/document-client';
import { EntityManager, EntityManagerFindOptions } from '@typedorm/core';
import { ReadBatch } from '@typedorm/core';
import sjson from 'secure-json-parse';
import {
  createConnection,
  getEntityManager as coreGetEntityManager,
  getTransactionManger as coreGetTransactionManager,
  getBatchManager as coreGetBatchManager,
} from '@typedorm/core';
import { DocumentClientV3 } from '@typedorm/document-client';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

import { userTable } from '../../tables/user.table';
import { exampleEntityTable } from '../../tables/example-entity.table';
import { EmailCode } from '../../entities/email-code.entity';
import { User } from '../../entities/user.entity';
import { ExampleEntity } from '../../entities/example.entity';

export type ConnectionName =
  | 'user-table-connection'
  | 'example-entity-table-connection';

export const getEntityManager = (connectionName: ConnectionName) => {
  return coreGetEntityManager(connectionName);
};

export const getTransactionManager = (connectionName: ConnectionName) => {
  return coreGetTransactionManager(connectionName);
};

export const getBatchManager = (connectionName: ConnectionName) => {
  return coreGetBatchManager(connectionName);
};

export const createDynamoClient = (
  { isTest }: { isTest: boolean } = { isTest: false }
) => {
  const clientOptions: DynamoDBClientConfig = isTest
    ? {
        endpoint: 'http://localhost:8000',
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'testaccesskeyid',
          secretAccessKey: 'testsecretaccesskey',
        },
      }
    : {};

  return new DynamoDBClient(clientOptions);
};

export const createDynamoConnections = (
  { isTest }: { isTest: boolean } = { isTest: false }
) => {
  const documentClient = new DocumentClientV3(createDynamoClient({ isTest }), {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

  return {
    user: createConnection({
      name: 'user-table-connection',
      table: userTable,
      entities: [User, EmailCode],
      documentClient,
    }),
    exampleEntity: createConnection({
      name: 'example-entity-table-connection',
      table: exampleEntityTable,
      entities: [ExampleEntity],
      documentClient,
    }),
  };
};

export type DynamoConnections = ReturnType<typeof createDynamoConnections>;

/**
 * Helper for implementing pagination. If no limit is provided, it will
 * exhaustively get all matching items, otherwise it will stop after getting
 * the limit number of items. Note that this helper bypasses the 1MB dynamo
 * limit. It's meant to really return all items that match the query. When
 * "limit" is passed in, there is a chance it returns a little more than the
 * value specified.
 *
 */
export const findMany = async <
  Entity,
  PartitionKey = Partial<EntityAttributes<Entity>> | string
>(
  entity: EntityTarget<Entity>,
  partitionKey: PartitionKey,
  queryOptions: EntityManagerFindOptions<Entity, PartitionKey>,
  { manager }: { manager: EntityManager }
): Promise<{
  items: Entity[];
  cursor: DocumentClientTypes.Key | undefined;
}> => {
  const { limit, cursor: initialCursor, ...findQueryOptions } = queryOptions;
  let cursor = initialCursor;
  const items: Entity[] = [];

  do {
    const page = await manager.find(entity, partitionKey, {
      ...findQueryOptions,
      cursor,
    });

    items.push(...page.items);
    cursor = page.cursor;
  } while (cursor && (!limit || items.length < limit));

  return { items, cursor };
};

export const batchRead = async <Entity>(
  entity: EntityTarget<Entity>,
  keys: string[],
  {
    connectionName,
    keySerializer,
  }: {
    connectionName: ConnectionName;
    keySerializer: (key: Entity) => string;
  }
) => {
  const batchManager = getBatchManager(connectionName);
  const batchItemsToRead = new ReadBatch();

  keys.forEach((key) => {
    batchItemsToRead.addGet(entity, sjson.parse(key));
  });

  const { items } = await batchManager.read(batchItemsToRead);
  const batchResponse = items as Entity[];

  const itemsByKey = batchResponse.reduce((acc, item) => {
    acc[keySerializer(item)] = item;
    return acc;
  }, {} as { [id: string]: Entity });

  return keys.map((key) => itemsByKey[key]);
};
