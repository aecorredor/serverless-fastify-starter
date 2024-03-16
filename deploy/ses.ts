import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { config } from './config';

// After deploying the SES stack for the first time, we'll have to verify
// DKIM and MAIL FROM in the AWS console -> SES -> Configurations -> Identities.
// The DNS records must be added to the custom domain registrar so AWS can
// finish the verification setup.

const sesDomainIdentity = new aws.ses.DomainIdentity(
  'serverless-fastify-starter-ses-domain-identity',
  {
    domain: config.sesDomain,
  }
);

new aws.ses.DomainDkim('serverless-fastify-starter-ses-domain-dkim', {
  domain: sesDomainIdentity.domain,
});

new aws.ses.MailFrom('serverless-fastify-starter-ses-mail-from', {
  domain: sesDomainIdentity.domain,
  mailFromDomain: `${pulumi.getStack()}-mail.${config.sesDomain}`,
});

export const sesDomainIdentityArn = sesDomainIdentity.arn;
