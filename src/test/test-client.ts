import { createMercuriusTestClient } from 'mercurius-integration-testing';

import { createAccessToken } from '../utils/auth';
import { createConfig } from '../config/index';
import { connections } from '../test/test-dynamo';
import { createTestApp } from '../server';
import { JwtUser } from '../typings/user';

export type MercuriusTestClient = ReturnType<typeof createMercuriusTestClient>;

const app = createTestApp({ dynamoConnections: connections });

export const createTestClient = (
  {
    authed,
    user,
  }: {
    authed: boolean;
    user?: JwtUser;
  } = { authed: false }
): MercuriusTestClient => {
  const client = createMercuriusTestClient(app);

  if (authed) {
    const accessToken = createAccessToken(
      user ?? {
        id: 'test-user-id',
        username: 'test-user',
        email: 'test@gmail.com',
      },
      { config: createConfig() }
    );

    client.setHeaders({
      authorization: `Bearer ${accessToken}`,
    });
  }

  return client;
};
