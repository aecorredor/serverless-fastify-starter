import nodemailer from 'nodemailer';
import * as AWS from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

import { User } from '../../entities/user.entity';

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  SES: {
    ses: new AWS.SES({
      // @ts-expect-error - this is a valid option.
      defaultProvider,
    }),
    aws: AWS,
  },
});

export const sendEmail = (template: EmailTemplate) => {
  return new Promise<Error | void>((resolve, reject) => {
    transporter.sendMail(
      {
        ...template,
        from: '"Add Your Subject" <no-reply@addyourdomain.com>',
      },
      (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      }
    );
  });
};

export const getSignInTemplate = (user: User, confirmationCode: string) => {
  const to = user.email;
  const subject = `Your confirmation code: ${confirmationCode}`;
  const html = `
  <p>You are receiving this email because you've tried to sign in to
  <TODO-SERVICE-NAME>. Enter the following code to sign in:</p>

  <p><b>${confirmationCode}</b></p>

  <p>This code will expire in one hour.</p>
  `;

  return { to, subject, html };
};
