import * as aws from '@pulumi/aws';

import { serviceName } from './constants';
import { tags } from './tags';

export const userTableName = `${serviceName}-user-table`;

export const userTable = new aws.dynamodb.Table(userTableName, {
  name: userTableName,
  attributes: [
    {
      name: 'pk',
      type: 'S',
    },
    {
      name: 'sk',
      type: 'S',
    },
    {
      name: 'email',
      type: 'S',
    },
  ],
  hashKey: 'pk',
  rangeKey: 'sk',
  ttl: {
    attributeName: 'ttl',
    enabled: true,
  },
  globalSecondaryIndexes: [
    {
      name: 'by_email',
      hashKey: 'email',
      rangeKey: 'sk',
      projectionType: 'ALL',
    },
  ],
  streamEnabled: true,
  streamViewType: 'NEW_AND_OLD_IMAGES',
  billingMode: 'PAY_PER_REQUEST',
  tags,
});

export const exampleEntityTableName = `${serviceName}-example-entity-table`;

export const exampleEntityTable = new aws.dynamodb.Table(
  exampleEntityTableName,
  {
    name: exampleEntityTableName,
    attributes: [
      {
        name: 'pk',
        type: 'S',
      },
      {
        name: 'sk',
        type: 'S',
      },
      {
        name: '__en',
        type: 'S',
      },
      {
        name: 'startDate',
        type: 'S',
      },
      {
        name: 'ownerId',
        type: 'S',
      },
    ],
    hashKey: 'pk',
    rangeKey: 'sk',
    ttl: {
      attributeName: 'ttl',
      enabled: true,
    },
    globalSecondaryIndexes: [
      {
        name: 'by_entity_start_date',
        hashKey: '__en',
        rangeKey: 'startDate',
        projectionType: 'ALL',
      },
      {
        name: 'by_entity_owner_id',
        hashKey: '__en',
        rangeKey: 'ownerId',
        projectionType: 'ALL',
      },
    ],
    streamEnabled: true,
    streamViewType: 'NEW_AND_OLD_IMAGES',
    billingMode: 'PAY_PER_REQUEST',
    tags,
  }
);
