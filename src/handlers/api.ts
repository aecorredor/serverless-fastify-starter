// reflect-metadata is required for typedorm to work.
import 'reflect-metadata';
import AWS from 'aws-sdk';
import awsLambdaFastify from '@fastify/aws-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';

AWS.config.update({ region: process.env.PULUMI_AWS_REGION });

import { createDynamoConnections } from '../utils/dynamo';
import { createApp } from '../server';
import { createLogger } from '../utils/logger';
import { createConfig } from '../config';

const config = createConfig();
const logger = createLogger('serverless-fastify-starter');

const dynamoConnections = createDynamoConnections();

export const apiHandler: APIGatewayProxyHandler = (event, context) => {
  logger.info({ event, context }, 'Executing api handler');

  const proxy = awsLambdaFastify(
    createApp({ config, logger, dynamoConnections })
  );

  return proxy(event, context);
};
