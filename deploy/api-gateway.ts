import * as apigateway from '@pulumi/aws-apigateway';

import { handler } from './api-handler';

export const apiGateway = new apigateway.RestAPI('serverless-fastify-starter', {
  routes: [
    {
      path: '/graphql',
      method: 'GET',
      eventHandler: handler,
    },
    {
      path: '/graphql',
      method: 'POST',
      eventHandler: handler,
    },
    {
      path: '/graphql',
      method: 'OPTIONS',
      eventHandler: handler,
    },
  ],
});
