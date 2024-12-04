import * as aws from '@pulumi/aws';

import { config } from './config';
import { tags } from './tags';
import { apiGateway } from './api-gateway';
import { apiHandlerName } from './constants';

// Create a DNS zone for our custom domain.
const dnsZone = new aws.route53.Zone(`${apiHandlerName}-dns-zone`, {
  name: config.apiEndpoint,
  tags,
});

// Provision an SSL certificate to enable SSL -- ensuring to do so in us-east-1.
// Certs for API Gateway must be in us-east-1, even though the API Gateway can
// be deployed to any region.
const sslCertProvider = new aws.Provider(
  `${apiHandlerName}-ssl-cert-provider`,
  {
    region: 'us-east-1',
  }
);
const sslCert = new aws.acm.Certificate(
  `${apiHandlerName}-ssl-cert`,
  {
    domainName: config.apiEndpoint,
    validationMethod: 'DNS',
  },
  { provider: sslCertProvider }
);

// Create the necessary DNS records for ACM to validate ownership, and wait for
// it. To finish the validation, you must add a CNAME record to your DNS
// configuration using the values provided in the ACM console inside AWS.
// If using an external DNS provider, you must also add a CAA record
// for ACM to validate ownership of the domain.
// Example: @ CAA 0 issue "amazon.com"
// If using the domain with API gateway, a CNAME mapping from the root domain
// to the lambda execution domain must also be added.
// For example, if the API Gateway endpoint is
// my-api.execute-api.us-east-1.amazonaws.com and the domain name is
// my-domain.com, you would create a CNAME record that maps my-domain.com to
// my-api.execute-api.us-east-1.amazonaws.com.
// For example, with 2 environments, dev and prod:
// dev.api.my-domain.com: dev.api CNAME ${id}.execute-api.us-east-1.amazonaws.com.
// api.my-domain.com:     api     CNAME ${id}.execute-api.us-east-1.amazonaws.com.
const sslCertValidationRecord = new aws.route53.Record(
  `${apiHandlerName}-ssl-cert-validation-record`,
  {
    zoneId: dnsZone.id,
    name: sslCert.domainValidationOptions[0].resourceRecordName,
    type: sslCert.domainValidationOptions[0].resourceRecordType,
    records: [sslCert.domainValidationOptions[0].resourceRecordValue],
    ttl: 10 * 60 /* 10 minutes */,
  }
);
const sslCertValidation = new aws.acm.CertificateValidation(
  `${apiHandlerName}-ssl-cert-validation`,
  {
    certificateArn: sslCert.arn,
    validationRecordFqdns: [sslCertValidationRecord.fqdn],
  },
  { provider: sslCertProvider }
);

// Configure an edge-optimized domain for our API Gateway. This will configure a
// Cloudfront CDN distribution behind the scenes and serve our API Gateway at a
// custom domain name over SSL.
const domain = new aws.apigateway.DomainName(`${apiHandlerName}-cdn`, {
  certificateArn: sslCertValidation.certificateArn,
  domainName: config.apiEndpoint,
});

new aws.apigateway.BasePathMapping(`${apiHandlerName}-graphql-domain-mapping`, {
  restApi: apiGateway.api,
  stageName: apiGateway.stage.stageName,
  domainName: domain.id,
});

// Finally create an A record for our domain that directs to our custom domain.
new aws.route53.Record(
  `${apiHandlerName}-dns-record`,
  {
    name: domain.domainName,
    type: 'A',
    zoneId: dnsZone.id,
    aliases: [
      {
        evaluateTargetHealth: true,
        name: domain.cloudfrontDomainName,
        zoneId: domain.cloudfrontZoneId,
      },
    ],
  },
  { dependsOn: sslCertValidation }
);

export const url = apiGateway.url;
export const urn = apiGateway.urn;
