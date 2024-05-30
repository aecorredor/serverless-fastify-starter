import Fastify, { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { mergeResolvers } from '@graphql-tools/merge';
import { mergeSchemas } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { print } from 'graphql';
import cors from '@fastify/cors';

import { AppLogger, createLogger } from './utils/logger';
import { schemaDocumentNode } from './schemas';
import resolvers from './resolvers';
import { buildContext } from './context';
import { createDynamoConnections } from './utils/dynamo';
import { Config, createConfig } from './config';
import { getPermissions } from './permissions';
import { AuthenticationError } from './utils/error';

const getSchemaWithMiddleware = () => {
  const mergedResolvers = mergeResolvers(resolvers);
  const schema = mergeSchemas({
    typeDefs: print(schemaDocumentNode),
    resolvers: mergedResolvers,
  });
  const schemaWithMiddleware = applyMiddleware(schema, getPermissions());

  return schemaWithMiddleware;
};

export const createApp = ({
  config,
  logger,
  dynamoConnections,
}: {
  config: Config;
  logger: AppLogger;
  dynamoConnections: ReturnType<typeof createDynamoConnections>;
}): FastifyInstance => {
  const app = Fastify({
    logger,
  });

  void app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }

      const hostname = new URL(origin).hostname;

      if (
        hostname === 'localhost' ||
        hostname.includes('TODO-addyourdomain.com')
      ) {
        cb(null, true);
        return;
      }

      cb(new AuthenticationError('Not Authorized'), false);
    },
  });

  void app.register(mercurius, {
    context: (req) => buildContext({ req, dynamoConnections, config, logger }),
    schema: getSchemaWithMiddleware(),
  });

  return app;
};

export const createTestApp = ({
  dynamoConnections,
}: {
  dynamoConnections: ReturnType<typeof createDynamoConnections>;
}): FastifyInstance => {
  const logger = createLogger('test-serverless-fastify-starter');
  const app = Fastify({
    logger,
  });
  const config = createConfig();

  void app.register(mercurius, {
    schema: getSchemaWithMiddleware(),
    context: async (req) => {
      const context = await buildContext({
        req,
        dynamoConnections,
        config,
        logger,
      });

      return context;
    },
  });

  return app;
};
