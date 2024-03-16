import * as pulumi from '@pulumi/pulumi';
import { PolicyDocument } from '@pulumi/aws/iam';

export const serviceName = 'serverless-fastify-starter';

export const apiHandlerName = `${serviceName}-handler`;

// For configuring IAM so that a lambda can be run.
export const lambdaExecutionPolicy: pulumi.Input<string | PolicyDocument> = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: 'sts:AssumeRole',
      Principal: {
        Service: 'lambda.amazonaws.com',
      },
      Sid: '',
    },
  ],
};
