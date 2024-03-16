import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { tags } from './tags';
import { config } from './config';
import { apiHandlerName } from './constants';
import { apiHandlerRole } from './iam';
import { createHandlerAssetArchive } from './deploy-utils';

export const handler = new aws.lambda.Function(apiHandlerName, {
  role: apiHandlerRole.arn,
  runtime: 'nodejs18.x',
  memorySize: 1024,
  code: createHandlerAssetArchive('../dist/api.js'),
  timeout: 10,
  handler: 'index.apiHandler',
  environment: pulumi
    .all([config.accessTokenSecret, config.awsRegion])
    .apply(([ACCESS_TOKEN_SECRET, PULUMI_AWS_REGION]) => ({
      variables: {
        ACCESS_TOKEN_SECRET,
        STAGE: pulumi.getStack(),
        PULUMI_AWS_REGION,
      },
    })),
  tags,
});
