import * as pulumi from '@pulumi/pulumi';
import { config } from './config';

export const tags = {
  project: config.project,
  deployedBy: config.deployedBy,
  stage: pulumi.getStack(),
};
