import { register } from 'ts-node';

register({
  transpileOnly: true,
});

import { createTables, deleteTables } from './test-dynamo';

process.env.STAGE = 'local';
process.env.ACCESS_TOKEN_SECRET = 'test-access-token-secret';

beforeAll(async () => {
  await createTables();
  console.log('created dynamo tables!');
});

afterAll(async () => {
  await deleteTables();
  console.log('deleted dynamo tables!');
});
