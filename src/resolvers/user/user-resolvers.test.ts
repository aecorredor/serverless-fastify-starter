import {
  SignInMutation,
  SignInMutationVariables,
  SignInDocument,
  ConfirmEmailMutation,
  ConfirmEmailMutationVariables,
  ConfirmEmailDocument,
} from '../../generated/operations';
import { createTestClient } from '../../test/test-client';
import * as emailUtils from '../../utils/email/email';
import { User } from '../../entities/user.entity';
import { getEntityManager } from '../../utils/dynamo';
import { EmailCode } from '../../entities/email-code.entity';

const testClient = createTestClient();
const userEntity = getEntityManager('user-table-connection');

describe('user resolvers', () => {
  let sendEmailSpy = jest.spyOn(emailUtils, 'sendEmail');

  beforeEach(() => {
    sendEmailSpy = jest.spyOn(emailUtils, 'sendEmail').mockResolvedValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates user, finds user, and confirms email code', async () => {
    const email = 'johndoe@gmail.com';

    const r = await testClient.mutate<SignInMutation, SignInMutationVariables>(
      SignInDocument,
      {
        variables: { input: { email } },
      }
    );

    expect(r.data?.signIn.email).toBe(email);
    expect(sendEmailSpy).toHaveBeenCalledTimes(1);

    const {
      items: [user],
    } = await userEntity.find(
      User,
      {
        email,
      },
      { queryIndex: 'by_email', keyCondition: { BEGINS_WITH: 'USER#' } }
    );

    expect(user.email).toBe(email);

    const {
      items: [emailCode],
    } = await userEntity.find(
      EmailCode,
      {
        email,
      },
      { keyCondition: { BEGINS_WITH: 'EMAIL_CODE#' } }
    );

    expect(emailCode.email).toBe(email);
    expect(emailCode.code).toEqual(expect.any(String));
    expect(emailCode.expiresAt).toEqual(expect.any(String));
    expect(emailCode.ttl).toEqual(expect.any(Number));

    // Second sign in just finds user and sends email.
    const r2 = await testClient.mutate<SignInMutation, SignInMutationVariables>(
      SignInDocument,
      {
        variables: { input: { email } },
      }
    );

    expect(r2.data?.signIn.email).toBe(email);
    expect(sendEmailSpy).toHaveBeenCalledTimes(2);

    const { items: emailCodes } = await userEntity.find(
      EmailCode,
      {
        email,
      },
      { keyCondition: { BEGINS_WITH: 'EMAIL_CODE#' } }
    );

    expect(emailCodes.length).toBe(2);

    const { data: confirmEmailData1 } = await testClient.mutate<
      ConfirmEmailMutation,
      ConfirmEmailMutationVariables
    >(ConfirmEmailDocument, {
      variables: {
        input: {
          email,
          code: emailCodes[0].code,
        },
      },
    });

    expect(confirmEmailData1.confirmEmail.accessToken).toEqual(
      expect.any(String)
    );
    expect(confirmEmailData1.confirmEmail.viewer).toEqual(
      expect.objectContaining({
        email,
        id: expect.any(String) as string,
        username: expect.any(String) as string,
      })
    );

    const { data: confirmEmailData2 } = await testClient.mutate<
      ConfirmEmailMutation,
      ConfirmEmailMutationVariables
    >(ConfirmEmailDocument, {
      variables: {
        input: {
          email,
          code: emailCodes[1].code,
        },
      },
    });

    // Assert access token + viewer is returned.
    expect(confirmEmailData2.confirmEmail.accessToken).toEqual(
      expect.any(String)
    );
    expect(confirmEmailData2.confirmEmail.viewer).toEqual(
      expect.objectContaining({
        email,
        id: expect.any(String) as string,
        username: expect.any(String) as string,
      })
    );

    const { items: emailCodes2 } = await userEntity.find(
      EmailCode,
      {
        email,
      },
      { keyCondition: { BEGINS_WITH: 'EMAIL_CODE#' } }
    );

    // Assert codes are deleted once they are used.
    expect(emailCodes2.length).toBe(0);
  });
});
