import { FastifyRequest } from 'fastify';
import { Logger } from 'pino';

import { Config } from '../config/index';
import { getViewer } from '../utils/auth';
import { JwtUser } from '../typings/user';
import { DynamoConnections } from '../utils/dynamo';
import { Loaders, getLoaders } from '../loaders/index';

export interface AppContext {
  config: Config;
  dynamoConnections: DynamoConnections;
  viewer: JwtUser | null;
  logger: Logger;
  loaders: Loaders;
}

export const buildContext = ({
  config,
  logger,
  dynamoConnections,
  req,
}: {
  logger: Logger;
  config: Config;
  dynamoConnections: DynamoConnections;
  req: FastifyRequest;
}): Promise<AppContext> | AppContext => {
  return {
    logger,
    config,
    dynamoConnections,
    viewer: getViewer({ req, config }),
    loaders: getLoaders(),
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module 'mercurius' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface MercuriusContext extends PromiseType<AppContext> {}
}
