import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

import { apiHandlerName, lambdaExecutionPolicy } from './constants';
import { tags } from './tags';
import { config } from './config';
import { userTable, exampleEntityTable } from './dynamo';

export const apiHandlerRole = new aws.iam.Role(`${apiHandlerName}-role`, {
  assumeRolePolicy: lambdaExecutionPolicy,
  tags,
});

const dynamoAccessPolicy = new aws.iam.Policy(
  `${apiHandlerName}-dynamo-access-policy`,
  {
    policy: pulumi
      .all([userTable.arn, exampleEntityTable.arn])
      .apply(([userTableArn, exampleEntityTableArn]) => {
        return JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'dynamodb:CreateTable',
                'dynamodb:UpdateTable',
                'dynamodb:DeleteTable',
                'dynamodb:DescribeTable',
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:BatchGetItem',
                'dynamodb:BatchWriteItem',
                'dynamodb:DescribeTimeToLive',
                'dynamodb:UpdateTimeToLive',
              ],
              Resource: [
                userTableArn,
                `${userTableArn}/index/*`,
                exampleEntityTableArn,
                `${exampleEntityTableArn}/index/*`,
              ],
            },
            {
              Effect: 'Allow',
              Action: [
                'dynamodb:DescribeTable',
                'dynamodb:GetRecords',
                'dynamodb:GetShardIterator',
                'dynamodb:ListStreams',
              ],
              Resource: [
                `${userTableArn}/stream/*}`,
                `${exampleEntityTableArn}/stream/*}`,
              ],
            },
          ],
        });
      }),
  }
);

const sesAccessPolicy = new aws.iam.Policy(
  `${apiHandlerName}-ses-access-policy`,
  {
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['ses:SendEmail', 'ses:SendRawEmail'],
          Effect: 'Allow',
          Resource: '*',
          Condition: {
            StringLike: {
              'ses:FromAddress': `no-reply@${config.sesDomain}`,
            },
          },
        },
      ],
    }),
  }
);

new aws.iam.RolePolicyAttachment(`${apiHandlerName}-role-policy-attachment`, {
  role: apiHandlerRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

new aws.iam.RolePolicyAttachment(
  `${apiHandlerName}-ses-access-role-policy-attachment`,
  {
    role: apiHandlerRole,
    policyArn: sesAccessPolicy.arn,
  }
);

new aws.iam.RolePolicyAttachment(
  `${apiHandlerName}-dynamo-access-role-policy-attachment`,
  {
    role: apiHandlerRole,
    policyArn: dynamoAccessPolicy.arn,
  }
);
