import * as pulumi from '@pulumi/pulumi';

const appConfig = new pulumi.Config();
const awsConfig = new pulumi.Config('aws');

export const config = {
  accessTokenSecret: appConfig.requireSecret('accessTokenSecret'),
  apiEndpoint: appConfig.require('apiEndpoint'),
  awsRegion: awsConfig.require('region'),
  deployedBy: appConfig.require('deployedBy'),
  project: appConfig.require('project'),
  sesDomain: appConfig.require('sesDomain'),
};
