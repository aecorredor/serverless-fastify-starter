import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { customAlphabet } from 'nanoid/async';
import { ulid } from 'ulid';

const nanoid = customAlphabet('1234567890ABCDEFGH', 6);
const nanoidUsername = customAlphabet('1234567890ABCDEFGH', 4);

dayjs.extend(utc);

import { MutationResolvers, QueryResolvers } from '../../generated/resolvers';
import { User } from '../../entities/user.entity';
import { EmailCode } from '../../entities/email-code.entity';
import { sendEmail, getSignInTemplate } from '../../utils/email';
import { createAccessToken } from '../../utils/auth';
import { JwtUser } from '../../typings/user';
import { AuthenticationError } from '../../../src/utils/error';

const signInResolver: MutationResolvers['signIn'] = async (
  parent,
  args,
  ctx
) => {
  const { dynamoConnections } = ctx;
  const email = args.input.email.toLowerCase();

  const { items } = await dynamoConnections.user.entityManager.find(
    User,
    {
      email,
    },
    { queryIndex: 'by_email', keyCondition: { BEGINS_WITH: 'USER#' } }
  );

  const existingUser = items[0] as User | undefined;

  const codeExpirationDate = dayjs.utc().add(1, 'hour');

  if (existingUser) {
    const emailCode = new EmailCode();
    emailCode.email = email;
    emailCode.code = await nanoid();
    emailCode.expiresAt = codeExpirationDate.toISOString();
    emailCode.ttl = codeExpirationDate.unix();

    await dynamoConnections.user.entityManager.create(emailCode);
    await sendEmail(getSignInTemplate(existingUser, emailCode.code));
  } else {
    const toCreate = new User();
    toCreate.id = ulid();
    toCreate.email = email;
    toCreate.username = `${email.split('@')[0]}#${await nanoidUsername()}`;

    await dynamoConnections.user.entityManager.create(toCreate);

    const emailCode = new EmailCode();
    emailCode.email = email;
    emailCode.code = await nanoid();
    emailCode.expiresAt = codeExpirationDate.toISOString();
    emailCode.ttl = codeExpirationDate.unix();

    await dynamoConnections.user.entityManager.create(emailCode);
    await sendEmail(getSignInTemplate(toCreate, emailCode.code));
  }

  return { email };
};

const confirmEmailResolver: MutationResolvers['confirmEmail'] = async (
  parent,
  args,
  ctx
) => {
  const { dynamoConnections } = ctx;
  const email = args.input.email.toLowerCase();

  const emailCode = await dynamoConnections.user.entityManager.findOne(
    EmailCode,
    {
      email,
      code: args.input.code.toUpperCase(),
    }
  );

  if (!emailCode) {
    throw new AuthenticationError('Bad Code');
  }

  const now = dayjs.utc();
  const expiresAt = dayjs.utc(emailCode.expiresAt);

  if (now.isAfter(expiresAt)) {
    throw new AuthenticationError('Expired Code');
  }

  const {
    items: [existingUser],
  } = await dynamoConnections.user.entityManager.find(
    User,
    {
      email,
    },
    { queryIndex: 'by_email', keyCondition: { BEGINS_WITH: 'USER#' } }
  );

  await dynamoConnections.user.entityManager.delete(EmailCode, {
    email: emailCode.email,
    code: emailCode.code,
  });

  return {
    accessToken: createAccessToken(existingUser, { config: ctx.config }),
    viewer: existingUser,
  };
};

const getViewerResolver: QueryResolvers['getViewer'] = (parent, args, ctx) => {
  // TODO: augment user type.
  return ctx.viewer as JwtUser;
};

export const UserResolvers = {
  Mutation: {
    signIn: signInResolver,
    confirmEmail: confirmEmailResolver,
  },
  Query: {
    getViewer: getViewerResolver,
  },
};
